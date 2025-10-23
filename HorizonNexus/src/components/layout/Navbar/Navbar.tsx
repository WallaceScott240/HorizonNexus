import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { logOut } from '../../../features/authentication/services/authService';

export default function Navbar() {
  const { userProfile } = useAuth(); // Updated to use userProfile
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
          HorizonNexus
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/announcements">
                Announcements
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/assignments">
                Assignments
              </NavLink>
            </li>
            {/* Conditionally render Admin link */}
            {userProfile?.role === 'admin' && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin">
                  Admin
                </NavLink>
              </li>
            )}
          </ul>
          <div className="d-flex align-items-center">
            {userProfile && (
              <>
                <span className="navbar-text me-3">
                  Welcome, {userProfile.displayName || userProfile.email}
                </span>
                <button className="btn btn-outline-danger" onClick={handleLogout}>
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}