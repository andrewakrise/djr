import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Alert,
  FormControlLabel,
  Checkbox,
  TextField,
} from "@mui/material";

function ClientEmailDialog({
  open,
  onClose,
  onSendEmail,
  event,
  sendEventEmail,
}) {
  const [includeInvoice, setIncludeInvoice] = useState(false);
  const [includeDeposit, setIncludeDeposit] = useState(false);
  const [customBodyText, setCustomBodyText] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSendEmail = async () => {
    if (!event?.clientEmail) {
      setError("Client email is missing");
      return;
    }
    try {
      const result = await sendEventEmail({
        clientEmail: event?.clientEmail,
        clientName: event?.clientName,
        includeInvoice,
        includeDeposit,
        customBodyText,
        eventId: event?.id,
      });

      if (result?.data?.msg) {
        setSuccess(result.data?.msg);
        setTimeout(() => {
          onClose();
          setSuccess("");
        }, 3000);
      }
    } catch (err) {
      setError(`Server error: ${err?.data?.msg || "Unknown error"}`);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Send Email to Client</DialogTitle>
      <DialogContent>
        <FormControlLabel
          control={
            <Checkbox
              checked={includeInvoice}
              onChange={(e) => setIncludeInvoice(e.target.checked)}
            />
          }
          label="Include Invoice"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={includeDeposit}
              onChange={(e) => setIncludeDeposit(e.target.checked)}
            />
          }
          label="Include Deposit"
        />
        <TextField
          label="Custom Body Text"
          multiline
          rows={4}
          value={customBodyText}
          onChange={(e) => setCustomBodyText(e.target.value)}
          fullWidth
          margin="normal"
        />
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSendEmail} variant="contained" color="primary">
          Send Email
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ClientEmailDialog;
