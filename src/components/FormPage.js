import React, { useState } from "react";
import {
  Button,
  TextField,
  Box,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  createTheme,
  ThemeProvider,
  Snackbar,
  Alert,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import { useSendBookEventEmailMutation } from "../services/emails";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { gradient } from "./helpers/utils";
import { useNotification } from "../context/NotificationContext";
import {
  isNotEmpty,
  isValidEmail,
  isValidFutureDate,
  meetsMinLength,
} from "../utils/validation";

const theme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          width: "100%",
          background: "linear-gradient(-45deg, #44A08D, #093637)",
          backgroundSize: "400% 400%",
          animation: `${gradient} 10s ease infinite`,
          color: "#fff",
          "&:hover": {
            background: "linear-gradient(-45deg, #44A08D, #093637)",
            backgroundSize: "400% 400%",
            animation: `${gradient} 10s ease infinite`,
          },
          "&.Mui-focused": {
            background: "linear-gradient(-45deg, #44A08D, #093637)",
            backgroundSize: "400% 400%",
            animation: `${gradient} 10s ease infinite`,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#fff",
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: "#fff",
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: "#f44336",
          margin: "3px 14px 0",
        },
      },
    },
  },
});

const Form = () => {
  const { showNotification } = useNotification();

  const [values, setValues] = useState({
    name: "",
    email: "",
    message: "",
    eventType: "",
    date: null,
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
    eventType: "",
    date: "",
  });

  const [touchedFields, setTouchedFields] = useState({
    name: false,
    email: false,
    message: false,
    eventType: false,
    date: false,
  });

  const [sendEventBookingEmail, { isLoading }] =
    useSendBookEventEmailMutation();

  const eventTypeOptions = [
    "club-event",
    "festival-event",
    "private-event",
    "other",
  ];

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        return isNotEmpty(value) ? "" : "Name is required";
      case "email":
        return isValidEmail(value) ? "" : "Please enter a valid email address";
      case "message":
        return meetsMinLength(value, 10)
          ? ""
          : "Message should be at least 10 characters";
      case "eventType":
        return isNotEmpty(value) ? "" : "Please select an event type";
      case "date":
        return isValidFutureDate(value) ? "" : "Please select a future date";
      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: validateField("name", values.name),
      email: validateField("email", values.email),
      message: validateField("message", values.message),
      eventType: validateField("eventType", values.eventType),
      date: validateField("date", values.date),
    };

    setErrors(newErrors);

    // Mark all fields as touched
    setTouchedFields({
      name: true,
      email: true,
      message: true,
      eventType: true,
      date: true,
    });

    // Return true if no errors, false otherwise
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues({
      ...values,
      [name]: value,
    });

    // Validate field when the user types
    if (touchedFields[name]) {
      setErrors({
        ...errors,
        [name]: validateField(name, value),
      });
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;

    // Mark field as touched when focusing out
    setTouchedFields({
      ...touchedFields,
      [name]: true,
    });

    // Validate field on blur
    setErrors({
      ...errors,
      [name]: validateField(name, value),
    });
  };

  const handleSelectChange = (event) => {
    const { value } = event.target;

    setValues({
      ...values,
      eventType: value,
    });

    // Validate field when the user selects
    if (touchedFields.eventType) {
      setErrors({
        ...errors,
        eventType: validateField("eventType", value),
      });
    }
  };

  const handleDateChange = (newValue) => {
    setValues({
      ...values,
      date: newValue,
    });

    // Validate field when the user selects a date
    if (touchedFields.date) {
      setErrors({
        ...errors,
        date: validateField("date", newValue),
      });
    }
  };

  const handleDateBlur = () => {
    // Mark field as touched when focusing out
    setTouchedFields({
      ...touchedFields,
      date: true,
    });

    // Validate field on blur
    setErrors({
      ...errors,
      date: validateField("date", values.date),
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate all fields before submission
    const isValid = validateForm();

    if (!isValid) {
      showNotification("Please fix the errors in the form", "error");
      return;
    }

    const sendData = {
      ...values,
      date: values.date
        ? `${values.date.getFullYear()}-${
            values.date.getMonth() + 1
          }-${values.date.getDate()}`
        : null,
    };

    try {
      const result = await sendEventBookingEmail({ sendData });

      if (result?.data) {
        showNotification("Email successfully sent!", "success");
        // Reset form after successful submission
        setValues({
          name: "",
          email: "",
          message: "",
          eventType: "",
          date: null,
        });
        // Reset touched fields
        setTouchedFields({
          name: false,
          email: false,
          message: false,
          eventType: false,
          date: false,
        });
      } else {
        const errorMessage = result?.error?.data?.msg || "Error sending email";
        showNotification(errorMessage, "error");
        console.log(result?.error);
      }
    } catch (error) {
      showNotification("An unexpected error occurred", "error");
      console.error(error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Name"
                variant="outlined"
                fullWidth
                required
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touchedFields.name && !!errors.name}
                helperText={touchedFields.name && errors.name}
                sx={{
                  backgroundColor: "#857f7b",
                  "&:hover": { backgroundColor: "#827165" },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                required
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touchedFields.email && !!errors.email}
                helperText={touchedFields.email && errors.email}
                sx={{
                  backgroundColor: "#857f7b",
                  "&:hover": { backgroundColor: "#827165" },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl
                fullWidth
                variant="outlined"
                error={touchedFields.eventType && !!errors.eventType}
                sx={{
                  backgroundColor: "#857f7b",
                  "&:hover": { backgroundColor: "#827165" },
                }}
              >
                <InputLabel id="event-type-label">Event Type</InputLabel>
                <Select
                  labelId="event-type-label"
                  id="event-type"
                  name="eventType"
                  required
                  value={values.eventType}
                  onChange={handleSelectChange}
                  onBlur={handleBlur}
                  label="Event Type"
                  sx={{
                    backgroundColor: "#857f7b",
                    "&:hover": { backgroundColor: "#827165" },
                  }}
                >
                  {eventTypeOptions.map((option, index) => (
                    <MenuItem key={index} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
                {touchedFields.eventType && errors.eventType && (
                  <FormHelperText>{errors.eventType}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <DatePicker
                sx={{ width: "100%" }}
                label="Event Date"
                inputFormat="MM/dd/yyyy"
                value={values.date}
                required
                onChange={handleDateChange}
                onClose={handleDateBlur}
                slotProps={{
                  textField: {
                    variant: "outlined",
                    fullWidth: true,
                    required: true,
                    error: touchedFields.date && !!errors.date,
                    helperText: touchedFields.date && errors.date,
                    sx: {
                      backgroundColor: "#827165",
                      "&:hover": { backgroundColor: "#827165" },
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="message"
                label="Message"
                multiline
                rows={5}
                variant="outlined"
                fullWidth
                required
                value={values.message}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touchedFields.message && !!errors.message}
                helperText={touchedFields.message && errors.message}
                placeholder={
                  values.eventType === "other"
                    ? "Describe here your event and add specific information, please"
                    : ""
                }
                sx={{
                  backgroundColor: "#827165",
                  "&:hover": { backgroundColor: "#827165" },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#9c490e",
                  "&:hover": { backgroundColor: "#cc6f2d" },
                }}
                disabled={isLoading}
                startIcon={isLoading && <CircularProgress size={24} />}
              >
                {isLoading ? "Sending" : "Send"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default React.memo(Form);
