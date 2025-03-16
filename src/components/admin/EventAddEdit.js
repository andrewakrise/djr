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
  Autocomplete,
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
      setDate(event?.date.split("T")[0]);
      setStartTime(event?.startTime ? dayjs(event?.startTime, "HH:mm") : null);
      setEndTime(event?.endTime ? dayjs(event?.endTime, "HH:mm") : null);
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
    }
  }, [event]);
  // console.log("services", services);
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

    let customizedServices = uniqueServices.map((service) => {
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
    formData.append("clientCompanyName", clientCompanyName);
    formData.append("clientEmail", clientEmail);
    formData.append("phoneNumber", phoneNumber);
    customizedServices.forEach((service) => {
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
          multiline
          rows={6}
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
          onChange={(event, newValue) => {
            setServices(newValue);
          }}
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
