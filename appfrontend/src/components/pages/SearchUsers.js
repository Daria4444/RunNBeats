import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SearchUsers = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/runner/search?q=${query}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (runnerId) => {
    navigate(`/profile/${runnerId}`);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, px: 2 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Search Users
      </Typography>
      <form onSubmit={handleSearch}>
        <TextField
          label="Search by username"
          fullWidth
          variant="outlined"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              '&.Mui-focused fieldset': {
                borderColor: '#5D63D1',
              },
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(0, 0, 0, 0.6)',
              '&.Mui-focused': {
                color: '#5D63D1',
              },
            }
          }}
        />
      </form>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <CircularProgress color="inherit" sx={{ color: '#5D63D1' }} />
        </Box>
      )}


      {!loading && results.length > 0 && (
        <Paper elevation={3}>
          <List>
            {results.map((user) => (
              <ListItem
                key={user.runnerId}
                button
                onClick={() => handleViewProfile(user.runnerId)}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: '#5D63D1', color: 'white' }}>
                    {user.username?.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={user.username}
                  secondary="Runner Profile"
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default SearchUsers;
