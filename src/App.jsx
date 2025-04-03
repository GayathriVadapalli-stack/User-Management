import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import UserListPage from './pages/UserListPage';
import EditUser from './pages/EditUser';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogin = (newToken) => {
    setToken(newToken);
    setIsAuthenticated(true);
    localStorage.setItem('token', newToken);
  };

  const handleLogout = () => {
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <div className="app">
        {isAuthenticated && <Navbar onLogout={handleLogout} />}
        <Routes>
          <Route 
            path="/" 
            element={
              !isAuthenticated ? (
                <LoginPage onLogin={handleLogin} />
              ) : (
                <Navigate to="/users" />
              )
            } 
          />
          <Route 
            path="/users" 
            element={
              isAuthenticated ? (
                <UserListPage />
              ) : (
                <Navigate to="/" />
              )
            } 
          />
          <Route 
            path="/edit/:id" 
            element={
              isAuthenticated ? (
                <EditUser />
              ) : (
                <Navigate to="/" />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
