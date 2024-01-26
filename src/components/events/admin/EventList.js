import React, { useState } from "react";
import {
  useGetAllEventsQuery,
  useDeleteEventMutation,
} from "../../../services/event";
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
  ListItemAvatar,
  IconButton,
  Paper,
  Alert,
  Avatar,
} from "@mui/material";
import EventAddEdit from "./EventAddEdit";
import { Delete, Edit } from "@mui/icons-material";

function EventList() {
  const { data: events, isLoading, isError, refetch } = useGetAllEventsQuery();
  const [deleteEvent] = useDeleteEventMutation();
  const [openAddEventForm, setOpenAddEventForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleDialogOpen = () => {
    setOpenAddEventForm(true);
  };

  const handleDialogClose = () => {
    setOpenAddEventForm(false);
  };

  const handleDelete = async (id) => {
    try {
      const result = await deleteEvent(id);
      if (result?.data) {
        setSuccess("Event deleted successfully");
        setTimeout(() => {
          setError("");
          setSuccess("");
          refetch();
        }, 3000);
      }
    } catch (err) {
      setError(`Server error: ${err?.data?.msg || err?.status}`);
    }
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    handleDialogOpen();
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading events.</div>;

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
        Events
      </Typography>
      <Button variant="contained" color="primary" onClick={handleDialogOpen}>
        Add New Event
      </Button>
      <Dialog open={openAddEventForm} onClose={handleDialogClose} fullWidth>
        <DialogTitle>
          {selectedEvent ? "Update Event" : "Add a New Event"}
        </DialogTitle>
        <DialogContent>
          <EventAddEdit
            event={selectedEvent}
            onAddSuccess={() => {
              handleDialogClose();
              setSelectedEvent(null);
            }}
            refetchEvents={refetch}
          />
        </DialogContent>
      </Dialog>
      {success && <Alert severity="success">{success}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      <Paper elevation={3} sx={{ mt: 2 }}>
        <List>
          {events && events?.length > 0 ? (
            events?.map((event) => (
              <ListItem key={event?._id} divider alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt="Remy Sharp" src={event?.image?.url} />
                </ListItemAvatar>
                <ListItemText
                  primary={event?.title}
                  secondary={new Date(event?.date).toLocaleDateString()}
                  sx={{ m: 1, maxWidth: 150 }}
                />
                <ListItemText
                  primary={event?.description}
                  sx={{ m: 1, maxWidth: 250 }}
                />
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(event?._id)}
                >
                  <Delete />
                </IconButton>
                <IconButton edge="end" onClick={() => handleEdit(event)}>
                  <Edit />
                </IconButton>
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No events available." />
            </ListItem>
          )}
        </List>
      </Paper>
    </Box>
  );
}

export default EventList;
