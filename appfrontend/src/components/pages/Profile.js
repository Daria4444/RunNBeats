import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Divider,
  CircularProgress,
  IconButton
} from '@mui/material';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useUser } from '../../context/UserContext';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { runnerId } = useParams();

  const [profileUser, setProfileUser] = useState(null);
  const [following, setFollowing] = useState(false);
  const [achievements, setAchievements] = useState([]);

  const id = runnerId || user?.runnerId;
  const isOwnProfile = !runnerId || parseInt(runnerId) === user?.runnerId;

  const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('runnerId');
  navigate('/'); // sau navigate('/login');
  };


  useEffect(() => {
    if (!id) return;

    fetch(`${process.env.REACT_APP_API_URL}/api/v1/runner/get/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => setProfileUser(data));

    if (!isOwnProfile && user?.runnerId) {
      fetch(`${process.env.REACT_APP_API_URL}/api/v1/follow/status?followerId=${user.runnerId}&followedId=${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(res => res.json())
        .then(data => setFollowing(data));
    }

    fetch(`${process.env.REACT_APP_API_URL}/achievements/get/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => setAchievements(data));
  }, [id]);

  const toggleFollow = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/v1/follow/toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ followerId: user.runnerId, followedId: parseInt(runnerId) })
    })
      .then(res => res.json())
      .then(data => setFollowing(data.following));
  };

  if (!id || !profileUser) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress sx={{ color: '#5D63D1' }} />
        <Typography mt={2} variant="h6">Loading profile...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      <Paper elevation={4} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, maxWidth: 800, mx: 'auto', position: 'relative' }}>
        
        {/* Logout Icon */}
        <IconButton
          color="inherit"
          onClick={handleLogout}
          sx={{ position: 'absolute', top: 16, right: 16 }}
        >
          <LogoutIcon />
        </IconButton>

        <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap">
          <Avatar
            sx={{
              width: { xs: 80, sm: 120 },
              height: { xs: 80, sm: 120 },
              boxShadow: 3,
              bgcolor: '#5D63D1',
              fontSize: { xs: 32, sm: 40 },
              color: 'white'
            }}
          >
            {profileUser.username?.charAt(0).toUpperCase()}
          </Avatar>

          <Box flexGrow={1}>
            <Typography variant="h4" fontWeight={700}>{profileUser.username}</Typography>

            <Typography variant="subtitle1" color="text.secondary">
              Runner Profile
            </Typography>

            {/* Follow/Unfollow Button */}
            {!isOwnProfile && (
              <Box sx={{ mt: 1 }}>
                <Button
                  onClick={toggleFollow}
                  variant="contained"
                  sx={{
                    bgcolor: '#5D63D1',
                    color: 'white',
                    fontWeight: 600,
                    px: 3,
                    fontSize: '0.8rem',
                    '&:hover': { bgcolor: '#4348a4' }
                  }}
                >
                  {following ? 'Unfollow' : 'Follow'}
                </Button>
              </Box>
            )}

            {/* Feedback Icon (only for self) */}
            {isOwnProfile && (
              <Box sx={{ mt: 1 }}>
                <Button
                  onClick={() => navigate('/feedback')}
                  sx={{
                    minWidth: 'auto',
                    p: 0.5,
                    bgcolor: '#5D63D1',
                    color: 'white',
                    '&:hover': { bgcolor: '#4348a4' }
                  }}
                >
                  <EditIcon fontSize="small" />
                </Button>
              </Box>
            )}
          </Box>
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} mt={4} justifyContent="space-between">
          {/*<StatBox title="Total Distance" value={`521 km`} />
          <StatBox title="Best Pace" value={'6:50 min/km'} />
          <StatBox title="Total Runs" value={`50`} />*/}
          <StatBox title="Total Distance" value={`${Math.round(profileUser.totalDistance / 100)} km`} />
          <StatBox title="Best Pace" value={`${profileUser.bestPace} min/km`} />
          <StatBox title="Total Runs" value={`${profileUser.totalRuns}`} />
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

        {achievements.length > 0 && (
          <Box mt={5}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h6" fontWeight={600} gutterBottom>
              <EmojiEventsIcon sx={{ mr: 1 }} /> Achievements
            </Typography>
            <Stack spacing={1}>
              {achievements.map((ach, idx) => (
                <Box key={idx} sx={{
                  bgcolor: '#e8eaf6',
                  p: 2,
                  borderRadius: 2,
                  boxShadow: 1,
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    🏅 {ach.achievement.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {ach.achievement.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Type: {ach.achievement.type} | Level: {ach.achievement.level} | Target: {ach.achievement.targetValue}
                  </Typography>
                  <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5 }}>
                    Unlocked at: {new Date(ach.unlockedAt).toLocaleString()}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
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
