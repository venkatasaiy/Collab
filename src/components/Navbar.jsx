import React from 'react';
import { Menu, Search, Bell, LogOut, User, Sun, Moon } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const routeTitles = {
  '/dashboard': 'Dashboard',
  '/books': 'Book Inventory',
  '/books/add': 'Add New Book',
  '/borrowers': 'Borrower Management',
  '/borrowers/add': 'Add New Borrower',
  '/issue-book': 'Issue Book',
  '/issued-books': 'Issued Books Records',
};

const Navbar = ({ onToggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, globalSearch, setGlobalSearch, theme, toggleTheme } = useApp();

  // Determine title dynamically
  const getTitle = () => {
    if (routeTitles[location.pathname]) return routeTitles[location.pathname];
    if (location.pathname.startsWith('/books/edit/')) return 'Edit Book Details';
    if (location.pathname.startsWith('/books/')) return 'Book Details';
    return 'Book Management System';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          className="mobile-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle menu"
        >
          <Menu size={22} />
        </button>
        <h1 className="page-title">{getTitle()}</h1>
      </div>

      <div className="navbar-right">
        {/* Search Input in Topbar */}
        <div className="nav-search-bar">
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search books, authors..."
            value={globalSearch}
            onChange={(e) => {
              setGlobalSearch(e.target.value);
              if (location.pathname !== '/books') {
                navigate('/books');
              }
            }}
          />
        </div>

        {/* Theme Toggle Button */}
        <button
          type="button"
          className="icon-btn theme-toggle-btn"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? (
            <Sun size={19} className="theme-icon sun-icon" />
          ) : (
            <Moon size={19} className="theme-icon moon-icon" />
          )}
        </button>

        {/* Notification Icon */}
        <button className="icon-btn" title="Notifications">
          <Bell size={19} />
          <span className="notification-badge" />
        </button>

        {/* User Profile */}
        <div className="user-profile" onClick={() => navigate('/dashboard')}>
          <div className="avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name || 'Administrator'}</span>
            <span className="user-role">{user?.role || 'Librarian'}</span>
          </div>
        </div>

        {/* Quick Logout button */}
        <button
          className="icon-btn"
          title="Logout"
          onClick={handleLogout}
          style={{ color: 'var(--danger)' }}
        >
          <LogOut size={19} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
