import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import { Link as RouterLink } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';

const NavBar = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        top: 'auto',
        bottom: 0,
        backgroundColor: '#5D63D1',
      }}
    >
      <Toolbar
        sx={{
          minHeight: 30,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          paddingY: 0.5,
        }}
      >
        <IconButton color="inherit" component={RouterLink} to="/search" size="small">
          <SearchIcon fontSize="medium" />
        </IconButton>

        <IconButton color="inherit" component={RouterLink} to="/feedPage" size="small">
          <HomeIcon fontSize="medium" />
        </IconButton>

        <IconButton color="inherit" component={RouterLink} to="/run" size="small">
          <DirectionsRunIcon fontSize="medium" />
        </IconButton>

        <IconButton color="inherit" component={RouterLink} to="/profile" size="small">
          <AccountCircleIcon fontSize="medium" />
        </IconButton>

      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
