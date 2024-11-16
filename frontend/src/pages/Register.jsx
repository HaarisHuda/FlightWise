import React, { useState } from 'react';
import { TextField, Button, Card, CardContent, Typography, Alert } from '@mui/material';
import { UserPlus } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    password2: '',
    phn: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate passwords match
      if (formData.password !== formData.password2) {
        setError("Passwords don't match");
        return;
      }

      const response = await fetch('http://localhost:8000/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        navigate('/login');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      setError('An error occurred during registration');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto shadow-lg">
        <CardContent className="p-6">
          <Typography variant="h4" className="mb-6 text-center font-bold flex items-center justify-center">
            <UserPlus className="mr-2" />
            Register
          </Typography>
          
          {error && <Alert severity="error" className="mb-4">{error}</Alert>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <TextField
              fullWidth
              label="Phone Number"
              value={formData.phn}
              onChange={(e) => setFormData({...formData, phn: e.target.value})}
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={formData.password2}
              onChange={(e) => setFormData({...formData, password2: e.target.value})}
              required
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Register
            </Button>
            <Typography className="text-center mt-4">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 hover:text-indigo-800">
                Login here
              </Link>
            </Typography>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;