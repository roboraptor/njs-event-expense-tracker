import { getBalances } from '@/lib/db';

export default async function SettlementsPage() {
  const balancesData = getBalances();
  const c = balancesData.settings.currency;

  return (
    <div className="row">
      <div className="col-12 mb-4">
        <div className="card">
          <div className="card-header bg-success text-white">
            <h5 className="mb-0">Settlement Calculations</h5>
          </div>
          <div className="card-body">
            {balancesData.totalExpenses > 0 || balancesData.userBalances.some(u => u.share > 0) ? (
              <div className="row">
                <div className="col-md-4 text-center border-end">
                  <h6>Total Group Pool</h6>
                  <h3 className="text-success">{c}{balancesData.totalExpenses.toFixed(2)}</h3>
                </div>
                {balancesData.settings.useDaysAttended ? (
                  <>
                    <div className="col-md-4 text-center border-end">
                      <h6>Total Days Stayed</h6>
                      <h3 className="text-primary">{balancesData.totalDays}</h3>
                    </div>
                    <div className="col-md-4 text-center">
                      <h6>Cost Per Day (Avg)</h6>
                      <h3 className="text-info">{c}{balancesData.dailyRate.toFixed(2)}</h3>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-md-4 text-center border-end">
                      <h6>Total People</h6>
                      <h3 className="text-primary">{balancesData.userBalances.length}</h3>
                    </div>
                    <div className="col-md-4 text-center">
                      <h6>Cost Per Person (Equal Split)</h6>
                      <h3 className="text-info">{c}{(balancesData.totalExpenses / Math.max(balancesData.userBalances.length, 1)).toFixed(2)}</h3>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <p className="text-muted mb-0">No expenses to calculate yet.</p>
            )}
          </div>
        </div>
      </div>

      {(balancesData.totalExpenses > 0 || balancesData.userBalances.some(u => u.share > 0)) && (
        <>
          <div className="col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-header bg-secondary text-white">
                <h5 className="mb-0">Individual Shares</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Person</th>
                        {balancesData.settings.useDaysAttended && <th className="text-center">Days</th>}
                        <th className="text-end">Paid</th>
                        <th className="text-end">Total Share</th>
                        <th className="text-end">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {balancesData.userBalances.map(user => (
                        <tr key={user.id}>
                          <td><strong>{user.name}</strong></td>
                          {balancesData.settings.useDaysAttended && <td className="text-center">{user.days}</td>}
                          <td className="text-end text-success">{c}{user.paid.toFixed(2)}</td>
                          <td className="text-end text-danger">{c}{user.share.toFixed(2)}</td>
                          <td className={`text-end fw-bold ${user.balance >= 0 ? 'text-success' : 'text-danger'}`}>
                            {user.balance >= 0 ? '+' : ''}{user.balance.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="form-text mt-3">
                    <strong>Balance logic:</strong> A positive balance means the person paid more than their share and should get money back. A negative balance means they owe money to the pool.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-header bg-warning text-dark">
                <h5 className="mb-0">{balancesData.settings.useCentralAccount ? 'Central Account Transfers' : 'Who Owes Whom'}</h5>
              </div>
              <div className="card-body">
                {balancesData.settings.useCentralAccount ? (
                  balancesData.userBalances.filter(u => Math.abs(u.balance) > 0.01).length === 0 ? (
                    <div className="alert alert-success text-center">
                      🎉 All settled up! Nobody owes anything.
                    </div>
                  ) : (
                    <>
                      <h6 className="text-danger">To Pay In:</h6>
                      <ul className="list-group list-group-flush mb-4">
                        {balancesData.userBalances.filter(u => u.balance < -0.01).map(u => (
                          <li key={u.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <span><strong>{u.name}</strong> pays to account</span>
                            <span className="badge bg-danger rounded-pill">{c}{Math.abs(u.balance).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                      <h6 className="text-success">To Receive:</h6>
                      <ul className="list-group list-group-flush">
                        {balancesData.userBalances.filter(u => u.balance > 0.01).map(u => (
                          <li key={u.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <span>Account pays <strong>{u.name}</strong></span>
                            <span className="badge bg-success rounded-pill">{c}{u.balance.toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )
                ) : (
                  balancesData.settlements.length === 0 ? (
                    <div className="alert alert-success text-center">
                      🎉 All settled up! Nobody owes anything.
                    </div>
                  ) : (
                    <ul className="list-group list-group-flush">
                      {balancesData.settlements.map((settlement, idx) => (
                        <li key={idx} className="list-group-item d-flex justify-content-between align-items-center fs-5">
                          <span>
                            <strong className="text-danger">{settlement.from}</strong> 
                            <span className="mx-2 text-muted">pays ➡️</span> 
                            <strong className="text-success">{settlement.to}</strong>
                          </span>
                          <span className="badge bg-primary rounded-pill fs-6">
                            {c}{settlement.amount.toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
