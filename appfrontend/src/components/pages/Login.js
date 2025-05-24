import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/runner/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log('Login response:', response.status, result);

      if (response.ok) {
        localStorage.setItem('runnerId', result.runnerId);
        navigate('/dashboard');
      } else {
        alert('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Server error!');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <Typography variant="h5" fontWeight={600} textAlign="center">
          Log in
        </Typography>

        <TextField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
        />

        <Button
          variant="contained"
          onClick={handleLogin}
          sx={{
            backgroundColor: '#5D63D1',
            padding: '12px',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: '#4f46e5',
            },
          }}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
}
