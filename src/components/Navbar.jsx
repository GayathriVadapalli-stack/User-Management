import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    try {
      // Clear all stored data
      localStorage.removeItem('token');
      localStorage.clear();
      sessionStorage.clear();
      
      // Close the modal
      setShowLogoutModal(false);
      
      // Navigate to root path (login page) and force a page refresh
      window.location.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">User Management</div>
        <div className="navbar-menu">
          <div className="navbar-item">Users</div>
          <button className="logout-button" onClick={handleLogoutClick}>
            Log out
          </button>
        </div>
      </nav>

      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p className="modal-message">Are you sure you would like to LOG OUT?</p>
            <div className="modal-actions">
              <Button variant="danger" onClick={handleLogoutConfirm}>
                OK
              </Button>
              <Button variant="secondary" onClick={handleLogoutCancel}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar; 