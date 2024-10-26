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
} from "@mui/material";
import { useSendBookEventEmailMutation } from "../../services/emails";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const theme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#857f7b",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#827165",
          },
          "&.Mui-focused": {
            backgroundColor: "#827165",
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
  },
});

const Form = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    message: "",
    eventType: "",
    date: null,
  });
  const [sendEventBookingEmail] = useSendBookEventEmailMutation();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const eventTypeOptions = [
    "club-event",
    "festival-event",
    "private-event",
    "other",
  ];

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleSelectChange = (event) => {
    setValues({
      ...values,
      eventType: event.target.value,
    });
  };

  const handleDateChange = (newValue) => {
    setValues({
      ...values,
      date: newValue,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const sendData = {
      ...values,
      date: values.date
        ? `${values.date.getFullYear()}-${
            values.date.getMonth() + 1
          }-${values.date.getDate()}`
        : null,
    };
    const result = await sendEventBookingEmail({ sendData });
    if (result.data) {
      setSuccessMessage("Email successfully sent!");
      setValues({
        name: "",
        email: "",
        message: "",
        eventType: "",
        date: null,
      });
    } else {
      setSuccessMessage(`Error sending email: ${result?.error?.data?.msg}`);
      console.log(result?.error?.data?.msg);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSuccessMessage("");
    setErrorMessage("");
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Name"
                variant="outlined"
                fullWidth
                required
                value={values.name}
                onChange={handleChange}
                sx={{
                  backgroundColor: "#857f7b",
                  "&:hover": { backgroundColor: "#827165" },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="email"
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                required
                value={values.email}
                onChange={handleChange}
                sx={{
                  backgroundColor: "#857f7b",
                  "&:hover": { backgroundColor: "#827165" },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                variant="outlined"
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
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                sx={{ width: "100%" }}
                label="Event Date"
                inputFormat="MM/dd/yyyy"
                value={values.date}
                onChange={handleDateChange}
                TextField={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    required
                    variant="outlined"
                    sx={{
                      backgroundColor: "#827165",
                      "&:hover": { backgroundColor: "#827165" },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="message"
                label="Message"
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                required
                value={values.message}
                onChange={handleChange}
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
              >
                Submit
              </Button>
            </Grid>
          </Grid>
          <Snackbar
            open={Boolean(successMessage)}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity="success"
              sx={{ width: "100%" }}
            >
              {successMessage}
            </Alert>
          </Snackbar>
          <Snackbar
            open={Boolean(errorMessage)}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity="error"
              sx={{ width: "100%" }}
            >
              {errorMessage}
            </Alert>
          </Snackbar>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default React.memo(Form);
