import React, { useState, useEffect } from "react";
import {
  useAddEventMutation,
  useUpdateEventMutation,
} from "../../../services/event";
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
  Autocomplete,
  FormControlLabel,
  Switch,
  Box,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

// Configure dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);

function EventAddEdit({ event, onAddSuccess, refetchEvents }) {
  const [addEvent] = useAddEventMutation();
  const [updateEvent] = useUpdateEventMutation();

  const [title, setTitle] = useState(event?.title || "");
  const [description, setDescription] = useState(event?.description || "");
  const [notes, setNotes] = useState(event?.notes || "");
  const [startDateTime, setStartDateTime] = useState(
    event?.startDateTime ? dayjs(event.startDateTime) : null
  );
  const [endDateTime, setEndDateTime] = useState(
    event?.endDateTime ? dayjs(event.endDateTime) : null
  );
  const [location, setLocation] = useState(event?.location || "");
  const [address, setAddress] = useState(event?.address || "");
  const [clientName, setClientName] = useState(event?.clientName || "");
  const [clientCompanyName, setClientCompanyName] = useState(
    event?.clientCompanyName || ""
  );
  const [clientEmail, setClientEmail] = useState(event?.clientEmail || "");
  const [phoneNumber, setPhoneNumber] = useState(event?.phoneNumber || "");
  const [services, setServices] = useState([]);
  const [customService, setCustomService] = useState("");
  const [totalSum, setTotalSum] = useState(event?.totalSum || 0);
  const [depositSum, setDepositSum] = useState(event?.depositSum || 0);
  const [imageUrl, setImageUrl] = useState(event?.image?.url || "");
  const [ticketUrl, setTicketUrl] = useState(event?.ticketUrl || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [djingHours, setDjingHours] = useState("");
  const [djingMinutes, setDjingMinutes] = useState("");
  const [supportDjingHours, setSupportDjingHours] = useState("");
  const [supportDjingMinutes, setSupportDjingMinutes] = useState("");
  const [customMicCount, setCustomMicCount] = useState("");
  const [customMixerCount, setCustomMixerCount] = useState("");
  const [soundSystemDetails, setSoundSystemDetails] = useState({
    venueType: "",
    guestCount: "",
    withStands: false,
  });
  const [expenses, setExpenses] = useState({
    equipment: event?.expenses?.equipment || 0,
    car: event?.expenses?.car || 0,
    food: event?.expenses?.food || 0,
    other: event?.expenses?.other || [],
  });
  const [otherDescription, setOtherDescription] = useState("");
  const [otherAmount, setOtherAmount] = useState(0);

  // Boolean toggles
  const [isPublic, setIsPublic] = useState(event?.isPublic || false);
  const [isConfirmed, setIsConfirmed] = useState(event?.isConfirmed || false);
  const [isFullyPaid, setIsFullyPaid] = useState(event?.isFullyPaid || false);

  const serviceOptions = [
    "DJing Services",
    "Support DJing Services",
    "DJ Controller",
    "Lighting",
    "Sound System",
    "Wireless mic",
    "2 wireless mics",
    " wireless mics",
    " channel mixer",
    "8 channel mixer",
    "16 channel mixer",
    "Logistics",
    "Setting of the above equipment at the event venue",
  ];

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
    const phoneRegex = /^(\+1\s?)?(\(\d{3}\)\s?|\d{3}[-\s]?)\d{3}[-\s]?\d{4}$/;
    return phoneRegex.test(phoneNumber);
  };

  useEffect(() => {
    if (event) {
      setTitle(event?.title);
      setDescription(event?.description);
      setNotes(event?.notes || "");
      setStartDateTime(event.startDateTime ? dayjs(event.startDateTime) : null);
      setEndDateTime(event.endDateTime ? dayjs(event.endDateTime) : null);
      setLocation(event?.location);
      setAddress(event?.address);
      setClientName(event?.clientName);
      setClientCompanyName(event?.clientCompanyName);
      setClientEmail(event?.clientEmail);
      setPhoneNumber(event?.phoneNumber);
      setTotalSum(event.totalSum !== undefined ? event.totalSum : 0);
      setDepositSum(event.depositSum !== undefined ? event.depositSum : 0);
      setImageUrl(event?.image?.url || "");
      setTicketUrl(event?.ticketUrl);
      let servicesFromEvent = event?.services;
      if (typeof servicesFromEvent === "string") {
        setServices(servicesFromEvent.split(",").map((item) => item?.trim()));
      } else if (Array.isArray(servicesFromEvent)) {
        setServices(servicesFromEvent);
      } else {
        setServices([]);
      }
      setExpenses({
        equipment: event?.expenses?.equipment || 0,
        car: event?.expenses?.car || 0,
        food: event?.expenses?.food || 0,
        other: event?.expenses?.other || [],
      });
      setIsPublic(event?.isPublic || false);
      setIsConfirmed(event?.isConfirmed || false);
      setIsFullyPaid(event?.isFullyPaid || false);
    }
  }, [event]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title) {
      setError("Title is required");
      return;
    }

    if (!startDateTime) {
      setError("Start date and time is required");
      return;
    }

    if (!endDateTime) {
      setError("End date and time is required");
      return;
    }

    if (!location) {
      setError("Location is required");
      return;
    }

    if (!address) {
      setError("Address is required");
      return;
    }

    if (!clientName) {
      setError("Client name is required");
      return;
    }

    if (!clientEmail) {
      setError("Client email is required");
      return;
    }

    if (!phoneNumber) {
      setError("Phone number is required");
      return;
    }

    if (services.length === 0) {
      setError("At least one service is required");
      return;
    }

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

    let uniqueServices = [...new Set(services)];

    if (
      uniqueServices.includes("Logistics") &&
      uniqueServices.includes(
        "Setting of the above equipment at the event venue"
      )
    ) {
      uniqueServices = uniqueServices.filter(
        (service) =>
          service !== "Logistics" &&
          service !== "Setting of the above equipment at the event venue"
      );
      uniqueServices.push("Logistics and Setting of the above equipment");
    }

    const customizedServices = uniqueServices.map((service) => {
      if (service === "DJing Services" && (djingHours || djingMinutes)) {
        return `DJing Services for ${djingHours} hours${
          djingMinutes ? " " + djingMinutes + " minutes" : ""
        }`;
      } else if (
        service === "Support DJing Services" &&
        (djingHours || djingMinutes)
      ) {
        return `Program Support DJing Services for ${supportDjingHours} hours${
          supportDjingMinutes ? " " + supportDjingMinutes + " minutes" : ""
        }`;
      } else if (service === "Sound System") {
        const { venueType, guestCount, withStands } = soundSystemDetails;
        return `the PA sound system ${
          withStands ? "with stands" : ""
        } for at least ${guestCount} guests ${venueType?.toLowerCase()}`;
      } else if (service === " wireless mics" && customMicCount) {
        return `${customMicCount} wireless mics`;
      } else if (service === " channel mixer" && customMixerCount) {
        return `${customMixerCount} channel mixer`;
      }

      return service;
    });

    let eventId;
    if (event && (event?.id || event?._id)) {
      eventId = event?.id || event?._id;
    }

    // Format the date and time for the Vancouver timezone
    const formattedStartDateTime = startDateTime.tz("America/Vancouver");
    const formattedEndDateTime = endDateTime.tz("America/Vancouver");

    // If end time is earlier than start time, it means the event ends the next day
    let adjustedEndDateTime = formattedEndDateTime;
    if (formattedEndDateTime.isBefore(formattedStartDateTime)) {
      adjustedEndDateTime = formattedEndDateTime.add(1, "day");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("notes", notes);
    formData.append("startDateTime", formattedStartDateTime.toISOString());
    formData.append("endDateTime", adjustedEndDateTime.toISOString());
    formData.append("location", location);
    formData.append("address", address);
    if (imageFile) formData.append("image", imageFile);
    formData.append("ticketUrl", ticketUrl);
    formData.append("clientName", clientName);
    formData.append("clientCompanyName", clientCompanyName);
    formData.append("clientEmail", clientEmail);
    formData.append("phoneNumber", phoneNumber);
    customizedServices.forEach((service) => {
      formData.append("services", service);
    });
    formData.append("totalSum", totalSum);
    formData.append("depositSum", depositSum);
    formData.append("expenses", JSON.stringify(expenses));

    // Add boolean fields
    formData.append("isPublic", isPublic);
    formData.append("isConfirmed", isConfirmed);
    formData.append("isFullyPaid", isFullyPaid);

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
        setNotes("");
        setStartDateTime(null);
        setEndDateTime(null);
        setLocation("");
        setAddress("");
        setClientName("");
        setClientCompanyName("");
        setClientEmail("");
        setPhoneNumber("");
        setServices([]);
        setTotalSum(0);
        setDepositSum(0);
        setDjingHours("");
        setDjingMinutes("");
        setSupportDjingHours("");
        setSupportDjingMinutes("");
        setCustomMicCount("");
        setCustomMixerCount("");
        setSoundSystemDetails({
          venueType: "",
          guestCount: "",
          withStands: false,
        });
        setImageFile(null);
        setTicketUrl("");
        setExpenses({
          equipment: 0,
          car: 0,
          food: 0,
          other: [],
        });
        setOtherDescription("");
        setOtherAmount(0);
        setIsPublic(false);
        setIsConfirmed(false);
        setIsFullyPaid(false);
        onAddSuccess();
        refetchEvents();
      }
    } catch (err) {
      setError(
        err?.data?.msg || err?.error?.data?.msg || "Something went wrong"
      );
    }
  };

  // Add this new function to handle start date/time changes
  const handleStartDateTimeChange = (newValue) => {
    setStartDateTime(newValue);

    // If we have a valid start date/time, auto-set the end date/time to 2 hours later
    if (newValue) {
      const newEndDateTime = newValue.add(2, "hour");
      setEndDateTime(newEndDateTime);

      // Auto-calculate DJing hours and minutes if DJing Services is selected
      if (services.includes("DJing Services")) {
        calculateDjingTime(newValue, newEndDateTime);
      }
    }
  };

  // Add this new function to handle end date/time changes
  const handleEndDateTimeChange = (newValue) => {
    setEndDateTime(newValue);

    // Auto-calculate DJing hours and minutes if DJing Services is selected
    if (services.includes("DJing Services") && startDateTime) {
      calculateDjingTime(startDateTime, newValue);
    }
  };

  // Add this new function to calculate DJing time based on start and end times
  const calculateDjingTime = (start, end) => {
    if (!start || !end) return;

    // Calculate the difference in minutes
    let diffMinutes = end.diff(start, "minute");

    // Handle case where end time is on the next day
    if (diffMinutes < 0) {
      diffMinutes += 24 * 60; // Add 24 hours worth of minutes
    }

    // Convert to hours and minutes
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    setDjingHours(hours.toString());
    setDjingMinutes(minutes.toString());
  };

  // Add this new function to handle service selection changes
  const handleServicesChange = (event, newValue) => {
    setServices(newValue);

    // If DJing Services is selected and we have both start and end times, calculate DJing time
    if (newValue.includes("DJing Services") && startDateTime && endDateTime) {
      calculateDjingTime(startDateTime, endDateTime);
    }
  };

  const handleAddOtherExpense = () => {
    if (otherDescription && otherAmount > 0) {
      setExpenses((prev) => ({
        ...prev,
        other: [
          ...(prev.other || []),
          { description: otherDescription, amount: Number(otherAmount) },
        ],
      }));
      setOtherDescription("");
      setOtherAmount(0);
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
          multiline
          rows={6}
          margin="normal"
        />
        <TextField
          label="Notes"
          variant="outlined"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          fullWidth
          multiline
          rows={10}
          margin="normal"
          helperText="Add any additional notes about equipment, playlist links, special requirements, etc. Line breaks and formatting will be preserved."
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DateTimePicker"]}>
            <DateTimePicker
              label="Start Date and Time"
              value={startDateTime}
              onChange={handleStartDateTimeChange}
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="normal" required />
              )}
              timezone="America/Vancouver"
            />
          </DemoContainer>
          <DemoContainer components={["DateTimePicker"]}>
            <DateTimePicker
              label="End Date and Time"
              value={endDateTime}
              onChange={handleEndDateTimeChange}
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="normal" required />
              )}
              timezone="America/Vancouver"
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
          label="Client Company Name"
          value={clientCompanyName}
          onChange={(e) => setClientCompanyName(e.target.value)}
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
        <Autocomplete
          multiple
          freeSolo
          value={services}
          onChange={handleServicesChange}
          options={serviceOptions}
          renderInput={(params) => (
            <TextField {...params} label="Services" margin="normal" />
          )}
        />
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        >
          <TextField
            label="Add Custom Service"
            value={customService}
            onChange={(e) => setCustomService(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: "16px", height: "56px" }}
            onClick={() => {
              if (customService.trim()) {
                setServices([...services, customService.trim()]);
                setCustomService("");
              }
            }}
          >
            Add Custom
          </Button>
        </div>
        {services?.includes(" wireless mics") && (
          <TextField
            label="Number of Wireless Mics"
            type="number"
            value={customMicCount}
            onChange={(e) => setCustomMicCount(e.target.value)}
            fullWidth
            margin="normal"
          />
        )}

        {services?.includes(" channel mixer") && (
          <TextField
            label="Number of Channels for Mixer"
            type="number"
            value={customMixerCount}
            onChange={(e) => setCustomMixerCount(e.target.value)}
            fullWidth
            margin="normal"
          />
        )}
        {services?.includes("DJing Services") && (
          <>
            <TextField
              label="DJing Hours"
              type="number"
              value={djingHours}
              onChange={(e) => setDjingHours(e.target.value)}
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">hours</InputAdornment>
                ),
              }}
            />
            <TextField
              label="DJing Minutes"
              type="number"
              value={djingMinutes}
              onChange={(e) => setDjingMinutes(e.target.value)}
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">minutes</InputAdornment>
                ),
              }}
            />
          </>
        )}
        {services?.includes("Support DJing Services") && (
          <>
            <TextField
              label="Support DJing Hours"
              type="number"
              value={supportDjingHours}
              onChange={(e) => setSupportDjingHours(e.target.value)}
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">hours</InputAdornment>
                ),
              }}
            />
            <TextField
              label="Support DJing Minutes"
              type="number"
              value={supportDjingMinutes}
              onChange={(e) => setSupportDjingMinutes(e.target.value)}
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">minutes</InputAdornment>
                ),
              }}
            />
          </>
        )}
        {services?.includes("Sound System") && (
          <>
            <FormControl fullWidth margin="normal">
              <InputLabel>Venue Type</InputLabel>
              <Select
                value={soundSystemDetails.venueType}
                onChange={(e) =>
                  setSoundSystemDetails({
                    ...soundSystemDetails,
                    venueType: e.target.value,
                  })
                }
              >
                <MenuItem value="Indoor">Indoor</MenuItem>
                <MenuItem value="Outdoor">Outdoor</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Guest Count"
              type="number"
              value={soundSystemDetails.guestCount}
              onChange={(e) =>
                setSoundSystemDetails({
                  ...soundSystemDetails,
                  guestCount: e.target.value,
                })
              }
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>With Stands</InputLabel>
              <Select
                value={soundSystemDetails.withStands ? "Yes" : "No"}
                onChange={(e) =>
                  setSoundSystemDetails({
                    ...soundSystemDetails,
                    withStands: e.target.value === "Yes",
                  })
                }
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </FormControl>
          </>
        )}
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

        {/* Boolean Toggle Section */}
        <Box sx={{ mt: 3, mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Event Status
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  color="primary"
                />
              }
              label="Public Event (visible to clients)"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={isConfirmed}
                  onChange={(e) => setIsConfirmed(e.target.checked)}
                  color="warning"
                />
              }
              label="Confirmed (deposit received)"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={isFullyPaid}
                  onChange={(e) => setIsFullyPaid(e.target.checked)}
                  color="success"
                />
              }
              label="Fully Paid (final payment received)"
            />
          </Box>
        </Box>

        {/* Expenses Section */}
        <div style={{ margin: "24px 0 8px 0" }}>
          <strong>Expenses (for admin/tax):</strong>
          {(() => {
            const total =
              (Number(expenses.equipment) || 0) +
              (Number(expenses.car) || 0) +
              (Number(expenses.food) || 0) +
              (Array.isArray(expenses.other)
                ? expenses.other.reduce(
                    (sum, o) => sum + (Number(o.amount) || 0),
                    0
                  )
                : 0);
            return (
              <span style={{ marginLeft: 8 }}>
                ${total.toFixed(2).replace(/\.00$/, "")}
              </span>
            );
          })()}
        </div>
        <TextField
          label="Equipment Expense"
          type="number"
          value={expenses.equipment}
          onChange={(e) =>
            setExpenses((prev) => ({
              ...prev,
              equipment: Number(e.target.value),
            }))
          }
          fullWidth
          margin="normal"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
        <TextField
          label="Car/Rental Car Expense"
          type="number"
          value={expenses.car}
          onChange={(e) =>
            setExpenses((prev) => ({ ...prev, car: Number(e.target.value) }))
          }
          fullWidth
          margin="normal"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
        <TextField
          label="Food/Lunch Expense"
          type="number"
          value={expenses.food}
          onChange={(e) =>
            setExpenses((prev) => ({ ...prev, food: Number(e.target.value) }))
          }
          fullWidth
          margin="normal"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <TextField
            label="Other Expense Description"
            value={otherDescription}
            onChange={(e) => setOtherDescription(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Amount"
            type="number"
            value={otherAmount}
            onChange={(e) => setOtherAmount(e.target.value)}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            style={{ width: 120 }}
          />
          <Button
            variant="outlined"
            onClick={handleAddOtherExpense}
            style={{ height: 56, marginTop: 16 }}
          >
            Add
          </Button>
        </div>
        {expenses.other && expenses.other.length > 0 && (
          <div style={{ marginBottom: 8 }}>
            <strong>Other Expenses:</strong>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {expenses.other.map((item, idx) => (
                <li key={idx}>
                  {item.description}: ${item.amount}
                </li>
              ))}
            </ul>
          </div>
        )}
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
