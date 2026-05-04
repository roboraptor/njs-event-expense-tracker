import { getUsers, getSettings } from '@/lib/db';
import { createExpense } from '@/app/actions';

export default async function AddRecordPage() {
  const users = getUsers();
  const settings = getSettings();

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="card">
          <div className="card-header bg-info text-white">
            <h5 className="mb-0">Add New Receipt / Payment</h5>
          </div>
          <div className="card-body">
            {users.length === 0 ? (
              <div className="alert alert-warning">
                Please add some attendees in the <strong>Settings</strong> page before adding expenses.
              </div>
            ) : (
              <form action={createExpense}>
                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select name="category" className="form-select" required defaultValue="Other">
                    <option value="Food & Drinks">Food & Drinks</option>
                    <option value="Accommodation">Accommodation</option>
                    <option value="Transport">Transport</option>
                    <option value="Activities">Activities</option>
                    <option value="Contribution">Pool Contribution (Pitch in)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Description / Receipt Name</label>
                  <input 
                    type="text" 
                    name="title" 
                    className="form-control" 
                    placeholder="e.g. Saturday Dinner, Hotel, Gas..." 
                    required 
                  />
                  <div className="form-text">What was this payment for?</div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Amount</label>
                  <div className="input-group">
                    <span className="input-group-text">{settings.currency}</span>
                    <input 
                      type="number" 
                      name="amount" 
                      className="form-control" 
                      placeholder="0.00" 
                      step="0.01" 
                      min="0"
                      required 
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label">Who Paid?</label>
                  <select name="payer_id" className="form-select" required defaultValue="">
                    <option value="" disabled>Select the person who paid</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                  </select>
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-info text-white btn-lg">
                    Log Expense
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
