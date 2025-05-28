import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  Alert,
  CircularProgress
} from '@mui/material';
import { AccountCircle, Lock } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/runner/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      console.log('Login response:', response.status, result);

      if (response.ok) {
        localStorage.setItem('runnerId', result.runnerId);
        navigate('/dashboard');
      } else {
        setErrorMsg('Username sau parolă incorecte');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMsg('Eroare server. Încearcă mai târziu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `url(https://source.unsplash.com/featured/?fitness,runner) center/cover no-repeat`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      <Box
        sx={{
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(255,255,255,0.85)',
          borderRadius: 4,
          boxShadow: 6,
          width: '100%',
          maxWidth: 400,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Typography variant="h5" fontWeight={600} textAlign="center" color='#5D63D1'>
          Welcome back
        </Typography>

        {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        <TextField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock />
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          size="large"
          onClick={handleLogin}
          disabled={loading}
          sx={{ fontWeight: 'bold', backgroundColor: '#5D63D1' }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
        </Button>

        <Typography variant="body2" textAlign="center">
          Don't have an account?{' '}
          <span
          onClick={() => navigate('/register')}
          style={{ color: '#5D63D1', fontWeight: 'bold', cursor: 'pointer' }}
          >
          Sign up
          </span>
        </Typography>

      </Box>
    </Box>
  );
}
