import React, { useState } from "react";
import { useAddVideoLinkMutation } from "../../../services/video";
import { TextField, Button, Container, Alert } from "@mui/material";

function VideoLinkAdd({ onAddSuccess, refetchVideoLinks }) {
  const [addVideoLink] = useAddVideoLinkMutation();
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const isValidUrl = (url) => {
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    // Add other URL formats if necessary
    return youtubeRegex.test(url);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isValidUrl(url)) {
      setError("Please enter a valid YouTube URL.");
      return;
    }
    if (!description?.trim()) {
      setError("Please enter the description to URL.");
      return;
    }

    const result = await addVideoLink({ url, description });
    if (result?.data) {
      setSuccess(`${result?.data?.msg}`);
      setTimeout(() => {
        setUrl("");
        setDescription("");
        setError("");
        setSuccess("");
        refetchVideoLinks?.();
        onAddSuccess();
      }, 3000);
    } else {
      setError(`Server error:${result?.error?.data?.msg}`);
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Video URL"
          variant="outlined"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          fullWidth
          margin="normal"
          error={!!error}
          helperText={error}
        />
        <TextField
          label="The URL Description"
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
          error={!!error}
          helperText={error}
        />
        <Button type="submit" variant="contained" color="primary">
          Add Video Link
        </Button>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
      </form>
    </Container>
  );
}

export default VideoLinkAdd;
