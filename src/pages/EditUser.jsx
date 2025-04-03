import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import './EditUser.css';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        // First try to get from localStorage
        const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const storedUser = storedUsers.find(u => u.id === parseInt(id));
        
        if (storedUser) {
          setUser({
            first_name: storedUser.first_name,
            last_name: storedUser.last_name,
            email: storedUser.email
          });
          setLoading(false);
          return;
        }

        // If not in localStorage, fetch from API
        const response = await axios.get(`https://reqres.in/api/users/${id}`);
        const { first_name, last_name, email } = response.data.data;
        setUser({ first_name, last_name, email });
      } catch (err) {
        setError('Failed to fetch user details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Update via API
      const response = await axios.put(`https://reqres.in/api/users/${id}`, user);
      console.log('API response:', response.data);
      
      // Update in localStorage
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = storedUsers.map(storedUser => 
        storedUser.id === parseInt(id) 
          ? { ...storedUser, ...user }
          : storedUser
      );
      
      // Save the updated users to localStorage
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Set a flag to indicate that the user list should be refreshed
      localStorage.setItem('userUpdated', 'true');
      
      setSuccess('User updated successfully!');
      setTimeout(() => {
        navigate('/users');
      }, 2000);
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user.first_name) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="main-container">
      <Navbar />
      <div className="edit-user-card">
        <h1 className="page-title">Edit User</h1>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">User updated successfully! You will be redirected to the users list.</div>}
        
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label htmlFor="first_name">First Name</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={user.first_name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="last_name">Last Name</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={user.last_name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/users')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser; 