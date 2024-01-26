import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const AdminNavbar = () => {
  return (
    <AppBar position="sticky" sx={{ pb: 1 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Admin Dashboard
        </Typography>
        <Button color="inherit" component={Link} to="/rdj-api/video-links">
          Videos
        </Button>
        <Button color="inherit" component={Link} to="/rdj-api/events">
          Events
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default AdminNavbar;
