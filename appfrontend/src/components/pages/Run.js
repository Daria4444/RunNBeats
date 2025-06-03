import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  useTheme,
  Snackbar,
  Alert
} from "@mui/material";
import html2canvas from "html2canvas";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Run = () => {
  const theme = useTheme();
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const polylineRef = useRef(null);
  const startMarkerRef = useRef(null);
  const [watchId, setWatchId] = useState(null);
  const [path, setPath] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [achievementDialogOpen, setAchievementDialogOpen] = useState(false);
  const runnerId = localStorage.getItem('runnerId');

  const deg2rad = deg => deg * (Math.PI / 180);

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const formatPace = (secondsPerKm) => {
    if (!isFinite(secondsPerKm)) return "--:--";
    const min = Math.floor(secondsPerKm / 60);
    const sec = String(Math.floor(secondsPerKm % 60)).padStart(2, '0');
    return `${min}:${sec} /km`;
  };

  const startTracking = () => {
    setPath([]);
    setTotalDistance(0);
    setElapsed(0);
    startTimeRef.current = Date.now();
    startMarkerRef.current = null;

    const id = navigator.geolocation.watchPosition(
      position => {
        const { latitude: lat, longitude: lon, accuracy } = position.coords;
        if (accuracy > 30) return;
        const newPoint = [lat, lon];
        if (!startMarkerRef.current && mapInstance.current) {
          startMarkerRef.current = L.marker(newPoint)
            .addTo(mapInstance.current)
            .bindPopup("Start")
            .openPopup();
        }
        setPath(prev => {
          if (prev.length > 0) {
            const last = prev[prev.length - 1];
            const dist = getDistance(last[0], last[1], lat, lon);
            if (dist < 100) {
              setTotalDistance(prevDist => prevDist + dist);
            } else {
              return prev;
            }
          }
          const updatedPath = [...prev, newPoint];
          if (polylineRef.current) {
            polylineRef.current.setLatLngs(updatedPath);
            mapInstance.current.setView(newPoint, 16);
          }
          return updatedPath;
        });
      },
      err => alert("Eroare GPS: " + err.message),
      { enableHighAccuracy: true, maximumAge: 1000 }
    );
    setWatchId(id);
    intervalRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
  };

  const stopTracking = () => {
    if (watchId) navigator.geolocation.clearWatch(watchId);
    clearInterval(intervalRef.current);
    setSaveDialogOpen(true);
  };

  const handleSaveRun = async () => {
    const paceSecondsPerKm = (elapsed && totalDistance > 0) ? (elapsed / (totalDistance / 1000)) : 0;

    const runData = {
      distance: totalDistance,
      duration: elapsed,
      pace: paceSecondsPerKm / 60,
      averageSpeed: totalDistance / (elapsed || 1),
      path: path,
      timestamp: new Date().toISOString(),
      runnerId: runnerId
    };

    const mapElement = document.getElementById("map");
    if (mapElement) {
      const canvas = await html2canvas(mapElement);
      const imageData = canvas.toDataURL("image/png");
      runData.mapImage = imageData;
    }

    fetch(`${process.env.REACT_APP_API_URL}/api/v1/run/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(runData),
    })
      .then(res => res.json())
      .then(data => {
        console.log("Răspuns de la backend:", data);
        if (data.newlyUnlockedAchievements && data.newlyUnlockedAchievements.length > 0) {
          setUnlockedAchievements(data.newlyUnlockedAchievements);
          setAchievementDialogOpen(true);
        }
        console.log("Run saved:", data);
      })
      .catch(err => console.error("Error saving run:", err));

    setSaveDialogOpen(false);
  };

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    mapInstance.current = L.map(mapRef.current).setView([45.9432, 24.9668], 6);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapInstance.current);
    polylineRef.current = L.polyline([], { color: "red" }).addTo(mapInstance.current);
  }, []);

  const averageSpeed = totalDistance / (elapsed || 1);
  const paceSecondsPerKm = (elapsed && totalDistance > 0) ? (elapsed / (totalDistance / 1000)) : 0;

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>Traseul tău de alergare</Typography>
      <Button variant="contained" color="primary" onClick={startTracking} sx={{ mr: 2 }}>Start</Button>
      <Button variant="contained" color="secondary" onClick={stopTracking}>Stop</Button>

      <Box mt={2}>
        <Typography>Distanță: {totalDistance.toFixed(2)} m</Typography>
        <Typography>Durată: {formatTime(elapsed)}</Typography>
        <Typography>Viteză medie: {averageSpeed.toFixed(2)} m/s</Typography>
        <Typography>Pace mediu: {formatPace(paceSecondsPerKm)}</Typography>
      </Box>

      <Box mt={2} id="map" sx={{ height: "400px", borderRadius: 2, overflow: "hidden", boxShadow: 3 }} ref={mapRef}></Box>

      <Dialog
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        TransitionComponent={Transition}
        keepMounted
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 2,
            background: theme.palette.background.paper,
            boxShadow: theme.shadows[10],
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>Salvezi alergarea?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ textAlign: "center", fontSize: "1.1rem" }}>
            Vrei să salvezi această sesiune de alergare?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button onClick={() => setSaveDialogOpen(false)} color="error" variant="outlined">Nu</Button>
          <Button onClick={handleSaveRun} color="primary" variant="contained">Da</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={achievementDialogOpen}
        onClose={() => setAchievementDialogOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: 'bold' }}>🎉 Felicitări!</DialogTitle>
        <DialogContent>
          {unlockedAchievements.map((ach, idx) => (
            <Box key={idx} sx={{ mb: 2, textAlign: "center" }}>
              <Typography variant="h6">🏅 {ach.name}</Typography>
              <Typography variant="body2" color="text.secondary">{ach.description}</Typography>
              <Typography variant="caption">Level: {ach.level} | Type: {ach.type}</Typography>
            </Box>
          ))}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button variant="contained" onClick={() => setAchievementDialogOpen(false)}>Ok</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Run;
