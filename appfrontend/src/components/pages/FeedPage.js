import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Stack,
  Avatar,
  Input,
  Divider
} from '@mui/material';

const FeedPage = () => {
  const runnerId = localStorage.getItem('runnerId');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [posts, setPosts] = useState([]);
  const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/dw9vaqeyh/image/upload";
  const CLOUDINARY_UPLOAD_PRESET = "runnbeats_unsigned";

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/v1/posts/feed/${runnerId}`)
      .then(res => res.json())
      .then(data => setPosts(data));
  }, [runnerId]);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    return data.secure_url;
  };

  const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
};

  const formatTimeAgo = (timestamp) => {
    const diff = (new Date() - new Date(timestamp)) / 1000;
    if (diff < 60) return `${Math.floor(diff)} sec ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} h ago`;
    return `${Math.floor(diff / 86400)} d ago`;
  };

  const handlePost = async () => {
    let imageUrl = null;

    if (image) {
      try {
        imageUrl = await uploadToCloudinary(image);
        console.log('Imagine încărcată:', imageUrl);
      } catch (err) {
        console.error("Upload eșuat:", err);
        return;
      }
    }

    const payload = {
      runnerId: parseInt(runnerId),
      description: description?.trim(),
      imageUrl
    };

    fetch(`${process.env.REACT_APP_API_URL}/api/v1/posts/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(newPost => {
        setPosts(prev => [newPost, ...prev]);
        setDescription('');
        setImage(null);
        setImagePreview(null);
      });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4, px: 2 }}>
      {/* Form creare postare */}
      <Card sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Create a post
        </Typography>
        <TextField
          label="Description"
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />

        {/* Input imagine personalizat */}
        <label htmlFor="upload-image">
          <Input
            accept="image/*"
            id="upload-image"
            type="file"
            sx={{ display: 'none' }}
            onChange={handleImageSelect}
          />
          <Button
            variant="outlined"
            component="span"
            fullWidth
            sx={{
              mb: 2,
              borderColor: '#5D63D1',
              color: '#5D63D1',
              '&:hover': {
                backgroundColor: 'rgba(93, 99, 209, 0.08)',
                borderColor: '#4a50b3',
                color: '#4a50b3'
              },
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            {image ? "Imagine selectată" : "Upload an image"}
          </Button>
        </label>

        {imagePreview && (
          <Box mb={2}>
            <img
              src={imagePreview}
              alt="preview"
              style={{
                width: '100%',
                borderRadius: '12px',
                objectFit: 'contain',
                maxHeight: '400px'
              }}
            />
          </Box>
        )}

        <Button
          variant="contained"
          onClick={handlePost}
          fullWidth
          sx={{
            backgroundColor: '#5D63D1',
            '&:hover': {
              backgroundColor: '#4a50b3'
            },
            textTransform: 'none',
            fontWeight: 500
          }}
        >
          Post
        </Button>
      </Card>

      {/* Feed */}
      {posts.map(post => (
        <Card key={post.id} sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar src={post.author?.avatarUrl}>
                {!post.author?.avatarUrl && post.author?.username?.[0]}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {post.author?.username}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatTimeAgo(post.createdAt)}
                </Typography>
              </Box>
            </Stack>

            <Typography variant="body1" sx={{ mt: 2 }}>
              {post.description}
            </Typography>

            {post.imageUrl && (
              <Box mt={2}>
                <img
                  src={post.imageUrl}
                  alt="post"
                  style={{
                    width: '100%',
                    borderRadius: '12px',
                    objectFit: 'contain',
                    maxHeight: '500px'
                  }}
                />
              </Box>
            )}

            {post.run && (
              <Box mt={2}>
                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" fontWeight={600} color="text.secondary" gutterBottom>
                  Linked run details:
                </Typography>

                <Typography variant="body2">
                  Distance: {(post.run.distance / 1000).toFixed(2)} km
                </Typography>
                <Typography variant="body2">
                  Duration: {formatDuration(post.run.duration)}
                </Typography>
                <Typography variant="body2">
                  Avg speed: {post.run.averageSpeed.toFixed(2)} m/s
                </Typography>
                <Typography variant="body2">
                  Pace: {post.run.pace} min/km
                </Typography>
                <Typography variant="body2">
                  Timestamp: {new Date(post.run.timestamp).toLocaleString()}
                </Typography>

                {post.run.mapImageUrl && (
                  <Box mt={1}>
                    <img
                      src={post.run.mapImageUrl}
                      alt="Run map"
                      style={{
                        width: '100%',
                        borderRadius: '8px',
                        objectFit: 'contain',
                        maxHeight: '300px',
                        marginTop: '8px'
                      }}
                    />
                  </Box>
                )}
              </Box>
            )}

          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default FeedPage;
