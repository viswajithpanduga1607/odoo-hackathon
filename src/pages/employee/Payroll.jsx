import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchEmployeePayroll } from '../../firebase/payrollService';

export default function Payroll() {
  const { user, profile } = useAuth();
  const [period, setPeriod] = useState('August 2026');
  const [salary, setSalary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (user?.uid) {
        try {
          const livePayroll = await fetchEmployeePayroll(user.uid, profile || {});
          setSalary(livePayroll);
        } catch (err) {
          console.error('Error fetching employee payroll:', err);
        } finally {
          setLoading(false);
        }
      }
    }
    load();
  }, [user, profile]);

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        Loading salary structure from Firestore...
      </div>
    );
  }

  const basic = salary?.basic ?? 50000;
  const hra = salary?.hra ?? 20000;
  const specialAllowance = salary?.specialAllowance ?? 10000;
  const medicalAllowance = salary?.medicalAllowance ?? 5000;
  const gross = salary?.gross ?? (basic + hra + specialAllowance + medicalAllowance);

  const pfDeduction = salary?.pfDeduction ?? 6000;
  const professionalTax = salary?.professionalTax ?? 200;
  const incomeTax = salary?.incomeTax ?? 8500;
  const totalDeductions = salary?.totalDeductions ?? (pfDeduction + professionalTax + incomeTax);
  const net = salary?.net ?? (gross - totalDeductions);

  const history = [
    { month: 'August 2026', gross, deductions: totalDeductions, net, status: 'Paid' },
    { month: 'July 2026', gross, deductions: totalDeductions, net, status: 'Paid' },
    { month: 'June 2026', gross, deductions: totalDeductions, net, status: 'Paid' },
    { month: 'May 2026', gross, deductions: totalDeductions, net, status: 'Paid' },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Payroll</h1>
          <p className="page-subtitle">View your salary structure and payment history</p>
        </div>
        <div className="form-group" style={{ minWidth: '180px' }}>
          <select className="form-select" value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option>August 2026</option>
            <option>July 2026</option>
            <option>June 2026</option>
            <option>May 2026</option>
          </select>
        </div>
      </div>

      {/* Net Pay Card */}
      <div className="net-pay-card">
        <div className="net-pay-card__label">Net Pay for {period}</div>
        <div className="net-pay-card__amount">₹<span>{net.toLocaleString()}</span></div>
        <div className="net-pay-card__status">
          <span className="badge badge--paid">Disbursed on 1st of the month</span>
        </div>
      </div>

      <div className="grid-2">
        {/* Salary Structure (Read Only) */}
        <div className="card">
          <div className="card__header">
            <h3 className="card__title">Salary Structure</h3>
            <span className="badge badge--info">Read Only</span>
          </div>
          <div className="salary-table">
            <div className="section__title" style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>Earnings</div>
            <div className="row"><span className="row__label">Basic Salary</span><span className="row__value">₹{basic.toLocaleString()}</span></div>
            <div className="row"><span className="row__label">House Rent Allowance</span><span className="row__value">₹{hra.toLocaleString()}</span></div>
            <div className="row"><span className="row__label">Special Allowance</span><span className="row__value">₹{specialAllowance.toLocaleString()}</span></div>
            <div className="row"><span className="row__label">Medical Allowance</span><span className="row__value">₹{medicalAllowance.toLocaleString()}</span></div>
            <div className="row row--subtotal"><span className="row__label">Gross Salary</span><span className="row__value">₹{gross.toLocaleString()}</span></div>

            <div className="section__title" style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)', marginTop: 'var(--space-4)' }}>Deductions</div>
            <div className="row"><span className="row__label">Provident Fund</span><span className="row__value">₹{pfDeduction.toLocaleString()}</span></div>
            <div className="row"><span className="row__label">Professional Tax</span><span className="row__value">₹{professionalTax.toLocaleString()}</span></div>
            <div className="row"><span className="row__label">Income Tax</span><span className="row__value">₹{incomeTax.toLocaleString()}</span></div>
            <div className="row row--subtotal"><span className="row__label">Total Deductions</span><span className="row__value">₹{totalDeductions.toLocaleString()}</span></div>

            <div className="row row--total"><span className="row__label">Net Salary</span><span className="row__value">₹{net.toLocaleString()}</span></div>
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
                {history.map((p, i) => (
                  <tr key={i}>
                    <td>{p.month}</td>
                    <td>₹{p.gross.toLocaleString()}</td>
                    <td>₹{p.deductions.toLocaleString()}</td>
                    <td style={{ fontWeight: 600 }}>₹{p.net.toLocaleString()}</td>
                    <td><span className="badge badge--paid">{p.status}</span></td>
                    <td><button className="btn btn--ghost btn--sm" title="Download Payslip">⬇</button></td>
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
