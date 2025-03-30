import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Button color="inherit" component={Link} to="/">
          HOME
        </Button>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, mx: 2 }}>
          Admin Dashboard
        </Typography>
        <Button onClick={handleLogout} color="secondary">
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default AdminNavbar;
