import React from 'react';
import { Button, Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Homepage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100vh',
        width: '100%',
        backgroundImage: `url(/runners.jpg)`,
        backgroundSize: isSmallScreen ? 'cover' : 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
        px: 2,
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
        <Typography
          variant={isSmallScreen ? 'h4' : 'h3'}
          fontWeight="bold"
        >
          RunNBeats
        </Typography>
        <Typography
          variant="h6"
          sx={{ opacity: 0.85, fontSize: isSmallScreen ? '1rem' : '1.25rem' }}
        >
          Turn up. Tune in. Take off.
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/login')}
            sx={{
              backgroundColor: 'rgba(93, 99, 209, 0.7)',
              color: 'white',
              px: 4,
              py: 1.5,
              fontWeight: 'bold',
              borderRadius: '12px',
              '&:hover': {
                backgroundColor: 'rgba(93, 99, 209, 0.9)',
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
                backgroundColor: 'rgba(93, 99, 209, 0.9)',
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
