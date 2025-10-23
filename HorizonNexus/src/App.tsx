
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/layout/Navbar/Navbar';

// Import Page Components
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import AnnouncementsPage from './pages/AnnouncementsPage';
import AssignmentsPage from './pages/AssignmentsPage';
import AdminDashboard from './pages/AdminDashboard'; // Import the Admin Dashboard

// Layout component to wrap protected pages with the Navbar
const AppLayout = () => (
  <>
    <Navbar />
    <main className="container mt-4">
      <Outlet /> {/* Child routes will render here */}
    </main>
  </>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route that everyone can see */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes - only accessible after login */}
        <Route
          path="/"
          element={
            // This route just checks for login, so no 'allowedRoles' prop is needed.
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* Child routes that render inside AppLayout's <Outlet> */}
          <Route index element={<Dashboard />} />
          <Route path="announcements" element={<AnnouncementsPage />} />
          <Route path="assignments" element={<AssignmentsPage />} />

          {/* Admin-only Routes */}
          <Route
            path="admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          {/* Add other protected routes here as children */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;