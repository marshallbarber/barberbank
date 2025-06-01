import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  userType: 'admin' | 'barber' | 'shop';
  firstName?: string;
  lastName?: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    email: '', password: '', firstName: '', lastName: '', userType: 'barber' as const
  });
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/user');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.log('Not authenticated');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        alert('Login failed');
      }
    } catch (error) {
      alert('Login error');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm),
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        alert('Registration failed');
      }
    } catch (error) {
      alert('Registration error');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
    } catch (error) {
      console.error('Logout error');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-fluid bg-light min-vh-100">
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow">
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <h1 className="h3 text-primary fw-bold">BarberBank</h1>
                  <p className="text-muted">Connect Barbers & Shops</p>
                </div>

                {!showRegister ? (
                  <form onSubmit={handleLogin}>
                    <h4 className="mb-3">Sign In</h4>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 mb-3">
                      Sign In
                    </button>
                    <p className="text-center">
                      Don't have an account?{' '}
                      <button 
                        type="button" 
                        className="btn btn-link p-0"
                        onClick={() => setShowRegister(true)}
                      >
                        Sign Up
                      </button>
                    </p>
                  </form>
                ) : (
                  <form onSubmit={handleRegister}>
                    <h4 className="mb-3">Sign Up</h4>
                    <div className="row">
                      <div className="col-6 mb-3">
                        <label className="form-label">First Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={registerForm.firstName}
                          onChange={(e) => setRegisterForm({...registerForm, firstName: e.target.value})}
                          required
                        />
                      </div>
                      <div className="col-6 mb-3">
                        <label className="form-label">Last Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={registerForm.lastName}
                          onChange={(e) => setRegisterForm({...registerForm, lastName: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Account Type</label>
                      <select
                        className="form-control"
                        value={registerForm.userType}
                        onChange={(e) => setRegisterForm({...registerForm, userType: e.target.value as any})}
                      >
                        <option value="barber">Barber</option>
                        <option value="shop">Barbershop</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <button type="submit" className="btn btn-primary w-100 mb-3">
                      Sign Up
                    </button>
                    <p className="text-center">
                      Already have an account?{' '}
                      <button 
                        type="button" 
                        className="btn btn-link p-0"
                        onClick={() => setShowRegister(false)}
                      >
                        Sign In
                      </button>
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <span className="navbar-brand fw-bold">BarberBank</span>
          <div className="navbar-nav ms-auto">
            <span className="navbar-text me-3">
              Welcome, {user.firstName} ({user.userType})
            </span>
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body text-center">
                <h3>Welcome to BarberBank!</h3>
                <p className="text-muted">
                  {user.userType === 'admin' && 'Manage users, shifts, and platform operations.'}
                  {user.userType === 'barber' && 'Find and apply for shifts at local barbershops.'}
                  {user.userType === 'shop' && 'Post shifts and connect with skilled barbers.'}
                </p>
                <div className="mt-4">
                  <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    Your dashboard features are coming soon! The platform is ready for deployment.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
