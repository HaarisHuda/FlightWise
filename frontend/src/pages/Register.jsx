import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';

const Register = () => {
  const [formData, setFormData] = useState({ email: '', username: '', password: '', password2: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Submit formData to the backend
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>Register</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Email" name="email" fullWidth margin="normal" value={formData.email} onChange={handleChange} />
        <TextField label="Username" name="username" fullWidth margin="normal" value={formData.username} onChange={handleChange} />
        <TextField label="Password" name="password" type="password" fullWidth margin="normal" value={formData.password} onChange={handleChange} />
        <TextField label="Confirm Password" name="password2" type="password" fullWidth margin="normal" value={formData.password2} onChange={handleChange} />
        <Button type="submit" variant="contained" color="primary" fullWidth>Register</Button>
      </form>
    </Container>
  );
};

export default Register;
