// src/components/auth/SignupPage.js
import React, { useState } from "react";
import { useSignupUserMutation } from "../../services/auth";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Alert,
  Container,
  Typography,
  Box,
} from "@mui/material";

function SignupPage() {
  const [signupUser, { isLoading }] = useSignupUserMutation();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [jwtSecret, setJwtSecret] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const userDetails = {
        username,
        email,
        password,
        jwtSecret,
      };

      const result = await signupUser(userDetails).unwrap();

      if (result.token) {
        localStorage.setItem("token", result.token);
        setSuccess("Signup successful!");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (err) {
      setError(err?.data?.msg || "Signup failed. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
            helperText="Minimum 8 characters"
          />
          <TextField
            label="jwtSecret"
            variant="outlined"
            value={jwtSecret}
            onChange={(e) => setJwtSecret(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              onClick={() => navigate("/login")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </Button>
          </Box>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {success}
            </Alert>
          )}
        </form>
      </Box>
    </Container>
  );
}

export default SignupPage;
