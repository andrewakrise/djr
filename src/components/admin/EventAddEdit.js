import React, { useState, useEffect } from "react";
import {
  useAddEventMutation,
  useUpdateEventMutation,
} from "../../services/event";
import {
  TextField,
  Button,
  DialogActions,
  Alert,
  Container,
} from "@mui/material";
import dayjs from "dayjs";
import dayjsPluginUTC from "dayjs-plugin-utc";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
dayjs.extend(dayjsPluginUTC);

function EventAddEdit({ event, onAddSuccess, refetchEvents }) {
  const [addEvent] = useAddEventMutation();
  const [updateEvent] = useUpdateEventMutation();

  const [title, setTitle] = useState(event?.title || "");
  const [description, setDescription] = useState(event?.description || "");
  const [date, setDate] = useState(event?.date ? event.date.split("T")[0] : "");
  const [location, setLocation] = useState(event?.location || "");
  const [imageUrl, setImageUrl] = useState(event?.image?.url || "");
  const [ticketUrl, setTicketUrl] = useState(event?.ticketUrl || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  useEffect(() => {
    if (event) {
      setTitle(event?.title);
      setDescription(event?.description);
      setDate(event?.date.split("T")[0]);
      setLocation(event?.location);
      setImageUrl(event?.image?.url || "");
      setTicketUrl(event?.ticketUrl);
    }
  }, [event]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const utcDate = dayjs(date).utc().toISOString();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("date", utcDate);
    formData.append("location", location);
    if (imageFile) formData.append("image", imageFile);
    formData.append("ticketUrl", ticketUrl);

    try {
      let result;
      if (event) {
        result = await updateEvent({ eventId: event?._id, data: formData });
      } else {
        result = await addEvent(formData);
      }

      if (result?.data) {
        setSuccess(`${result?.data?.msg}`);
        setTitle("");
        setDescription("");
        setDate("");
        setLocation("");
        setImageUrl("");
        setTicketUrl("");
        onAddSuccess();
        refetchEvents();
      }
    } catch (err) {
      setError(
        `Server error: ${err?.data?.msg || err?.error || "Unknown error"}`
      );
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DateTimePicker"]}>
            <DatePicker
              label="Date"
              value={date ? dayjs(date) : null}
              onChange={(newValue) => setDate(newValue)}
            />
          </DemoContainer>
        </LocalizationProvider>
        <TextField
          label="Location"
          variant="outlined"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          fullWidth
          margin="normal"
        />
        <input accept="image/*" type="file" onChange={handleImageChange} />
        <TextField
          label="Ticket URL"
          variant="outlined"
          value={ticketUrl}
          onChange={(e) => setTicketUrl(e.target.value)}
          fullWidth
          margin="normal"
        />
        <DialogActions>
          <Button onClick={onAddSuccess}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {event ? "Update Event" : "Add Event"}
          </Button>
        </DialogActions>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
      </form>
    </Container>
  );
}

export default EventAddEdit;
