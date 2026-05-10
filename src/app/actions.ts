'use server';

import { revalidatePath } from 'next/cache';
import { addUser, addExpense, deleteExpense, deleteUser, updateSetting, updateUser } from '@/lib/db';

export async function createUser(formData: FormData) {
  const name = formData.get('name') as string;
  const days = parseInt(formData.get('days') as string, 10) || 1;
  
  if (!name || name.trim() === '') return;
  
  addUser(name.trim(), days);
  revalidatePath('/settings');
  revalidatePath('/settlements');
  revalidatePath('/');
}

export async function createExpense(formData: FormData) {
  const title = formData.get('title') as string;
  const amount = parseFloat(formData.get('amount') as string);
  const payer_id = parseInt(formData.get('payer_id') as string, 10);
  const category = formData.get('category') as string || 'Other';
  const for_user_id_raw = formData.get('for_user_id') as string;
  const for_user_id = for_user_id_raw ? parseInt(for_user_id_raw, 10) : null;
  
  if (!title || isNaN(amount) || isNaN(payer_id)) return;
  
  addExpense(title.trim(), amount, payer_id, category, for_user_id);
  revalidatePath('/');
  revalidatePath('/add');
  revalidatePath('/settlements');
}

export async function removeExpense(formData: FormData) {
  const id = parseInt(formData.get('id') as string, 10);
  if (isNaN(id)) return;
  
  deleteExpense(id);
  revalidatePath('/');
  revalidatePath('/settlements');
}

export async function removeUser(formData: FormData) {
  const id = parseInt(formData.get('id') as string, 10);
  if (isNaN(id)) return;
  
  deleteUser(id);
  revalidatePath('/settings');
  revalidatePath('/settlements');
  revalidatePath('/');
}

export async function editUser(formData: FormData) {
  const id = parseInt(formData.get('id') as string, 10);
  const name = formData.get('name') as string;
  const days = parseInt(formData.get('days') as string, 10) || 1;
  
  if (isNaN(id) || !name || name.trim() === '') return;
  
  updateUser(id, name.trim(), days);
  revalidatePath('/settings');
  revalidatePath('/settlements');
  revalidatePath('/');
  revalidatePath('/add');
}

export async function updateGlobalSettings(formData: FormData) {
  const currency = formData.get('currency') as string;
  const useDaysAttended = formData.get('useDaysAttended') === 'true' ? 'true' : 'false';
  const useCentralAccount = formData.get('useCentralAccount') === 'true' ? 'true' : 'false';
  
  if (currency) updateSetting('currency', currency);
  updateSetting('use_days_attended', useDaysAttended);
  updateSetting('use_central_account', useCentralAccount);
  
  revalidatePath('/');
  revalidatePath('/add');
  revalidatePath('/settings');
  revalidatePath('/settlements');
}
