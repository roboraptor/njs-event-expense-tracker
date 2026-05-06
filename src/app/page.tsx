import { getExpenses, getBalances, getSettings } from '@/lib/db';
import { removeExpense } from './actions';

export default async function Home() {
  const expenses = getExpenses();
  const balancesData = getBalances();
  const settings = getSettings();

  return (
    <div className="row">
      <div className="col-12 mb-4">
        <div className="card text-center bg-light">
          <div className="card-body">
            <h2 className="card-title text-success">{settings.currency}{balancesData.totalExpenses.toFixed(2)}</h2>
            <p className="card-text text-muted">Total Expenses So Far</p>
          </div>
        </div>
      </div>

      <div className="col-12">
        <div className="card">
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Expense Log</h5>
            <span className="badge bg-light text-primary">{expenses.length} records</span>
          </div>
          <div className="card-body">
            {expenses.length === 0 ? (
              <p className="text-muted text-center py-4">No expenses recorded yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Category</th>
                      <th>Paid By</th>
                      <th>Applies To</th>
                      <th>Description</th>
                      <th>Amount</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map(expense => (
                      <tr key={expense.id}>
                        <td>{new Date(expense.date).toLocaleDateString()}</td>
                        <td><span className="badge bg-secondary">{expense.category}</span></td>
                        <td><strong>{expense.payer_name}</strong></td>
                        <td>
                          {expense.for_user_id ? (
                            <span className="badge bg-warning text-dark">{expense.for_user_name} Only</span>
                          ) : (
                            <span className="badge bg-info text-dark">Group</span>
                          )}
                        </td>
                        <td>{expense.title}</td>
                        <td className="text-success fw-bold">{settings.currency}{expense.amount.toFixed(2)}</td>
                        <td className="text-end">
                          <form action={removeExpense}>
                            <input type="hidden" name="id" value={expense.id} />
                            <button type="submit" className="btn btn-sm btn-outline-danger">Delete</button>
                          </form>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
