// src/components/Navbar.jsx

import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          SQL DateBase
        </Typography>
        <Button color="inherit" href="https://www.instagram.com/_rassul_088?igsh=bW1qdnZwejh4aWp4" target="_blank">
          MY IG
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
