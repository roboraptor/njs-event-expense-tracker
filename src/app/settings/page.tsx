import { getUsers, getSettings } from '@/lib/db';
import { createUser, removeUser, updateGlobalSettings } from '@/app/actions';
import UserRow from '@/components/UserRow';

export default async function SettingsPage() {
  const users = getUsers();
  const settings = getSettings();

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        
        <div className="card mb-4">
          <div className="card-header bg-secondary text-white">
            <h5 className="mb-0">Global App Settings</h5>
          </div>
          <div className="card-body">
            <form action={updateGlobalSettings}>
              <div className="mb-3">
                <label className="form-label">Currency Symbol</label>
                <select name="currency" className="form-select" defaultValue={settings.currency}>
                  <option value="$">$ (USD/CAD/AUD)</option>
                  <option value="€">€ (EUR)</option>
                  <option value="£">£ (GBP)</option>
                  <option value="¥">¥ (JPY/CNY)</option>
                  <option value="₹">₹ (INR)</option>
                  <option value="Kč">Kč (CZK)</option>
                </select>
              </div>
              <div className="mb-3 form-check">
                <input 
                  type="checkbox" 
                  name="useDaysAttended" 
                  value="true" 
                  className="form-check-input" 
                  id="useDaysAttendedCheck" 
                  defaultChecked={settings.useDaysAttended} 
                />
                <label className="form-check-label" htmlFor="useDaysAttendedCheck">
                  Calculate fair share based on <strong>Days Stayed</strong>? <br />
                  <small className="text-muted">If unchecked, total expenses will be split equally among all attendees regardless of how many days they stayed.</small>
                </label>
              </div>
              <div className="mb-3 form-check">
                <input 
                  type="checkbox" 
                  name="useCentralAccount" 
                  value="true" 
                  className="form-check-input" 
                  id="useCentralAccountCheck" 
                  defaultChecked={settings.useCentralAccount} 
                />
                <label className="form-check-label" htmlFor="useCentralAccountCheck">
                  Use <strong>Central Account</strong> for settlements? <br />
                  <small className="text-muted">If checked, everyone pays into or receives from a single central pool instead of peer-to-peer transfers.</small>
                </label>
              </div>
              <button type="submit" className="btn btn-secondary w-100">Save Global Settings</button>
            </form>
          </div>
        </div>

        <div className="card">
          <div className="card-header bg-dark text-white">
            <h5 className="mb-0">Event Settings & Attendees</h5>
          </div>
          <div className="card-body">
            <h6 className="card-title mb-3">Add New Attendee</h6>
            <form action={createUser} className="row g-3 mb-4 border-bottom pb-4">
              <div className="col-md-5">
                <label className="form-label">Name</label>
                <input 
                  type="text" 
                  name="name" 
                  className="form-control" 
                  placeholder="e.g. John Doe" 
                  required 
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Days Stayed</label>
                <div className="input-group">
                  <input 
                    type="number" 
                    name="days" 
                    className="form-control" 
                    defaultValue="1" 
                    min="1"
                    disabled={!settings.useDaysAttended}
                    required 
                  />
                  <span className="input-group-text">days</span>
                </div>
              </div>
              <div className="col-md-3 d-flex align-items-end">
                <button type="submit" className="btn btn-primary w-100">Add</button>
              </div>
            </form>
            
            <h6 className="card-title mb-3">Current Attendees</h6>
            <ul className="list-group">
              {users.length === 0 ? (
                <li className="list-group-item text-muted text-center py-3">No attendees added yet.</li>
              ) : (
                users.map(user => (
                  <UserRow key={user.id} user={user} useDaysAttended={settings.useDaysAttended} />
                ))
              )}
            </ul>
            <div className="form-text mt-3 text-muted">
              Note: Removing an attendee will also delete all expenses they paid for.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
