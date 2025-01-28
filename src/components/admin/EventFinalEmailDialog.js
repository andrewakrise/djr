import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Box,
  Typography,
} from "@mui/material";
import { useSendFinalBillEmailMutation } from "../../services/event";

function EventFinalEmailDialog({ open, onClose, event }) {
  const [customNote, setCustomNote] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSending, setIsSending] = useState(false);

  const [sendFinalBillEmail] = useSendFinalBillEmailMutation();

  const handleCloseDialog = () => {
    setError("");
    setSuccess("");
    setCustomNote("");
    onClose();
  };

  const handleSendEmail = async () => {
    if (!event) {
      setError("No event selected.");
      return;
    }

    setIsSending(true);
    setError("");
    setSuccess("");

    try {
      const result = await sendFinalBillEmail({
        eventId: event.id,
        customNote,
      }).unwrap();

      setSuccess(result.msg || "Email sent successfully!");

      setTimeout(() => {
        handleCloseDialog();
      }, 1500);
    } catch (err) {
      setError(
        err?.data?.msg ||
          err?.message ||
          "An error occurred while sending the final bill email."
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
      <DialogTitle>Send Final Payment Email</DialogTitle>
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Typography variant="body1" sx={{ mb: 2 }}>
          To: <strong>{event?.clientEmail || "No Email"}</strong>
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Add a short note (optional)"
            multiline
            rows={5}
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCloseDialog} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleSendEmail}
          color="primary"
          disabled={!event?.clientEmail || isSending}
        >
          {isSending ? <CircularProgress size={24} /> : "Send Email"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EventFinalEmailDialog;
