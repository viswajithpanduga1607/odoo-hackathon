// ============================================================
// Dayflow HRMS — Centralized Mock Data
// All components import from this file.
// To wire Firebase later, replace exports with live data hooks.
// ============================================================

// ---- Current User (toggle role to test employee vs admin) ----
export const currentUser = {
  id: 'EMP-2024-001',
  name: 'John Doe',
  email: 'john.doe@dayflow.io',
  role: 'employee', // 'employee' | 'admin'
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JohnDoe',
  department: 'Engineering',
  designation: 'Senior Software Engineer',
};

// ---- Employees ----
export const employees = [
  { id: 'EMP-2024-001', name: 'John Doe', email: 'john.doe@dayflow.io', department: 'Engineering', designation: 'Senior Software Engineer', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JohnDoe', phone: '+1 (555) 123-4567', dob: '1992-05-15', gender: 'Male', address: '123 Tech Lane, San Francisco, CA 94105', joiningDate: '2022-03-15', employmentType: 'Full-time', reportingManager: 'Jane Smith', workLocation: 'San Francisco, CA' },
  { id: 'EMP-2024-002', name: 'Jane Smith', email: 'jane.smith@dayflow.io', department: 'Engineering', designation: 'Engineering Manager', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JaneSmith', phone: '+1 (555) 234-5678', dob: '1988-11-22', gender: 'Female', address: '456 Code Ave, San Francisco, CA 94106', joiningDate: '2020-01-10', employmentType: 'Full-time', reportingManager: 'Robert Chen', workLocation: 'San Francisco, CA' },
  { id: 'EMP-2024-003', name: 'Alex Rivera', email: 'alex.rivera@dayflow.io', department: 'Design', designation: 'UI/UX Designer', status: 'On Leave', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlexRivera', phone: '+1 (555) 345-6789', dob: '1995-08-30', gender: 'Non-binary', address: '789 Design Blvd, Austin, TX 73301', joiningDate: '2023-06-01', employmentType: 'Full-time', reportingManager: 'Jane Smith', workLocation: 'Austin, TX' },
  { id: 'EMP-2024-004', name: 'Priya Patel', email: 'priya.patel@dayflow.io', department: 'Marketing', designation: 'Marketing Lead', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaPatel', phone: '+1 (555) 456-7890', dob: '1990-02-14', gender: 'Female', address: '321 Market St, New York, NY 10001', joiningDate: '2021-09-20', employmentType: 'Full-time', reportingManager: 'Robert Chen', workLocation: 'New York, NY' },
  { id: 'EMP-2024-005', name: 'Michael Chen', email: 'michael.chen@dayflow.io', department: 'Engineering', designation: 'Backend Developer', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MichaelChen', phone: '+1 (555) 567-8901', dob: '1993-07-08', gender: 'Male', address: '654 Dev Road, Seattle, WA 98101', joiningDate: '2023-01-15', employmentType: 'Full-time', reportingManager: 'Jane Smith', workLocation: 'Seattle, WA' },
  { id: 'EMP-2024-006', name: 'Sara Johnson', email: 'sara.johnson@dayflow.io', department: 'HR', designation: 'HR Manager', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SaraJohnson', phone: '+1 (555) 678-9012', dob: '1987-12-03', gender: 'Female', address: '987 People Ave, Chicago, IL 60601', joiningDate: '2019-04-01', employmentType: 'Full-time', reportingManager: 'Robert Chen', workLocation: 'Chicago, IL' },
  { id: 'EMP-2024-007', name: 'David Kim', email: 'david.kim@dayflow.io', department: 'Sales', designation: 'Sales Executive', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DavidKim', phone: '+1 (555) 789-0123', dob: '1991-09-25', gender: 'Male', address: '147 Sales Drive, Boston, MA 02101', joiningDate: '2022-07-10', employmentType: 'Full-time', reportingManager: 'Priya Patel', workLocation: 'Boston, MA' },
  { id: 'EMP-2024-008', name: 'Emily Watson', email: 'emily.watson@dayflow.io', department: 'Design', designation: 'Graphic Designer', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EmilyWatson', phone: '+1 (555) 890-1234', dob: '1994-04-18', gender: 'Female', address: '258 Art Lane, Portland, OR 97201', joiningDate: '2023-03-20', employmentType: 'Contract', reportingManager: 'Alex Rivera', workLocation: 'Portland, OR' },
];

// ---- Salary Structure ----
export const salaryStructures = {
  'EMP-2024-001': { basic: 50000, hra: 20000, specialAllowance: 10000, medicalAllowance: 5000, pfDeduction: 6000, professionalTax: 200, incomeTax: 8500 },
  'EMP-2024-002': { basic: 70000, hra: 28000, specialAllowance: 15000, medicalAllowance: 5000, pfDeduction: 8400, professionalTax: 200, incomeTax: 14000 },
  'EMP-2024-003': { basic: 45000, hra: 18000, specialAllowance: 8000, medicalAllowance: 5000, pfDeduction: 5400, professionalTax: 200, incomeTax: 7000 },
  'EMP-2024-004': { basic: 55000, hra: 22000, specialAllowance: 12000, medicalAllowance: 5000, pfDeduction: 6600, professionalTax: 200, incomeTax: 10000 },
  'EMP-2024-005': { basic: 48000, hra: 19200, specialAllowance: 9000, medicalAllowance: 5000, pfDeduction: 5760, professionalTax: 200, incomeTax: 7500 },
  'EMP-2024-006': { basic: 60000, hra: 24000, specialAllowance: 13000, medicalAllowance: 5000, pfDeduction: 7200, professionalTax: 200, incomeTax: 11500 },
  'EMP-2024-007': { basic: 42000, hra: 16800, specialAllowance: 7000, medicalAllowance: 5000, pfDeduction: 5040, professionalTax: 200, incomeTax: 6000 },
  'EMP-2024-008': { basic: 40000, hra: 16000, specialAllowance: 6000, medicalAllowance: 5000, pfDeduction: 4800, professionalTax: 200, incomeTax: 5500 },
};

export function getSalaryBreakdown(empId) {
  const s = salaryStructures[empId] || salaryStructures['EMP-2024-001'];
  const gross = s.basic + s.hra + s.specialAllowance + s.medicalAllowance;
  const totalDeductions = s.pfDeduction + s.professionalTax + s.incomeTax;
  const net = gross - totalDeductions;
  return { ...s, gross, totalDeductions, net };
}

// ---- Attendance Records ----
export const attendanceRecords = [
  { date: '2024-07-22', day: 'Monday', checkIn: '09:15 AM', checkOut: '06:30 PM', hours: '9h 15m', status: 'Present' },
  { date: '2024-07-21', day: 'Sunday', checkIn: '-', checkOut: '-', hours: '-', status: 'Weekend' },
  { date: '2024-07-20', day: 'Saturday', checkIn: '-', checkOut: '-', hours: '-', status: 'Weekend' },
  { date: '2024-07-19', day: 'Friday', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '9h 00m', status: 'Present' },
  { date: '2024-07-18', day: 'Thursday', checkIn: '09:30 AM', checkOut: '01:00 PM', hours: '3h 30m', status: 'Half-Day' },
  { date: '2024-07-17', day: 'Wednesday', checkIn: '-', checkOut: '-', hours: '-', status: 'On Leave' },
  { date: '2024-07-16', day: 'Tuesday', checkIn: '08:45 AM', checkOut: '06:15 PM', hours: '9h 30m', status: 'Present' },
  { date: '2024-07-15', day: 'Monday', checkIn: '09:10 AM', checkOut: '06:20 PM', hours: '9h 10m', status: 'Present' },
  { date: '2024-07-14', day: 'Sunday', checkIn: '-', checkOut: '-', hours: '-', status: 'Weekend' },
  { date: '2024-07-13', day: 'Saturday', checkIn: '-', checkOut: '-', hours: '-', status: 'Weekend' },
  { date: '2024-07-12', day: 'Friday', checkIn: '-', checkOut: '-', hours: '-', status: 'Absent' },
  { date: '2024-07-11', day: 'Thursday', checkIn: '09:05 AM', checkOut: '06:10 PM', hours: '9h 05m', status: 'Present' },
  { date: '2024-07-10', day: 'Wednesday', checkIn: '09:20 AM', checkOut: '06:25 PM', hours: '9h 05m', status: 'Present' },
  { date: '2024-07-09', day: 'Tuesday', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '9h 00m', status: 'Present' },
];

export const attendanceSummary = { present: 18, absent: 2, halfDays: 1, leaves: 1, totalWorkingDays: 22 };

// ---- Leave Data ----
export const leaveBalances = {
  paid: { used: 3, total: 15 },
  sick: { used: 2, total: 7 },
  unpaid: { used: 0, total: 'Unlimited' },
};

export const leaveRequests = [
  { id: 'LR-001', employeeId: 'EMP-2024-001', employeeName: 'John Doe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JohnDoe', type: 'Paid Leave', from: '2024-07-25', to: '2024-07-27', days: 3, reason: 'Family vacation', status: 'Pending', appliedOn: '2024-07-20' },
  { id: 'LR-002', employeeId: 'EMP-2024-003', employeeName: 'Alex Rivera', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlexRivera', type: 'Sick Leave', from: '2024-07-17', to: '2024-07-17', days: 1, reason: 'Not feeling well', status: 'Approved', appliedOn: '2024-07-17' },
  { id: 'LR-003', employeeId: 'EMP-2024-005', employeeName: 'Michael Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MichaelChen', type: 'Paid Leave', from: '2024-08-01', to: '2024-08-05', days: 5, reason: 'Annual vacation to Japan', status: 'Pending', appliedOn: '2024-07-19' },
  { id: 'LR-004', employeeId: 'EMP-2024-004', employeeName: 'Priya Patel', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaPatel', type: 'Unpaid Leave', from: '2024-07-22', to: '2024-07-23', days: 2, reason: 'Personal emergency', status: 'Rejected', appliedOn: '2024-07-18' },
  { id: 'LR-005', employeeId: 'EMP-2024-007', employeeName: 'David Kim', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DavidKim', type: 'Sick Leave', from: '2024-07-29', to: '2024-07-30', days: 2, reason: 'Medical procedure', status: 'Pending', appliedOn: '2024-07-22' },
  { id: 'LR-006', employeeId: 'EMP-2024-008', employeeName: 'Emily Watson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EmilyWatson', type: 'Paid Leave', from: '2024-08-10', to: '2024-08-12', days: 3, reason: 'Attending a design conference', status: 'Pending', appliedOn: '2024-07-21' },
];

// ---- Recent Activity ----
export const recentActivities = [
  { id: 1, icon: '✅', text: 'Leave request approved for July 17', time: '2 hours ago', type: 'success' },
  { id: 2, icon: '💰', text: 'Payroll processed for July 2024', time: '1 day ago', type: 'info' },
  { id: 3, icon: '📝', text: 'Profile address updated', time: '2 days ago', type: 'info' },
  { id: 4, icon: '🕐', text: 'Checked in at 09:15 AM today', time: '3 hours ago', type: 'neutral' },
  { id: 5, icon: '⚠️', text: 'Leave balance running low (3 paid leaves remaining)', time: '3 days ago', type: 'warning' },
  { id: 6, icon: '📄', text: 'New company policy document uploaded', time: '5 days ago', type: 'info' },
];

// ---- Payment History ----
export const paymentHistory = [
  { month: 'July 2024', gross: 85000, deductions: 14700, net: 70300, status: 'Paid', date: '2024-08-01' },
  { month: 'June 2024', gross: 85000, deductions: 14700, net: 70300, status: 'Paid', date: '2024-07-01' },
  { month: 'May 2024', gross: 85000, deductions: 14700, net: 70300, status: 'Paid', date: '2024-06-01' },
  { month: 'April 2024', gross: 85000, deductions: 14700, net: 70300, status: 'Paid', date: '2024-05-01' },
  { month: 'March 2024', gross: 85000, deductions: 14700, net: 70300, status: 'Paid', date: '2024-04-01' },
  { month: 'February 2024', gross: 82000, deductions: 14200, net: 67800, status: 'Paid', date: '2024-03-01' },
];

// ---- Documents ----
export const documents = [
  { id: 1, name: 'Aadhaar Card', type: 'Identity', uploadedOn: '2022-03-15', size: '2.4 MB' },
  { id: 2, name: 'PAN Card', type: 'Tax', uploadedOn: '2022-03-15', size: '1.1 MB' },
  { id: 3, name: 'Offer Letter', type: 'Employment', uploadedOn: '2022-03-10', size: '850 KB' },
  { id: 4, name: 'Degree Certificate', type: 'Education', uploadedOn: '2022-03-15', size: '3.2 MB' },
];

// ---- Reports Data ----
export const attendanceReport = [
  { name: 'John Doe', department: 'Engineering', totalDays: 22, present: 18, absent: 2, halfDays: 1, leaves: 1, percentage: 86.4 },
  { name: 'Jane Smith', department: 'Engineering', totalDays: 22, present: 21, absent: 0, halfDays: 1, leaves: 0, percentage: 97.7 },
  { name: 'Alex Rivera', department: 'Design', totalDays: 22, present: 15, absent: 1, halfDays: 0, leaves: 6, percentage: 68.2 },
  { name: 'Priya Patel', department: 'Marketing', totalDays: 22, present: 20, absent: 1, halfDays: 1, leaves: 0, percentage: 93.2 },
  { name: 'Michael Chen', department: 'Engineering', totalDays: 22, present: 19, absent: 2, halfDays: 0, leaves: 1, percentage: 86.4 },
  { name: 'Sara Johnson', department: 'HR', totalDays: 22, present: 22, absent: 0, halfDays: 0, leaves: 0, percentage: 100.0 },
  { name: 'David Kim', department: 'Sales', totalDays: 22, present: 17, absent: 3, halfDays: 1, leaves: 1, percentage: 79.5 },
  { name: 'Emily Watson', department: 'Design', totalDays: 22, present: 20, absent: 1, halfDays: 0, leaves: 1, percentage: 90.9 },
];

export const salarySlips = [
  { name: 'John Doe', month: 'July 2024', basic: 50000, gross: 85000, deductions: 14700, net: 70300, status: 'Paid' },
  { name: 'Jane Smith', month: 'July 2024', basic: 70000, gross: 118000, deductions: 22600, net: 95400, status: 'Paid' },
  { name: 'Alex Rivera', month: 'July 2024', basic: 45000, gross: 76000, deductions: 12600, net: 63400, status: 'Paid' },
  { name: 'Priya Patel', month: 'July 2024', basic: 55000, gross: 94000, deductions: 16800, net: 77200, status: 'Paid' },
  { name: 'Michael Chen', month: 'July 2024', basic: 48000, gross: 81200, deductions: 13460, net: 67740, status: 'Pending' },
  { name: 'Sara Johnson', month: 'July 2024', basic: 60000, gross: 102000, deductions: 18900, net: 83100, status: 'Paid' },
  { name: 'David Kim', month: 'July 2024', basic: 42000, gross: 70800, deductions: 11240, net: 59560, status: 'Paid' },
  { name: 'Emily Watson', month: 'July 2024', basic: 40000, gross: 67000, deductions: 10500, net: 56500, status: 'Pending' },
];

// ---- Admin Stats ----
export const adminStats = {
  totalEmployees: 156,
  presentToday: 142,
  pendingLeaves: 8,
  payrollDue: '3 days',
};
