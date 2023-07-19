import React, { useState } from 'react';
import { Button, TextField, Box, Grid, Select, MenuItem, InputLabel, FormControl, createTheme, ThemeProvider, Snackbar, Alert } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import emailjs from 'emailjs-com';

const theme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#857f7b',
          color: '#fff', // Add this line to change the color of the text fields and inputs
          '&:hover': {
            backgroundColor: '#827165',
          },
          '&.Mui-focused': {
            backgroundColor: '#827165',
          },
        },
      },
    },
    MuiInputLabel: { // Add these lines to change the color of labels
      styleOverrides: {
        root: {
          color: '#fff',
        },
      },
    },
    MuiFormLabel: { // Add these lines to change the color of placeholder texts
      styleOverrides: {
        root: {
          color: '#fff',
        },
      },
    },
  },
});

const Form = () => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    message: '',
    eventType: '',
    date: null
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const eventTypeOptions = ['club-event', 'festival-event', 'private-event', 'other'];

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

  const handleSubmit = (event) => {
    event.preventDefault();
  
    // Format Date as "yyyy-mm-dd" before sending.
    const sendData = {
      ...values,
      date: values.date ? `${values.date.getFullYear()}-${values.date.getMonth() + 1}-${values.date.getDate()}` : null,
    };
  
    emailjs.send('service_djsrise', 'template_h6zomxp', sendData, 'STKSIZpBi2ogaeC30')
      .then((response) => {
        setSuccessMessage('Email successfully sent!');
        setValues({
          name: '',
          email: '',
          message: '',
          eventType: '',
          date: null
        }); // clear form fields
        console.log('SUCCESS!', response.status, response.text);
      }, (err) => {
        setErrorMessage('Failed to send email.');
        console.log('FAILED...', err);
      });
  };
  
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSuccessMessage('');
    setErrorMessage('');
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Name"
                variant="outlined"
                fullWidth
                value={values.name}
                onChange={handleChange}
                sx={{ backgroundColor: '#857f7b', '&:hover': { backgroundColor: '#827165' }}}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="email"
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                value={values.email}
                onChange={handleChange}
                sx={{ backgroundColor: '#857f7b', '&:hover': { backgroundColor: '#827165' }}}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" sx={{ backgroundColor: '#857f7b', '&:hover': { backgroundColor: '#827165' }}}>
                <InputLabel id="event-type-label">Event Type</InputLabel>
                <Select
                  labelId="event-type-label"
                  id="event-type"
                  name="eventType"
                  value={values.eventType}
                  onChange={handleSelectChange}
                  label="Event Type"
                  sx={{ backgroundColor: '#857f7b', '&:hover': { backgroundColor: '#827165' }}}
                >
                  {eventTypeOptions.map((option, index) => (
                    <MenuItem key={index} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                sx={{ width: '100%'}}
                label="Event Date"
                inputFormat="MM/dd/yyyy"
                value={values.date}
                onChange={handleDateChange}
                TextField={(params) => <TextField {...params} fullWidth variant="outlined" sx={{ backgroundColor: '#827165', '&:hover': { backgroundColor: '#827165' }}} />}
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
                value={values.message}
                onChange={handleChange}
                placeholder={values.eventType === 'other' ? "Describe here your event, please" : ""}
                sx={{ backgroundColor: '#827165', '&:hover': { backgroundColor: '#827165' }}}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ backgroundColor: '#9c490e', '&:hover': { backgroundColor: '#cc6f2d' }}}
                >
                Submit
              </Button>
            </Grid>
          </Grid>
          <Snackbar open={Boolean(successMessage)} autoHideDuration={6000} onClose={handleCloseSnackbar}>
            <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
              {successMessage}
            </Alert>
          </Snackbar>
          <Snackbar open={Boolean(errorMessage)} autoHideDuration={6000} onClose={handleCloseSnackbar}>
            <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
              {errorMessage}
            </Alert>
          </Snackbar>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default Form;
