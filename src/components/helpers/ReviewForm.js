// src/components/helpers/ReviewForm.js

import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Alert,
} from "@mui/material";
import StarRating from "./StarRating";

function ReviewForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    eventDate: "",
    eventName: "",
    message: "",
    rate: 1,
    isWillingToHireAgain: false,
    isWillRecommend: false,
  });

  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRateChange = (newRate) => {
    setFormData((prev) => ({
      ...prev,
      rate: newRate,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Basic Validation
    if (
      !formData.email ||
      !formData.name ||
      !formData.eventDate ||
      !formData.message ||
      !formData.rate
    ) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    onSubmit(formData);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "1rem",
      }}
    >
      <Typography variant="h5">Submit Your Review</Typography>
      {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
      <TextField
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        type="email"
        required
      />
      <TextField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <TextField
        label="Event Date"
        name="eventDate"
        type="date"
        value={formData.eventDate}
        onChange={handleChange}
        InputLabelProps={{
          shrink: true,
        }}
        required
      />
      <TextField
        label="Event Name"
        name="eventName"
        value={formData.eventName}
        onChange={handleChange}
      />
      <TextField
        label="Message"
        name="message"
        value={formData.message}
        onChange={handleChange}
        multiline
        rows={4}
        required
      />
      <Box>
        <Typography variant="body1">Rating:</Typography>
        <StarRating rating={formData.rate} onRateChange={handleRateChange} />
      </Box>
      <FormControlLabel
        control={
          <Checkbox
            checked={formData.isWillingToHireAgain}
            onChange={handleChange}
            name="isWillingToHireAgain"
          />
        }
        label="Willing to Hire Again"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={formData.isWillRecommend}
            onChange={handleChange}
            name="isWillRecommend"
          />
        }
        label="Will Recommend"
      />
      <Button type="submit" variant="contained" disabled={isLoading}>
        {isLoading ? "Submitting..." : "Submit Review"}
      </Button>
    </Box>
  );
}

export default ReviewForm;
