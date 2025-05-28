import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Homepage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100vh',
        width: '100%',
        backgroundImage: `url(/runners.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
      }}
    >
      {/* Overlay negru transparent */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 0,
        }}
      />

      {/* Conținut principal */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '600px',
          px: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <Typography variant="h3" fontWeight="bold">
          RunNBeats
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.85 }}>
          Turn up. Tune in. Take off.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/login')}
            sx={{
              backgroundColor: 'rgba(93, 99, 209, 0.7)', // mov transparent
              color: 'white',
              px: 4,
              py: 1.5,
              fontWeight: 'bold',
              borderRadius: '12px',
              '&:hover': {
                backgroundColor: 'rgba(93, 99, 209, 0.9)', // mai puțin transparent la hover
              },
            }}
          >
            Login
          </Button>

          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            sx={{
              backgroundColor: 'rgba(93, 99, 209, 0.7)',
              color: 'white',
              px: 4,
              py: 1.5,
              fontWeight: 'bold',
              borderRadius: '12px',
              '&:hover': {
                backgroundColor: 'rgba(93, 99, 209, 0.)',
              },
            }}
          >
            Register
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
