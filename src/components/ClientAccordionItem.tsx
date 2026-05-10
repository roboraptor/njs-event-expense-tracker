'use client';

import { useState } from 'react';

export default function ClientAccordionItem({ 
  user, 
  c, 
  useDays, 
  dailyRate 
}: { 
  user: any, 
  c: string, 
  useDays: boolean, 
  dailyRate: number 
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="accordion-item">
      <h2 className="accordion-header">
        <button 
          className={`accordion-button ${isOpen ? '' : 'collapsed'}`} 
          type="button" 
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          <div className="d-flex justify-content-between w-100 pe-3">
            <strong>{user.name}</strong>
            <strong>
            <span className={user.balance >= 0 ? 'text-success' : 'text-danger'}>
              {user.balance >= 0 ? 'Gets back' : 'Owes'}: {c}{Math.abs(user.balance).toFixed(2)}
            </span>
            </strong>
          </div>
        </button>
      </h2>
      <div 
        className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}
        style={isOpen ? { display: 'block' } : {}}
      >
        <div className="accordion-body bg-light">
          <p><strong>Step A: Calculate what {user.name} should pay (Total Share)</strong></p>
          <ul>
            {useDays ? (
              <li><strong>Group Share:</strong> {user.days} days × {c}{dailyRate.toFixed(2)} = {c}{user.groupShare.toFixed(2)}</li>
            ) : (
              <li><strong>Group Share:</strong> Equal split = {c}{user.groupShare.toFixed(2)}</li>
            )}
            <li><strong>Individual Fees:</strong> specifically assigned to {user.name} = {c}{user.individualShare.toFixed(2)}</li>
            <li className="mt-2 text-danger"><strong>Total Share Owed: {c}{user.share.toFixed(2)}</strong></li>
          </ul>

          <p className="mt-4"><strong>Step B: Calculate final balance</strong></p>
          <ul>
            <li><strong>Total Amount Paid:</strong> {c}{user.paid.toFixed(2)}</li>
            <li><strong>Minus Total Share:</strong> - {c}{user.share.toFixed(2)}</li>
            <li className="mt-2">
              <strong>Final Balance: </strong> 
              <strong> 
              <span className={`fs-5 ${user.balance >= 0 ? 'text-success' : 'text-danger'}`}>
                {user.balance >= 0 ? '+' : '-'}{' '}{Math.abs(user.balance).toFixed(2)}{' '}{c}
              </span>
              </strong>
            </li>
          </ul>
          <div className="alert alert-secondary py-2 mt-3 mb-0">
            {user.balance > 0.01 
              ? `${user.name} paid ${c}${user.balance.toFixed(2)} more than their fair share, so they need to get money back.` 
              : user.balance < -0.01 
              ? `${user.name} paid ${c}${Math.abs(user.balance).toFixed(2)} less than their fair share, so they owe money to the group.`
              : `${user.name} paid exactly their fair share!`}
          </div>
        </div>
      </div>
    </div>
  );
}