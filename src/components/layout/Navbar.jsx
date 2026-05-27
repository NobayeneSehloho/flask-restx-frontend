import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium";

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">Course Management</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/dashboard" className={linkClass}>Dashboard</Link>
              <Link to="/departments" className={linkClass}>Departments</Link>
              <Link to="/courses" className={linkClass}>Courses</Link>
              <Link to="/teachers" className={linkClass}>Teachers</Link>
              <Link to="/students" className={linkClass}>Students</Link>
              <Link to="/enrolments" className={linkClass}>Enrolments</Link>
              <Link to="/student-enrolments" className={linkClass}>Student Enrolments</Link>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-gray-700 mr-4">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
