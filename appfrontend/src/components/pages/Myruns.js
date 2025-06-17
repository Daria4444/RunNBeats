import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Pagination,
  CardMedia,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';

export default function MyRuns() {
  const runnerId = localStorage.getItem('runnerId');
  const [runs, setRuns] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [selectedRun, setSelectedRun] = useState(null); // for popup
  const [confirmOpen, setConfirmOpen] = useState(false); // dialog open/close

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const fetchRuns = async (pageNumber) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/run/runner/${runnerId}?page=${pageNumber - 1}&size=5`, {
      headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }});
      const data = await res.json();
      setRuns(data.content);
      console.log("ce ne a venit din backend",  data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching runs:', error);
    }
    setLoading(false);
  };

  const handlePostConfirm = (run) => {
    setSelectedRun(run);
    setConfirmOpen(true);
  };

  const handlePostRun = async () => {
    try {
      const payload = {
        runnerId: parseInt(runnerId),
        description: `Completed a new run!`,
        imageUrl: null,
        runId: selectedRun.runId
      };

      console.log(payload);

      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/posts/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token') }`},
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        console.log('Run posted successfully!');
      } else {
        console.error('Failed to post run');
      }
    } catch (err) {
      console.error('Error posting run:', err);
    }

    setConfirmOpen(false);
    setSelectedRun(null);
  };

  useEffect(() => {
    fetchRuns(page);
  }, [page]);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Runs
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {runs.map((run, index) => (
            <Card key={index} sx={{ mb: 4 }}>
              {run.mapImageUrl && (
                <CardMedia
                  component="img"
                  height="200"
                  image={run.mapImageUrl}
                  alt="Run map"
                />
              )}
              <CardContent>
                <Typography variant="h6">Distance: {(run.distance / 1000).toFixed(2)} km</Typography>
                <Typography>Duration: {formatTime(run.duration)}</Typography>
                <Typography>Average speed: {run.averageSpeed.toFixed(2)} m/s</Typography>
                <Typography>Average pace: {run.pace}</Typography>
                <Typography>Recorded at: {new Date(run.timestamp).toLocaleString()}</Typography>

                <Button
                  variant="outlined"
                  sx={{
                    mt: 2,
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
                  onClick={() => handlePostConfirm(run)}
                >
                  Post this run
                </Button>
              </CardContent>
            </Card>
          ))}

          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#5D63D1',
              },
              '& .MuiPaginationItem-root.Mui-selected': {
                backgroundColor: '#5D63D1',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#4f46e5',
                },
              },
            }}
          />
        </>
      )}

      {/* Confirm Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Post</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to post this run?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handlePostRun}
            autoFocus
            sx={{
              backgroundColor: '#5D63D1',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#4a50b3'
              },
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Post
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
