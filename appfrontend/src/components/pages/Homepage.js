import React from 'react';
import { Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Homepage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100vh',
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Fundal */}
      <Box
        component="img"
        src="/runners.jpg"
        alt="Background"
        sx={{
          position: 'absolute',
          width: '100%',
          height: 'auto',
          maxHeight: '100%',
          opacity: 0.15,
          zIndex: 0,
        }}
      />

      {/* Conținut */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '30px',
        }}
      >
        {/* Buton principal */}
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#5D63D1',
            borderRadius: '12px',
            padding: '12px 24px',
            fontWeight: 600,
            fontSize: '16px',
            '&:hover': {
              backgroundColor: '#4f46e5',
            },
          }}
        >
          Let’s get started
        </Button>

        {/* Login & Register */}
        <Box
          sx={{
            display: 'flex',
            gap: '20px',
          }}
        >
          <Button
            variant="contained"
            onClick={() => navigate('/login')}
            sx={{
              backgroundColor: '#5D63D1',
              borderRadius: '12px',
              padding: '12px 24px',
              fontWeight: 600,
              fontSize: '16px',
              '&:hover': {
                backgroundColor: '#4f46e5',
              },
            }}
          >
            LOGIN
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/register')}
            sx={{
              backgroundColor: '#5D63D1',
              borderRadius: '12px',
              padding: '12px 24px',
              fontWeight: 600,
              fontSize: '16px',
              '&:hover': {
                backgroundColor: '#4f46e5',
              },
            }}
          >
            REGISTER
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
