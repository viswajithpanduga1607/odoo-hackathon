import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';

// Auth Pages
import SignUp from './pages/auth/SignUp';
import SignIn from './pages/auth/SignIn';

// Employee Pages
import EmployeeDashboard from './pages/employee/Dashboard';
import ProfileView from './pages/employee/ProfileView';
import ProfileEdit from './pages/employee/ProfileEdit';
import Attendance from './pages/employee/Attendance';
import LeaveApply from './pages/employee/LeaveApply';
import Payroll from './pages/employee/Payroll';
import Reports from './pages/employee/Reports';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminProfileEdit from './pages/admin/ProfileEdit';
import LeaveApprovals from './pages/admin/LeaveApprovals';
import AdminPayroll from './pages/admin/Payroll';
import EmployeeList from './pages/admin/EmployeeList';

// Dashboard Layout wrapper — includes sidebar + topbar
function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <TopBar />
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes (no sidebar/topbar) */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />

        {/* Employee Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<EmployeeDashboard />} />
          <Route path="/profile" element={<ProfileView />} />
          <Route path="/profile/edit" element={<ProfileEdit />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/leave/apply" element={<LeaveApply />} />
          <Route path="/payroll" element={<Payroll />} />
          <Route path="/reports" element={<Reports />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/employees" element={<EmployeeList />} />
          <Route path="/admin/profile/edit/:id" element={<AdminProfileEdit />} />
          <Route path="/admin/profile/edit" element={<AdminProfileEdit />} />
          <Route path="/admin/leave-approvals" element={<LeaveApprovals />} />
          <Route path="/admin/payroll" element={<AdminPayroll />} />
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
