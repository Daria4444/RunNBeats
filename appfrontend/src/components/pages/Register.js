import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    phoneNumber: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/runner/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const text = await response.text();
      console.log('Server response:', response.status, text);

      if (response.ok) {
        setSuccessMsg('Cont creat cu succes! Vei fi redirecționat...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setErrorMsg('Înregistrarea a eșuat: ' + text);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMsg('Eroare server! Încearcă din nou.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `url(https://source.unsplash.com/featured/?fitness,running) center/cover no-repeat`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '450px',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '32px',
          borderRadius: '16px',
          boxShadow: 5,
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <Typography variant="h5" fontWeight={600} textAlign="center" color='#5D63D1'>
          Create an account
        </Typography>

        {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
        {successMsg && <Alert severity="success">{successMsg}</Alert>}

        <TextField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} fullWidth />
        <TextField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} fullWidth />
        <TextField label="Username" name="username" value={formData.username} onChange={handleChange} fullWidth />
        <TextField label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} fullWidth />
        <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} fullWidth />
        <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} fullWidth />

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            backgroundColor: '#5D63D1',
            padding: '12px',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: '#4f46e5',
            },
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
        </Button>

        <Typography variant="body2" textAlign="center">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            style={{ color: '#5D63D1', fontWeight: 600, cursor: 'pointer' }}
          >
            Log in
          </span>
        </Typography>
      </Box>
    </Box>
  );
}
