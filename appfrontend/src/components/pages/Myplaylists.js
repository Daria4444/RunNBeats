import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';

const MyPlaylists = () => {
  const [youtubeLink, setYoutubeLink] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const runnerId = localStorage.getItem('runnerId');

  const extractYouTubePlaylistId = (url) => {
    const regex = /[?&]list=([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/v1/playlist/get/${runnerId}/playlists`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then((res) => res.json())
      .then((data) => setPlaylists(data))
      .catch((err) => console.error('Eroare la încărcarea playlisturilor:', err));
  }, [runnerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = extractYouTubePlaylistId(youtubeLink);
    if (!id) {
      alert("Linkul nu pare un playlist YouTube valid.");
      return;
    }

    const payload = {
      runnerId,
      link: youtubeLink,
      playlistType: 'BOOST',
    };

    try {
      setLoading(true);
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/playlist/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload),
      });

      const newPlaylist = await res.json();
      if (res.ok) {
        setPlaylists((prev) => [...prev, newPlaylist]);
        setYoutubeLink('');
      } else {
        alert("Eroare la salvarea playlistului.");
      }
    } catch (err) {
      console.error("Eroare la trimiterea către backend:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = async (playlistId, newType) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/playlist/update-type/${playlistId}?type=${newType}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (res.ok) {
        setPlaylists((prev) =>
          prev.map((p) =>
            p.playlistId === playlistId ? { ...p, playlistType: newType } : p
          )
        );
      } else {
        alert('Eroare la actualizarea tipului de playlist');
      }
    } catch (err) {
      console.error('Eroare la actualizarea playlistului:', err);
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 4 }}>
      <Stack direction="row" alignItems="center" spacing={1} justifyContent="center" mb={4}>
        <LibraryMusicIcon sx={{ fontSize: 32, color: '#5D63D1' }} />
        <Typography variant="h4" fontWeight={600}>
          My YouTube Playlists
        </Typography>
      </Stack>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 5,
          alignItems: 'center',
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          label="YouTube playlist link"
          value={youtubeLink}
          onChange={(e) => setYoutubeLink(e.target.value)}
        />

        <Button
          type="submit"
          variant="contained"
          sx={{
            px: 4,
            py: 1.5,
            fontWeight: 600,
            fontSize: 15,
            backgroundColor: '#5D63D1',
            '&:hover': {
              backgroundColor: '#4e52ba',
            },
            '&.Mui-disabled': {
              backgroundColor: '#5D63D1',
              opacity: 0.6,
              color: '#fff',
            },
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Add'}
        </Button>
      </Box>

      {playlists.length === 0 ? (
        <Typography align="center" color="text.secondary">
          You haven’t added any playlists yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {playlists.map((playlist) => {
            const pid = extractYouTubePlaylistId(playlist.link);
            return (
              pid && (
                <Grid item xs={12} sm={6} md={4} key={playlist.playlistId}>
                  <Card
                    elevation={3}
                    sx={{
                      borderRadius: 3,
                      overflow: 'hidden',
                      boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
                    }}
                  >
                    <CardContent sx={{ p: 0 }}>
                      <iframe
                        width="100%"
                        height="250"
                        src={`https://www.youtube.com/embed/videoseries?list=${pid}`}
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        allowFullScreen
                        title={`Playlist ${playlist.playlistId}`}
                      ></iframe>
                    </CardContent>
                    <Box p={2}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Playlist Type</InputLabel>
                        <Select
                          value={playlist.playlistType || ''}
                          label="Playlist Type"
                          onChange={(e) => handleTypeChange(playlist.playlistId, e.target.value)}
                        >
                          <MenuItem value="BOOST">BOOST</MenuItem>
                          <MenuItem value="CHILL">CHILL</MenuItem>
                          <MenuItem value="VIBE">VIBE</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Card>
                </Grid>
              )
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default MyPlaylists;
