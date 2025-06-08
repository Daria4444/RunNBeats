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
  IconButton,
  Button,
  Paper
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
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
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/runner/search?q=${query}`);
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
        Caută utilizatori
      </Typography>
      <form onSubmit={handleSearch}>
        <TextField
          label="Caută după username"
          fullWidth
          variant="outlined"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ mb: 2 }}
        />
      </form>
      {loading && <CircularProgress />}

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
                  <Avatar src={user.avatarUrl || `https://i.pravatar.cc/150?u=${user.runnerId}`} />
                </ListItemAvatar>
                <ListItemText
                  primary={user.username}
                  secondary={`ID: ${user.runnerId}`}
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
