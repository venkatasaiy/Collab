import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  BookPlus, 
  BookmarkCheck, 
  LogOut, 
  Library,
  Sun,
  Moon,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const Sidebar = ({ isOpen, onCloseMobile }) => {
  const { logout, theme, toggleTheme } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Books', path: '/books', icon: BookOpen },
    { label: 'Borrowers', path: '/borrowers', icon: Users },
    { label: 'Issue Book', path: '/issue-book', icon: BookPlus },
    { label: 'Issued Books', path: '/issued-books', icon: BookmarkCheck },
  ];

  return (
    <>
      {/* Overlay for Mobile */}
      {isOpen && <div className="mobile-overlay" onClick={onCloseMobile} />}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Library size={26} style={{ color: 'var(--primary)' }} />
            <span>Bookify Admin</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="mobile-toggle-btn"
            style={{ color: '#fff', marginLeft: 'auto' }}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button 
            type="button" 
            className="sidebar-theme-toggle" 
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun size={18} className="sun-icon" />
            ) : (
              <Moon size={18} className="moon-icon" />
            )}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
