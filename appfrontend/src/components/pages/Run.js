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
  useTheme,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from "@mui/material";
import html2canvas from "html2canvas";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import leafletImage from "leaflet-image";


// const switchPlaylistByType = (type) => {
//   const filtered = playlists.filter(p => p.type === type);
//   if (filtered.length === 0) return;

//   // Alege un playlist aleatoriu din cele filtrate
//   const newPlaylist = filtered[Math.floor(Math.random() * filtered.length)];
//   const pid = extractYouTubePlaylistId(newPlaylist.link);

//   // Verificam daca e deja redat acelaai playlist
//   if (!pid || newPlaylist.playlistId === currentPlaylistId) return;

//   // Oprește playerul curent daca exista
//   if (currentPlaylistId && ytPlayers[currentPlaylistId]) {
//     ytPlayers[currentPlaylistId].stopVideo();
//   }

//   // Pornește noul playlist
//   const newPlayer = ytPlayers[newPlaylist.playlistId];
//   if (newPlayer) {
//     newPlayer.playVideo();
//     setCurrentPlaylistId(newPlaylist.playlistId);
//   }
// };



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
  const [playlists, setPlaylists] = useState([]);
  const [assistDialogOpen, setAssistDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const iframeRefs = useRef({});
  const runnerId = localStorage.getItem("runnerId");
  const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/dw9vaqeyh/image/upload";
  const CLOUDINARY_UPLOAD_PRESET = "runnbeats_unsigned";


  const deg2rad = (deg) => deg * (Math.PI / 180);

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const formatPace = (secondsPerKm) => {
    if (!isFinite(secondsPerKm)) return "--:--";
    const min = Math.floor(secondsPerKm / 60);
    const sec = String(Math.floor(secondsPerKm % 60)).padStart(2, "0");
    return `${min}:${sec} /km`;
  };

  const startTracking = () => {
    setPath([]);
    setTotalDistance(0);
    setElapsed(0);
    startTimeRef.current = Date.now();
    startMarkerRef.current = null;

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude: lat, longitude: lon, accuracy } = position.coords;
        if (accuracy > 30) return;
        const newPoint = [lat, lon];
        if (!startMarkerRef.current && mapInstance.current) {
          startMarkerRef.current = L.marker(newPoint)
            .addTo(mapInstance.current)
            .bindPopup("Start")
            .openPopup();
        }
        setPath((prev) => {
          if (prev.length > 0) {
            const last = prev[prev.length - 1];
            const dist = getDistance(last[0], last[1], lat, lon);
            if (dist < 100) setTotalDistance((prevDist) => prevDist + dist);
            else return prev;
          }
          const updatedPath = [...prev, newPoint];
          if (polylineRef.current) {
            polylineRef.current.setLatLngs(updatedPath);
            mapInstance.current.setView(newPoint, 16);
          }
          return updatedPath;
        });
      },
      (err) => alert("GPS Error: " + err.message),
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
    Object.values(iframeRefs.current).forEach((iframe) => {
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage('"stopVideo"', '*');
      }
    });
  };

  const handleSaveRun = async () => {
  const paceSecondsPerKm = elapsed && totalDistance > 0 ? elapsed / (totalDistance / 1000) : 0;
  const runData = {
    distance: totalDistance / 1000,
    duration: elapsed,
    pace: paceSecondsPerKm / 60,
    averageSpeed: totalDistance / (elapsed || 1),
    path,
    timestamp: new Date().toISOString(),
    runnerId,
    mapImageUrl: null,
  };

  try {
    if (mapInstance.current) {
      leafletImage(mapInstance.current, async (err, canvas) => {
        if (err) {
          console.error("leaflet-image error:", err);
          return;
        }

        const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
        const formData = new FormData();
        formData.append("file", blob);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        const uploadRes = await fetch(CLOUDINARY_UPLOAD_URL, {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();
        runData.mapImageUrl = uploadData.secure_url;

        await fetch(`${process.env.REACT_APP_API_URL}/api/v1/run/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(runData),
        });

        setSaveDialogOpen(false);
      });
    }
  } catch (err) {
    console.error("Error saving run:", err);
  }
};

  const handleAssistedRunStart = async () => {
    if (!selectedType) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/playlist/get/${runnerId}/playlists/by-type?type=${selectedType}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      console.log(data);
      setPlaylists(data);
      setAssistDialogOpen(false);
    } catch (err) {
      console.error("Error loading assisted playlists:", err);
    }
  };

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    mapInstance.current = L.map(mapRef.current).setView([45.9432, 24.9668], 6);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(mapInstance.current);
    polylineRef.current = L.polyline([], { color: "red" }).addTo(mapInstance.current);
    setTimeout(() => mapInstance.current.invalidateSize(), 0);

    fetch(`${process.env.REACT_APP_API_URL}/api/v1/playlist/get/${runnerId}/playlists`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setPlaylists(data))
      .catch((err) => console.error("Failed to load playlists:", err));

    // Simulare achievement hardcodata la montarea componentei
    setUnlockedAchievements([
      {
        id: "test_achievement_001",
        title: "Single Run Distance level GOLD",
        description: "You completed a 10km run"
      }
    ]);
    setAchievementDialogOpen(true);

  }, []);

  const extractYouTubePlaylistId = (url) => {
    const regex = /[?&]list=([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  return (
    <Box p={3} sx={{ backgroundColor: "#f4f6fa", borderRadius: 4, boxShadow: 4, pb: 8 }}>
      <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: "rgba(93, 99, 209, 0.9)" }}>
        Your Running Journey
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Button variant="contained" onClick={startTracking} sx={{ backgroundColor: "rgba(93, 99, 209, 0.7)", '&:hover': { backgroundColor: 'rgba(93, 99, 209, 0.9)' } }}>Start</Button>
        <Button variant="contained" onClick={stopTracking} sx={{ backgroundColor: "rgba(93, 99, 209, 0.7)", '&:hover': { backgroundColor: 'rgba(93, 99, 209, 0.9)' } }}>Stop</Button>
        <Button variant="contained" onClick={() => setAssistDialogOpen(true)} sx={{ backgroundColor: "rgba(93, 99, 209, 0.7)", '&:hover': { backgroundColor: 'rgba(93, 99, 209, 0.9)' } }}>Assisted Run</Button>
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 4 }}>
        {[{
          label: "Distance", value: `${totalDistance.toFixed(2)} m`
        }, {
          label: "Duration", value: formatTime(elapsed)
        }, {
          label: "Avg Speed", value: `${(totalDistance / (elapsed || 1)).toFixed(2)} m/s`
        }, {
          label: "Avg Pace", value: formatPace((elapsed && totalDistance > 0) ? (elapsed / (totalDistance / 1000)) : 0)
        }].map((stat, idx) => (
          <Box key={idx} sx={{ flex: "1 1 calc(50% - 8px)" }}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2">{stat.label}</Typography>
                <Typography variant="h6">{stat.value}</Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      <Box id="map" sx={{ height: "400px", borderRadius: 2, overflow: "hidden", boxShadow: 3 }} ref={mapRef}></Box>

      <Box mt={5}>
        <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: "rgba(93, 99, 209, 0.9)" }}>
          Your Playlists
        </Typography>
        <Grid container spacing={2}>
          {playlists.map((playlist) => {
            const pid = extractYouTubePlaylistId(playlist.link);
            return pid ? (
              <Grid item xs={12} sm={6} md={4} key={playlist.playlistId}>
                <Card elevation={2}>
                  <CardContent sx={{ p: 0 }}>
                    <iframe
                      ref={(el) => iframeRefs.current[playlist.playlistId] = el}
                      width="100%"
                      height="315"
                      src={`https://www.youtube.com/embed/videoseries?list=${pid}`}
                      frameBorder="0"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      title={`Playlist ${playlist.playlistId}`}
                    ></iframe>
                  </CardContent>
                </Card>
              </Grid>
            ) : null;
          })}
        </Grid>
      </Box>

      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>Save this run?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ textAlign: "center", fontSize: "1.1rem" }}>
            Do you want to save this running session?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button onClick={() => setSaveDialogOpen(false)} color="error" variant="outlined">No</Button>
          <Button onClick={handleSaveRun} sx={{ backgroundColor: 'rgba(93, 99, 209, 0.7)', color: 'white', '&:hover': { backgroundColor: 'rgba(93, 99, 209, 0.9)' } }}>Yes</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={assistDialogOpen} onClose={() => setAssistDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: "bold" }}>What type of running do you need assistance for?</DialogTitle>
        <DialogContent sx={{ minWidth: 300 }}>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Playlist Type</InputLabel>
            <Select
              value={selectedType}
              label="Playlist Type"
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <MenuItem value="BOOST">BOOST</MenuItem>
              <MenuItem value="CHILL">CHILL</MenuItem>
              <MenuItem value="VIBE">VIBE</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button onClick={() => setAssistDialogOpen(false)} color="error" variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleAssistedRunStart}
            disabled={!selectedType}
            sx={{ backgroundColor: "rgba(93, 99, 209, 0.7)", color: "white", '&:hover': { backgroundColor: "rgba(93, 99, 209, 0.9)" } }}
          >
            Start
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
  open={achievementDialogOpen}
  onClose={() => setAchievementDialogOpen(false)}
  PaperProps={{
    sx: {
      borderRadius: 4,
      px: 3,
      pt: 3,
      pb: 2,
      background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
      minWidth: 350,
      maxWidth: 420,
      textAlign: "center",
      animation: "fadeInScale 0.4s ease-in-out",
    },
  }}
>
  <Box display="flex" flexDirection="column" alignItems="center">
    <Box
      sx={{
        width: 80,
        height: 80,
        borderRadius: "50%",
        backgroundColor: "#5d63d1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mb: 2,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <Typography variant="h3" component="div" sx={{ color: "white" }}>
        🏅
      </Typography>
    </Box>

    <Typography variant="h5" fontWeight="bold" sx={{ color: "#333", mb: 1 }}>
      Achievement 10K Run Unlocked!
    </Typography>

    {unlockedAchievements.map((ach, idx) => (
      <Box key={idx} mb={2}>
        <Typography variant="h6" sx={{ color: "#5d63d1" }}>{ach.title}</Typography>
        <Typography variant="body2" sx={{ color: "#555", mt: 0.5 }}>{ach.description}</Typography>
      </Box>
    ))}

    <Button
      onClick={() => setAchievementDialogOpen(false)}
      variant="contained"
      sx={{
        backgroundColor: "#5d63d1",
        color: "white",
        px: 4,
        borderRadius: 2,
        mt: 1,
        '&:hover': {
          backgroundColor: "#3f45b2"
        }
      }}
    >
      Close
    </Button>
  </Box>
</Dialog>

    </Box>
  );
};

export default Run;
