import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Typography,
  Paper,
  Button,
  Stack
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import EditIcon from '@mui/icons-material/Edit';
import { useUser } from '../../context/UserContext';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { runnerId } = useParams();
  const isOwnProfile = !runnerId || parseInt(runnerId) === user.runnerId;
  const [profileUser, setProfileUser] = useState(user);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    if (!isOwnProfile) {
      fetch(`${process.env.REACT_APP_API_URL}/api/v1/runner/get/${runnerId}`)
        .then(res => res.json())
        .then(data => setProfileUser(data));

      fetch(`${process.env.REACT_APP_API_URL}/api/v1/follow/status?followerId=${user.runnerId}&followedId=${runnerId}`)
        .then(res => res.json())
        .then(data => setFollowing(data));
    }
  }, [runnerId]);

  const toggleFollow = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/v1/follow/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ followerId: user.runnerId, followedId: parseInt(runnerId) })
    })
      .then(res => res.json())
      .then(data => setFollowing(data.following));
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      <Paper elevation={4} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, maxWidth: 800, mx: 'auto' }}>
        <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap">
          <Avatar
            src={`https://i.pravatar.cc/150?u=${profileUser.runnerId}`}
            sx={{ width: 120, height: 120, boxShadow: 3 }}
          />
          <Box flexGrow={1}>
            <Typography variant="h4" fontWeight={700}>{profileUser.username}</Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Profil de alergător
            </Typography>
          </Box>
          {isOwnProfile ? (
            <Button startIcon={<EditIcon />} variant="outlined" sx={{ height: 42 }}>
              Editează profilul
            </Button>
          ) : (
            <Button onClick={toggleFollow} variant="contained">
              {following ? 'Unfollow' : 'Follow'}
            </Button>
          )}
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} mt={4} justifyContent="space-between">
          <StatBox title="Distanță totală" value={`${profileUser.totalDistance} km`} />
          <StatBox title="Cel mai bun 5K" value={'22:34'} />
          <StatBox title="Total alergări" value={'7'} />
        </Stack>

        {isOwnProfile && (
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={5} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              startIcon={<DirectionsRunIcon />}
              onClick={() => navigate('/myruns')}
              sx={{ bgcolor: '#5D63D1', '&:hover': { bgcolor: '#4348a4' }, px: 4 }}
            >
              My Runs
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={<PlaylistPlayIcon />}
              onClick={() => navigate('/myplaylists')}
              sx={{ bgcolor: '#5D63D1', '&:hover': { bgcolor: '#4348a4' }, px: 4 }}
            >
              My Playlists
            </Button>
          </Stack>
        )}
      </Paper>
    </Box>
  );
};

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
