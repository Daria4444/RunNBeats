import React from 'react';
import {
  Avatar,
  Box,
  Typography,
  Paper,
  Button,
  Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import EditIcon from '@mui/icons-material/Edit';
import { useUser } from '../../context/UserContext';


const Profile = () => {
  const navigate = useNavigate();
  const { user, loading } = useUser();

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      <Paper elevation={4} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, maxWidth: 800, mx: 'auto' }}>
        {/* Header */}
        <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap">
          <Avatar
            src={'https://i.pravatar.cc/150?img=15'}
            sx={{ width: 120, height: 120, boxShadow: 3 }}
          />
          <Box flexGrow={1}>
            <Typography variant="h4" fontWeight={700}>{user.username}</Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Profil de alergător
            </Typography>
          </Box>
          <Button
            startIcon={<EditIcon />}
            variant="outlined"
            sx={{ height: 42 }}
          >
            Editează profilul
          </Button>
        </Stack>

        {/* Stats */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} mt={4} justifyContent="space-between">
          <StatBox title="Distanță totală" value={`${user.totalDistance} km`} />
          <StatBox title="Cel mai bun 5K" value={'22:34'} />
          <StatBox title="Total alergări" value={'7'} />
        </Stack>

        {/* Buttons */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={5} justifyContent="center">
          <Button
            variant="contained"
            size="large"
            startIcon={<DirectionsRunIcon />}
            onClick={() => navigate('/myruns')}
            sx={{
              bgcolor: '#5D63D1',
              '&:hover': { bgcolor: '#4348a4' },
              px: 4
            }}
          >
            My Runs
          </Button>
          <Button
            variant="contained"
            size="large"
            startIcon={<PlaylistPlayIcon />}
            onClick={() => navigate('/myplaylists')}
            sx={{
              bgcolor: '#5D63D1',
              '&:hover': { bgcolor: '#4348a4' },
              px: 4
            }}
          >
            My Playlists
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

// Mic component pentru statisticile tale
const StatBox = ({ title, value }) => (
  <Box
    sx={{
      flex: 1,
      textAlign: 'center',
      p: 2,
      bgcolor: '#fff',
      borderRadius: 3,
      boxShadow: 2,
    }}
  >
    <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
    <Typography variant="h6" fontWeight={600}>{value}</Typography>
  </Box>
);

export default Profile;
