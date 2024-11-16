import React, { useState } from 'react';
import { TextField, Button, Card, CardContent, Typography, Alert } from '@mui/material';
import { LogIn } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        await login(data); // Use login function to store tokens and fetch user details
        navigate('/');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      setError('An error occurred during login');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto shadow-lg">
        <CardContent className="p-6">
          <Typography variant="h4" className="mb-6 text-center font-bold flex items-center justify-center">
            <LogIn className="mr-2" />
            Login
          </Typography>
          {error && <Alert severity="error" className="mb-4">{error}</Alert>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <Button type="submit" variant="contained" fullWidth className="bg-indigo-600 hover:bg-indigo-700">
              Login
            </Button>
            <Typography className="text-center mt-4">
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-600 hover:text-indigo-800">Register here</Link>
            </Typography>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
