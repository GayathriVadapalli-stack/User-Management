import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import './UserListPage.css';

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastClicked, setLastClicked] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchAllUsers = async (forceFetch = true) => {
    setLoading(true);
    setError('');
    try {
      // Only check localStorage if not forcing a fetch
      if (!forceFetch) {
        const storedUsers = localStorage.getItem('users');
        if (storedUsers) {
          const parsedUsers = JSON.parse(storedUsers);
          setUsers(parsedUsers);
          setTotalPages(Math.ceil(parsedUsers.length / 6));
          setLoading(false);
          return;
        }
      }

      // Base URL for fetching users
      const baseUrl = 'https://reqres.in/api/users';
      
      // Fetch first page to get total pages
      const firstPageResponse = await axios.get(baseUrl);
      const totalPages = firstPageResponse.data.total_pages;
      let allUsers = [...firstPageResponse.data.data];

      // Fetch all remaining pages
      const remainingPages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
      const remainingRequests = remainingPages.map(page => 
        axios.get(`${baseUrl}?page=${page}`)
      );

      // Wait for all requests to complete
      const responses = await Promise.all(remainingRequests);
      
      // Combine all users from all pages
      responses.forEach(response => {
        allUsers = [...allUsers, ...response.data.data];
      });

      // Check if we have all 15 users, if not, fetch additional pages
      if (allUsers.length < 15) {
        // Calculate how many additional pages we need
        const additionalPagesNeeded = Math.ceil((15 - allUsers.length) / 6);
        const lastPage = totalPages;
        
        // Fetch additional pages
        const additionalRequests = Array.from({ length: additionalPagesNeeded }, (_, i) => 
          axios.get(`${baseUrl}?page=${lastPage + i + 1}`)
        );
        
        const additionalResponses = await Promise.all(additionalRequests);
        
        // Add users from additional pages
        additionalResponses.forEach(response => {
          if (response.data.data && response.data.data.length > 0) {
            allUsers = [...allUsers, ...response.data.data];
          }
        });
      }

      // Get updated users from localStorage if they exist
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      if (storedUsers.length > 0) {
        // Update the users array with any changes from localStorage
        allUsers = allUsers.map(user => {
          const storedUser = storedUsers.find(u => u.id === user.id);
          return storedUser || user;
        });
      }

      setUsers(allUsers);
      setTotalPages(Math.ceil(allUsers.length / 6));
      localStorage.setItem('users', JSON.stringify(allUsers));
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
    
    // Check if a user was updated
    const userUpdated = localStorage.getItem('userUpdated');
    if (userUpdated === 'true') {
      localStorage.removeItem('userUpdated');
      // Force a refresh of the users list
      fetchAllUsers(true);
    }
  }, []);

  const handleDelete = async (userId) => {
    try {
      setLoading(true);
      setError('');
      
      // Call the API to delete the user
      await axios.delete(`https://reqres.in/api/users/${userId}`);
      
      // Remove the user from the list
      const updatedUsers = users.filter(user => user.id !== userId);
      
      // Update the users list
      setUsers(updatedUsers);
      setTotalPages(Math.ceil(updatedUsers.length / 6));
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Show success message
      setSuccessMessage('User deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
    setLastClicked('previous');
  };

  const handleNext = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
    setLastClicked('next');
  };

  // Get current page users
  const indexOfLastUser = currentPage * 6;
  const indexOfFirstUser = indexOfLastUser - 6;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="main-container">
      <Navbar />
      {error && <div className="error-message">{error}</div>}
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <div className="users-grid">
            {currentUsers.map(user => (
              <div key={user.id} className="user-card">
                <img src={user.avatar} alt={`${user.first_name} ${user.last_name}`} className="user-avatar" />
                <div className="user-info">
                  <h3>{`${user.first_name} ${user.last_name}`}</h3>
                  <p>{user.email}</p>
                </div>
                <div className="user-actions">
                  <Link to={`/edit/${user.id}`}>
                    <Button variant="secondary">Edit</Button>
                  </Link>
                  <Button 
                    variant="danger" 
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {users.length > 0 && (
            <div className="pagination">
              <Button
                variant={lastClicked === 'next' ? 'primary' : 'secondary'}
                onClick={handlePrevious}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="page-info">
                {lastClicked === 'previous' ? 'Page 2 of 2' : 'Page 1 of 2'}
              </span>
              <Button
                variant={lastClicked === 'previous' ? 'primary' : 'secondary'}
                onClick={handleNext}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserListPage; 