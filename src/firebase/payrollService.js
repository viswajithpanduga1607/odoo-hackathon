import {
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore';
import { payrollCol, payrollDocRef } from './schema';
import { fetchAllEmployees } from './userService';

/**
 * Calculate full salary breakdown from basic, allowances, deductions
 */
export function calculateSalaryStructure(data = {}) {
  const basic = Number(data.basic ?? data.baseSalary ?? 50000);
  const hra = Number(data.hra ?? 20000);
  const specialAllowance = Number(data.specialAllowance ?? 10000);
  const medicalAllowance = Number(data.medicalAllowance ?? 5000);

  const pfDeduction = Number(data.pfDeduction ?? 6000);
  const professionalTax = Number(data.professionalTax ?? 200);
  const incomeTax = Number(data.incomeTax ?? 8500);

  const gross = basic + hra + specialAllowance + medicalAllowance;
  const totalDeductions = pfDeduction + professionalTax + incomeTax;
  const net = gross - totalDeductions;

  return {
    basic,
    hra,
    specialAllowance,
    medicalAllowance,
    gross,
    pfDeduction,
    professionalTax,
    incomeTax,
    totalDeductions,
    net,
  };
}

/**
 * Fetch payroll document for a single employee
 */
export async function fetchEmployeePayroll(uid, profile = {}) {
  if (!uid) return calculateSalaryStructure(profile);

  const docSnap = await getDoc(payrollDocRef(uid));
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      ...calculateSalaryStructure(data),
    };
  }

  // Fallback to structure calculated from profile data
  return {
    id: uid,
    employeeId: uid,
    employeeDisplayId: profile.employeeId || 'EMP-2024-001',
    employeeName: profile.fullName || 'Employee',
    department: profile.department || 'Engineering',
    effectiveFrom: profile.dateJoined || '2024-01-01',
    status: 'Paid',
    ...calculateSalaryStructure(profile),
  };
}

/**
 * Fetch all employee payrolls for Admin view
 */
export async function fetchAllPayrolls() {
  const [payrollSnap, employeesList] = await Promise.all([
    getDocs(payrollCol),
    fetchAllEmployees(),
  ]);

  const existingMap = new Map();
  payrollSnap.docs.forEach(d => {
    existingMap.set(d.id, { id: d.id, ...d.data() });
  });

  // Ensure every registered employee has a payroll entry
  return employeesList.map(emp => {
    const targetUid = emp.uid || emp.id;
    const existing = existingMap.get(targetUid) || {};
    const structure = calculateSalaryStructure({ ...emp, ...existing });

    return {
      id: targetUid,
      employeeId: targetUid,
      employeeDisplayId: emp.employeeId || emp.id || 'EMP',
      employeeName: emp.fullName || emp.name || 'Employee',
      avatar: emp.profilePictureUrl || emp.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(emp.fullName || emp.name || targetUid)}`,
      department: emp.department || 'General',
      effectiveFrom: existing.effectiveFrom || emp.dateJoined || '2024-01-01',
      status: existing.status || 'Paid',
      ...structure,
    };
  });
}

/**
 * Update payroll document for an employee (Admin only)
 */
export async function updateEmployeePayroll(uid, payrollData, adminUid = 'admin') {
  if (!uid) throw new Error('Employee UID is required');

  const structure = calculateSalaryStructure(payrollData);
  const payload = {
    employeeId: uid,
    employeeDisplayId: payrollData.employeeDisplayId || '',
    employeeName: payrollData.employeeName || 'Employee',
    department: payrollData.department || 'General',
    baseSalary: structure.basic,
    basic: structure.basic,
    hra: structure.hra,
    specialAllowance: structure.specialAllowance,
    medicalAllowance: structure.medicalAllowance,
    pfDeduction: structure.pfDeduction,
    professionalTax: structure.professionalTax,
    incomeTax: structure.incomeTax,
    grossSalary: structure.gross,
    gross: structure.gross,
    totalDeductions: structure.totalDeductions,
    netSalary: structure.net,
    net: structure.net,
    effectiveFrom: payrollData.effectiveFrom || new Date().toISOString().split('T')[0],
    status: payrollData.status || 'Paid',
    updatedBy: adminUid,
    updatedAt: new Date().toISOString(),
  };

  await setDoc(payrollDocRef(uid), payload, { merge: true });
  return { id: uid, ...payload };
}
