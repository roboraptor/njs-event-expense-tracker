import Database from 'better-sqlite3';
import path from 'path';

// Create or connect to the SQLite database
const dbPath = path.join(process.cwd(), 'expenses.db');
const db = new Database(dbPath);

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    days INTEGER NOT NULL DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    amount REAL NOT NULL,
    payer_id INTEGER NOT NULL,
    date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    category TEXT DEFAULT 'Other',
    for_user_id INTEGER DEFAULT NULL,
    FOREIGN KEY(payer_id) REFERENCES users(id),
    FOREIGN KEY(for_user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  INSERT OR IGNORE INTO settings (key, value) VALUES ('currency', '$');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('use_days_attended', 'true');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('use_central_account', 'false');
`);

// Add category column to existing databases if it doesn't exist
try {
  const tableInfo = db.pragma("table_info(expenses)") as any[];
  if (!tableInfo.some(col => col.name === 'category')) {
    db.exec(`ALTER TABLE expenses ADD COLUMN category TEXT DEFAULT 'Other'`);
  }
  if (!tableInfo.some(col => col.name === 'for_user_id')) {
    db.exec(`ALTER TABLE expenses ADD COLUMN for_user_id INTEGER DEFAULT NULL`);
  }
} catch (e) {
  // Ignore errors
}

export interface Settings {
  currency: string;
  useDaysAttended: boolean;
  useCentralAccount: boolean;
}

export interface User {
  id: number;
  name: string;
  days: number;
}

export interface Expense {
  id: number;
  title: string;
  amount: number;
  payer_id: number;
  date: string;
  category: string;
  for_user_id: number | null;
  payer_name?: string;
  for_user_name?: string;
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
}

export interface BalancesData {
  userBalances: { id: number; name: string; days: number; paid: number; share: number; balance: number }[];
  settlements: Settlement[];
  totalExpenses: number;
  totalDays: number;
  dailyRate: number;
  settings: Settings;
}

export function getSettings(): Settings {
  const rows = db.prepare('SELECT * FROM settings').all() as { key: string; value: string }[];
  const settingsMap = rows.reduce((acc, row) => ({ ...acc, [row.key]: row.value }), {} as any);
  return {
    currency: settingsMap.currency || '$',
    useDaysAttended: settingsMap.use_days_attended === 'true',
    useCentralAccount: settingsMap.use_central_account === 'true'
  };
}

export function updateSetting(key: string, value: string): Database.RunResult {
  return db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(key, value);
}

export function getUsers(): User[] {
  return db.prepare('SELECT * FROM users').all() as User[];
}

export function addUser(name: string, days: number = 1): { success: boolean; id?: number | bigint; error?: string } {
  try {
    const result = db.prepare('INSERT INTO users (name, days) VALUES (?, ?)').run(name, days);
    return { success: true, id: result.lastInsertRowid };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export function getExpenses(): Expense[] {
  return db.prepare(`
    SELECT expenses.*, u1.name as payer_name, u2.name as for_user_name 
    FROM expenses 
    JOIN users u1 ON expenses.payer_id = u1.id
    LEFT JOIN users u2 ON expenses.for_user_id = u2.id
    ORDER BY date DESC
  `).all() as Expense[];
}

export function addExpense(title: string, amount: number, payer_id: number, category: string = 'Other', for_user_id: number | null = null): { success: boolean; id?: number | bigint; error?: string } {
  try {
    const result = db.prepare('INSERT INTO expenses (title, amount, payer_id, category, for_user_id) VALUES (?, ?, ?, ?, ?)').run(title, amount, payer_id, category, for_user_id);
    return { success: true, id: result.lastInsertRowid };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export function deleteExpense(id: number): Database.RunResult {
  return db.prepare('DELETE FROM expenses WHERE id = ?').run(id);
}

export function deleteUser(id: number): Database.RunResult {
  // Also delete their expenses to avoid foreign key issues
  db.prepare('DELETE FROM expenses WHERE payer_id = ?').run(id);
  return db.prepare('DELETE FROM users WHERE id = ?').run(id);
}

export function getBalances(): BalancesData {
  const users = getUsers();
  const expenses = getExpenses();
  const settings = getSettings();

  if (users.length === 0) return { settlements: [], userBalances: [], totalExpenses: 0, totalDays: 0, dailyRate: 0, settings };

  const groupExpenses = expenses.filter(e => e.for_user_id === null);
  const individualExpenses = expenses.filter(e => e.for_user_id !== null);

  const totalGroupExpenses = groupExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalDays = users.reduce((sum, user) => sum + user.days, 0);
  const dailyRate = totalDays > 0 ? totalGroupExpenses / totalDays : 0;
  const averageExpense = totalGroupExpenses / users.length;

  // Calculate each user's balance based on settings and duration of stay
  const balances = users.map(user => {
    const paidByThisUser = expenses
      .filter(exp => exp.payer_id === user.id)
      .reduce((sum, exp) => sum + exp.amount, 0);

    const personalExpenses = individualExpenses
      .filter(exp => exp.for_user_id === user.id)
      .reduce((sum, exp) => sum + exp.amount, 0);
      
    const groupFairShare = settings.useDaysAttended ? (dailyRate * user.days) : averageExpense;
    const fairShare = groupFairShare + personalExpenses;
      
    return {
      id: user.id,
      name: user.name,
      days: user.days,
      paid: paidByThisUser,
      share: fairShare,
      balance: paidByThisUser - fairShare // positive = gets money back, negative = owes money
    };
  });

  // Calculate settlements (who owes whom)
  const debtors = balances.filter(b => b.balance < -0.01).map(b => ({ ...b, balance: Math.abs(b.balance) }));
  const creditors = balances.filter(b => b.balance > 0.01).map(b => ({ ...b }));
  
  const settlements: Settlement[] = [];
  
  let i = 0; // debtors index
  let j = 0; // creditors index

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    
    const amount = Math.min(debtor.balance, creditor.balance);
    
    settlements.push({
      from: debtor.name,
      to: creditor.name,
      amount: amount
    });
    
    debtor.balance -= amount;
    creditor.balance -= amount;
    
    if (debtor.balance < 0.01) i++;
    if (creditor.balance < 0.01) j++;
  }

  return {
    userBalances: balances,
    settlements: settlements,
    totalExpenses: totalGroupExpenses, // total pool for the group
    totalDays,
    dailyRate,
    settings
  };
}
