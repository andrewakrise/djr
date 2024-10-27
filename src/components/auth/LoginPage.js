// Example: Login Component (e.g., LoginPage.js)
import React, { useState } from "react";
import { useLoginUserMutation } from "../../services/auth";
import { useNavigate } from "react-router-dom";
import { Typography, TextField, Button, Alert, Container } from "@mui/material";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const result = await loginUser({ email, password }).unwrap();
      if (result.token) {
        localStorage.setItem("token", result.token);

        setSuccess("Login successful!");
        setTimeout(() => {
          navigate("/rdj-api");
        }, 1500);
      }
    } catch (err) {
      setError(err?.data?.msg || "Login failed");
    }
  };

  return (
    <Container>
      <Typography variant="h4" align="center" mt={2} gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>
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
    </Container>
  );
}

export default LoginPage;
