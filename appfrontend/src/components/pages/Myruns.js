import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Pagination,
  CardMedia
} from '@mui/material';

export default function Myruns() {
  const runnerId = localStorage.getItem('runnerId');
  const [runs, setRuns] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const fetchRuns = async (pageNumber) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/run/runner/${runnerId}?page=${pageNumber - 1}&size=5`);
      const data = await res.json();
      console.log(data.content)
      setRuns(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Eroare la preluarea alergărilor:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRuns(page);
  }, [page]);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Alergările Mele
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
                  image={`${process.env.REACT_APP_API_URL}${run.mapImageUrl}`}
                  alt="Harta alergării"
                />
              )}
              <CardContent>
                <Typography variant="h6">Distanță: {(run.distance / 1000).toFixed(2)} km</Typography>
                <Typography>Durată: {formatTime(run.duration)}</Typography>
                <Typography>Viteză medie: {run.averageSpeed.toFixed(2)} m/s</Typography>
                <Typography>Pace mediu: {run.pace}</Typography>
                <Typography>Timp înregistrare: {new Date(run.timestamp).toLocaleString('ro-RO')}</Typography>
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
    </Box>
  );
}
