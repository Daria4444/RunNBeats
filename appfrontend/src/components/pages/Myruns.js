import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Pagination
} from '@mui/material';

export default function Myruns() {
  const runnerId = localStorage.getItem('runnerId'); // ⚠️ Asigură-te că e setat după login
  const [runs, setRuns] = useState([]);
  const [page, setPage] = useState(1); // UI începe de la 1
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchRuns = async (pageNumber) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/run/runner/${runnerId}?page=${pageNumber - 1}&size=5`);
      const data = await res.json();
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
          {runs.map((run) => (
            <Card key={run.runId} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">Distanță: {run.distance} km</Typography>
                <Typography>Timp: {run.runTime} min</Typography>
                <Typography>Pace mediu: {run.averagePace} min/km</Typography>
                <Typography>Locație: {run.runLocation}</Typography>
              </CardContent>
            </Card>
          ))}

          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary" // păstrăm tema default
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
