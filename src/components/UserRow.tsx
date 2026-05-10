'use client';

import { useState } from 'react';
import { removeUser, editUser } from '@/app/actions';

export default function UserRow({ user, useDaysAttended }: { user: any, useDaysAttended: boolean }) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <li className="list-group-item">
        <form action={(formData) => { editUser(formData); setIsEditing(false); }} className="row g-2 align-items-center m-0">
          <input type="hidden" name="id" value={user.id} />
          <div className="col-auto">
            <input type="text" name="name" className="form-control form-control-sm" defaultValue={user.name} required />
          </div>
          {useDaysAttended && (
            <div className="col-auto">
              <div className="input-group input-group-sm">
                <input type="number" name="days" className="form-control" defaultValue={user.days} min="1" required />
                <span className="input-group-text">days</span>
              </div>
            </div>
          )}
          {!useDaysAttended && (
            <input type="hidden" name="days" value={user.days} />
          )}
          <div className="col-auto ms-auto">
            <button type="submit" className="btn btn-sm btn-success me-2">Save</button>
            <button type="button" className="btn btn-sm btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <div>
        <strong className="me-2">{user.name}</strong>
        {useDaysAttended && (
          <span className="badge bg-secondary">{user.days} {user.days === 1 ? 'day' : 'days'}</span>
        )}
      </div>
      <div>
        <button type="button" className="btn btn-sm btn-outline-primary me-2" onClick={() => setIsEditing(true)}>Edit</button>
        <form action={removeUser} className="d-inline">
          <input type="hidden" name="id" value={user.id} />
          <button type="submit" className="btn btn-sm btn-outline-danger">Remove</button>
        </form>
      </div>
    </li>
  );
}