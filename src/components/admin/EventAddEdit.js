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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import dayjs from "dayjs";
import dayjsPluginUTC from "dayjs-plugin-utc";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  DatePicker,
  TimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
dayjs.extend(dayjsPluginUTC);

function EventAddEdit({ event, onAddSuccess, refetchEvents }) {
  const [addEvent] = useAddEventMutation();
  const [updateEvent] = useUpdateEventMutation();

  const [title, setTitle] = useState(event?.title || "");
  const [description, setDescription] = useState(event?.description || "");
  const [date, setDate] = useState(event?.date ? event.date.split("T")[0] : "");
  const [startTime, setStartTime] = useState(event?.startTime || null);
  const [endTime, setEndTime] = useState(event?.endTime || null);
  const [location, setLocation] = useState(event?.location || "");
  const [address, setAddress] = useState(event?.address || "");
  const [clientName, setClientName] = useState(event?.clientName || "");
  const [clientEmail, setClientEmail] = useState(event?.clientEmail || "");
  const [phoneNumber, setPhoneNumber] = useState(event?.phoneNumber || "");
  const [services, setServices] = useState(() => {
    if (event && event?.services) {
      return Array.isArray(event.services)
        ? event?.services
        : [event?.services];
    }
    return [];
  });
  const [totalSum, setTotalSum] = useState(event?.totalSum || 0);
  const [depositSum, setDepositSum] = useState(event?.depositSum || 0);
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

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber);
  };

  useEffect(() => {
    if (event) {
      setTitle(event?.title);
      setDescription(event?.description);
      setDate(event?.date.split("T")[0]);
      setStartTime(event?.startTime ? dayjs(event?.startTime, "HH:mm") : null);
      setEndTime(event?.endTime ? dayjs(event?.endTime, "HH:mm") : null);
      setLocation(event?.location);
      setAddress(event?.address);
      setClientName(event?.clientName);
      setClientEmail(event?.clientEmail);
      setPhoneNumber(event?.phoneNumber);
      setTotalSum(event.totalSum !== undefined ? event.totalSum : 0);
      setDepositSum(event.depositSum !== undefined ? event.depositSum : 0);
      setImageUrl(event?.image?.url || "");
      setTicketUrl(event?.ticketUrl);
      let servicesFromEvent = event.services;
      if (Array.isArray(servicesFromEvent)) {
        setServices(servicesFromEvent);
      } else if (typeof servicesFromEvent === "string") {
        setServices([servicesFromEvent]);
      } else {
        setServices([]);
      }
    }
  }, [event]);
  console.log("event", event);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isValidEmail(clientEmail)) {
      setError("Invalid email format");
      return;
    }
    if (!isValidPhoneNumber(phoneNumber)) {
      setError("Invalid phone number");
      return;
    }
    if (totalSum < 0 || depositSum < 0) {
      setError("Total sum and deposit sum must be positive numbers");
      return;
    }
    if (!services.length) {
      setError("Please select at least one service");
      return;
    }
    if (!startTime || !endTime) {
      setError("Start time and end time are required");
      return;
    }
    let eventId;
    if (event && (event?.id || event?._id)) {
      eventId = event?.id || event?._id;
    }

    const utcDate = dayjs(date).utc().toISOString();
    const formattedStartTime = dayjs(startTime).format("HH:mm");
    const formattedEndTime = dayjs(endTime).format("HH:mm");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("date", utcDate);
    formData.append("location", location);
    formData.append("address", address);
    if (imageFile) formData.append("image", imageFile);
    formData.append("ticketUrl", ticketUrl);
    formData.append("startTime", formattedStartTime);
    formData.append("endTime", formattedEndTime);
    formData.append("clientName", clientName);
    formData.append("clientEmail", clientEmail);
    formData.append("phoneNumber", phoneNumber);
    services.forEach((service) => {
      formData.append("services", service);
    });
    formData.append("totalSum", totalSum);
    formData.append("depositSum", depositSum);

    try {
      let result;
      if (event) {
        result = await updateEvent({ eventId: eventId, data: formData });
      } else {
        result = await addEvent(formData);
      }

      if (result?.data) {
        setSuccess(`${result?.data?.msg}`);
        setTitle("");
        setDescription("");
        setDate(null);
        setStartTime(null);
        setEndTime(null);
        setLocation("");
        setAddress("");
        setClientName("");
        setClientEmail("");
        setPhoneNumber("");
        setServices([]);
        setTotalSum(0);
        setDepositSum(0);
        setImageFile(null);
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
  console.log("Services state before render:", services);

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
          <DemoContainer components={["TimePicker"]}>
            <TimePicker
              label="Start Time"
              value={startTime ? dayjs(startTime, "HH:mm") : null}
              onChange={(newValue) => setStartTime(newValue)}
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="normal" />
              )}
              required
            />
          </DemoContainer>
          <DemoContainer components={["TimePicker"]}>
            <TimePicker
              label="End Time"
              value={endTime ? dayjs(endTime, "HH:mm") : null}
              onChange={(newValue) => setEndTime(newValue)}
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="normal" />
              )}
              required
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
        <TextField
          label="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <input accept="image/*" type="file" onChange={handleImageChange} />
        {/* Client Details */}
        <TextField
          label="Client Name"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Client Email"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        {/* Services */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Services</InputLabel>
          <Select
            multiple
            value={services || []}
            onChange={(e) => setServices(e.target.value)}
            renderValue={(selected) => {
              console.log("Render value selected:", selected);
              return Array.isArray(selected)
                ? selected.join(", ")
                : selected || "";
            }}
          >
            <MenuItem value="DJing Services">DJing Services</MenuItem>
            <MenuItem value="DJ Controller">DJ Setup/Controller</MenuItem>
            <MenuItem value="Lighting">Lighting</MenuItem>
            <MenuItem value="Sound System">Sound System</MenuItem>
            <MenuItem value="Wireless mic">Wireless mic</MenuItem>
            <MenuItem value="2 wireless mics">2 wireless mics</MenuItem>
            <MenuItem value="8 channel mixer">8 channel mixer</MenuItem>
            <MenuItem value="16 channel mixer">16 channel mixer</MenuItem>
            <MenuItem value="Setting of the above equipment at the event venue">
              Setting of the above equipment at the event venue
            </MenuItem>
            <MenuItem value="Logistics">Logistics</MenuItem>
          </Select>
        </FormControl>
        {/* Financials */}
        <TextField
          label="Total Sum"
          value={totalSum}
          onChange={(e) => setTotalSum(Number(e.target.value))}
          fullWidth
          margin="normal"
          type="number"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          required
        />
        <TextField
          label="Deposit Sum"
          value={depositSum}
          onChange={(e) => setDepositSum(Number(e.target.value))}
          fullWidth
          margin="normal"
          type="number"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          required
        />
        <TextField
          label="Ticket URL"
          variant="outlined"
          value={ticketUrl}
          onChange={(e) => setTicketUrl(e.target.value)}
          fullWidth
          margin="normal"
        />
        {/* Form Actions */}
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
