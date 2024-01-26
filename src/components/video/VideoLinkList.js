import React, { useState } from "react";
import {
  useGetAllVideoLinksQuery,
  useDeleteVideoLinkMutation,
} from "../../services/video";
import { Link } from "react-router-dom";
import {
  Typography,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Alert,
} from "@mui/material";
import VideoLinkAdd from "./VideoLinkAdd";
import { Delete, Edit } from "@mui/icons-material/";

function VideoLinkList() {
  const {
    data: videoLinks,
    isLoading,
    isError,
    refetch,
  } = useGetAllVideoLinksQuery();
  const [deleteVideoLink] = useDeleteVideoLinkMutation();
  const [openAddVideoForm, setOpenAddVideoForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleDialogOpen = () => {
    setOpenAddVideoForm(true);
  };

  const handleDialogClose = () => {
    setOpenAddVideoForm(false);
  };

  const handleDelete = async (id) => {
    console.log("handleDelete", id);
    const result = await deleteVideoLink({ videoId: id.toString() });
    if (result?.data) {
      setSuccess(`${result?.data?.msg}`);
      setTimeout(() => {
        setError("");
        setSuccess("");
        refetch();
      }, 3000);
    } else {
      setError(`Server error:${result?.error?.data?.msg}`);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!videoLinks)
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography sx={{ padding: "0 0 2rem 0" }}>
          There is no links.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleDialogOpen}>
          Add New Video Link
        </Button>
        <Dialog open={openAddVideoForm} onClose={handleDialogClose} fullWidth>
          <DialogTitle>Add a New Video Link</DialogTitle>
          <DialogContent>
            <VideoLinkAdd
              onAddSuccess={handleDialogClose}
              refetchVideoLinks={refetch}
            />
          </DialogContent>
        </Dialog>
      </Box>
    );
  if (isError) return <div>Error loading video links yet.</div>;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem 0",
        margin: "1rem 0",
      }}
    >
      <Typography variant="h4" sx={{ mb: 2, textAlign: "center" }}>
        Video Links
      </Typography>
      <Paper elevation={3}>
        <List>
          {videoLinks && videoLinks?.length > 0 ? (
            videoLinks?.map((video) => (
              <ListItem key={video?._id} divider>
                <ListItemText primary={video?.url} sx={{ m: 1 }} />
                <ListItemText primary={video?.description} sx={{ m: 1 }} />
                <ListItemText
                  primary={`${new Date(
                    video?.createdAt
                  ).toLocaleDateString()} ${new Date(
                    video?.createdAt
                  ).toLocaleTimeString()}`}
                  sx={{ m: 1 }}
                />
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(video?._id)}
                >
                  <Delete />
                </IconButton>
                <IconButton
                  edge="end"
                  component={Link}
                  to={`/update-video/${video?._id}`}
                >
                  <Edit />
                </IconButton>
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No video links available." />
            </ListItem>
          )}
        </List>
      </Paper>
      <Button
        variant="contained"
        color="primary"
        onClick={handleDialogOpen}
        sx={{ mt: 2 }}
      >
        Add New Video Link
      </Button>
      <Dialog open={openAddVideoForm} onClose={handleDialogClose} fullWidth>
        <DialogTitle>Add a New Video Link</DialogTitle>
        <DialogContent>
          <VideoLinkAdd onAddSuccess={handleDialogClose} />
        </DialogContent>
      </Dialog>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
    </Box>
  );
}

export default VideoLinkList;
