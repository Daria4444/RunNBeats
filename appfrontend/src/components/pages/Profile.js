import React from 'react';
import {
  Avatar,
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Myruns from './Myruns';

const Profile = () => {
  const navigate = useNavigate();

  const user = {
    name: 'Alex Runner',
    avatar: 'https://i.pravatar.cc/150?img=15',
    totalDistance: 230.5,
    best5k: '22:34',
    totalRuns: 78
  };

  return (
    <Box sx={{ p: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar src={user.avatar} sx={{ width: 100, height: 100 }} />
          </Grid>
          <Grid item xs>
            <Typography variant="h5">{user.name}</Typography>
            <Typography variant="subtitle1">Profil de alergător</Typography>
          </Grid>
          <Grid item>
            <Button variant="outlined">Editează profilul</Button>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6">Distanță totală</Typography>
            <Typography variant="body1">{user.totalDistance} km</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6">Cel mai bun 5K</Typography>
            <Typography variant="body1">{user.best5k}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6">Total alergări</Typography>
            <Typography variant="body1">{user.totalRuns}</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>Progres săptămânal</Typography>
        <Box
          sx={{
            width: '100%',
            height: 200,
            bgcolor: '#f0f0f0',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#888',
            mb: 3
          }}
        >
          Graficul tău de progres va apărea aici 📊
        </Box>

        {/* Butoanele noi */}
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="contained" onClick={() => navigate('/myruns')} sx={{ backgroundColor: '#5D63D1' }}>
            My Runs
          </Button>
          <Button variant="contained" onClick={() => navigate('/myplaylists')} sx={{ backgroundColor: '#5D63D1' }}>
            My Playlists
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Profile;
