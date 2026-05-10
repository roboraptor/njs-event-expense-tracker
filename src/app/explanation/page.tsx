import { getBalances } from '@/lib/db';
import Link from 'next/link';
import ClientAccordionItem from '@/components/ClientAccordionItem';

export default async function ExplanationPage() {
  const balancesData = getBalances();
  const c = balancesData.settings.currency;
  const useDays = balancesData.settings.useDaysAttended;

  return (
    <div className="row justify-content-center">
      <div className="col-lg-10">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Calculation Breakdown</h2>
          <Link href="/settlements" className="btn btn-outline-primary">Back to Settlements</Link>
        </div>

        {balancesData.totalExpenses === 0 ? (
          <div className="alert alert-warning">There are no expenses to calculate yet.</div>
        ) : (
          <>
            <div className="card mb-4 shadow-sm">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">1. Group Pool Overview</h5>
              </div>
              <div className="card-body">
                <p>First, we look at all expenses and separate them into <strong>Group Expenses</strong> (shared by everyone) and <strong>Individual Fees</strong> (assigned to a specific person).</p>
                <ul className="list-group mb-3">
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Total of All Expenses:</span>
                    <strong>{c}{balancesData.totalExpenses.toFixed(2)}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between text-danger">
                    <span>Minus Individual Fees:</span>
                    <strong>- {c}{balancesData.totalIndividualExpenses.toFixed(2)}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between bg-light">
                    <span><strong>Total Group Pool (To be split):</strong></span>
                    <strong className="text-primary">{c}{balancesData.totalGroupExpenses.toFixed(2)}</strong>
                  </li>
                </ul>

                {useDays ? (
                  <p>
                    Because <strong>"Days Stayed"</strong> is enabled, the Group Pool is divided by the total number of days everyone stayed combined (<strong>{balancesData.totalDays} days</strong>).
                    <br/><br/>
                    <span className="badge bg-info text-dark fs-6">
                      {c}{balancesData.totalGroupExpenses.toFixed(2)} ÷ {balancesData.totalDays} days = {c}{balancesData.dailyRate.toFixed(2)} per day
                    </span>
                  </p>
                ) : (
                  <p>
                    Because <strong>"Days Stayed"</strong> is disabled, the Group Pool is divided equally among all <strong>{balancesData.userBalances.length} attendees</strong>.
                    <br/><br/>
                    <span className="badge bg-info text-dark fs-6">
                      {c}{balancesData.totalGroupExpenses.toFixed(2)} ÷ {balancesData.userBalances.length} people = {c}{(balancesData.totalGroupExpenses / balancesData.userBalances.length).toFixed(2)} per person
                    </span>
                  </p>
                )}
              </div>
            </div>

            <div className="card shadow-sm">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">2. Individual Breakdowns</h5>
              </div>
              <div className="card-body p-0">
                <div className="accordion">
                  {balancesData.userBalances.map((user) => (
                    <ClientAccordionItem 
                      key={user.id} 
                      user={user} 
                      c={c} 
                      useDays={useDays} 
                      dailyRate={balancesData.dailyRate} 
                    />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}