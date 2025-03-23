import React, { createContext, useContext, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

// Create context
const NotificationContext = createContext();

// Custom hook to use the notification context
export const useNotification = () => useContext(NotificationContext);

// Provider component
export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info", // 'error', 'warning', 'info', 'success'
  });

  const showNotification = (message, severity = "info") => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const hideNotification = () => {
    setNotification({
      ...notification,
      open: false,
    });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    hideNotification();
  };

  return (
    <NotificationContext.Provider
      value={{ showNotification, hideNotification }}
    >
      {children}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={notification.severity}
          elevation={6}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
