import { useState } from 'react';
import { getSalaryBreakdown, currentUser, paymentHistory } from '../../data/mockData';

export default function Payroll() {
  const [period, setPeriod] = useState('July 2024');
  const salary = getSalaryBreakdown(currentUser.id);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Payroll</h1>
          <p className="page-subtitle">View your salary structure and payment history</p>
        </div>
        <div className="form-group" style={{ minWidth: '180px' }}>
          <select className="form-select" value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option>July 2024</option>
            <option>June 2024</option>
            <option>May 2024</option>
            <option>April 2024</option>
            <option>March 2024</option>
            <option>February 2024</option>
          </select>
        </div>
      </div>

      {/* Net Pay Card */}
      <div className="net-pay-card">
        <div className="net-pay-card__label">Net Pay for {period}</div>
        <div className="net-pay-card__amount">₹<span>{salary.net.toLocaleString()}</span></div>
        <div className="net-pay-card__status">
          <span className="badge badge--paid">Paid on Aug 01, 2024</span>
        </div>
      </div>

      <div className="grid-2">
        {/* Salary Structure */}
        <div className="card">
          <div className="card__header">
            <h3 className="card__title">Salary Structure</h3>
            <span className="badge badge--info">Read Only</span>
          </div>
          <div className="salary-table">
            <div className="section__title" style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>Earnings</div>
            <div className="row"><span className="row__label">Basic Salary</span><span className="row__value">₹{salary.basic.toLocaleString()}</span></div>
            <div className="row"><span className="row__label">House Rent Allowance</span><span className="row__value">₹{salary.hra.toLocaleString()}</span></div>
            <div className="row"><span className="row__label">Special Allowance</span><span className="row__value">₹{salary.specialAllowance.toLocaleString()}</span></div>
            <div className="row"><span className="row__label">Medical Allowance</span><span className="row__value">₹{salary.medicalAllowance.toLocaleString()}</span></div>
            <div className="row row--subtotal"><span className="row__label">Gross Salary</span><span className="row__value">₹{salary.gross.toLocaleString()}</span></div>

            <div className="section__title" style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)', marginTop: 'var(--space-4)' }}>Deductions</div>
            <div className="row"><span className="row__label">Provident Fund</span><span className="row__value">₹{salary.pfDeduction.toLocaleString()}</span></div>
            <div className="row"><span className="row__label">Professional Tax</span><span className="row__value">₹{salary.professionalTax.toLocaleString()}</span></div>
            <div className="row"><span className="row__label">Income Tax</span><span className="row__value">₹{salary.incomeTax.toLocaleString()}</span></div>
            <div className="row row--subtotal"><span className="row__label">Total Deductions</span><span className="row__value">₹{salary.totalDeductions.toLocaleString()}</span></div>

            <div className="row row--total"><span className="row__label">Net Salary</span><span className="row__value">₹{salary.net.toLocaleString()}</span></div>
          </div>
        </div>

        {/* Payment History */}
        <div className="card">
          <div className="card__header">
            <h3 className="card__title">Payment History</h3>
          </div>
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Gross</th>
                  <th>Deductions</th>
                  <th>Net Pay</th>
                  <th>Status</th>
                  <th>Payslip</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((p, i) => (
                  <tr key={i}>
                    <td>{p.month}</td>
                    <td>₹{p.gross.toLocaleString()}</td>
                    <td>₹{p.deductions.toLocaleString()}</td>
                    <td style={{ fontWeight: 600 }}>₹{p.net.toLocaleString()}</td>
                    <td><span className="badge badge--paid">{p.status}</span></td>
                    <td><button className="btn btn--ghost btn--sm">⬇</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
