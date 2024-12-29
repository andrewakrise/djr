// ./EventFinalPaymentDialog.js
import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
  CircularProgress,
} from "@mui/material";

function EventFinalPaymentDialog({
  open,
  onClose,
  onFinalPayment,
  event,
  sendFinalPaymentEmail,
  setSendFinalPaymentEmail,
  refetch,
  setSuccess,
  setError,
  isFinalPaymentFetching,
}) {
  const handleFinalPayment = async () => {
    if (!event?.id) {
      setError("No event selected");
      return;
    }

    try {
      const result = await onFinalPayment({
        eventId: event.id,
        sendEmail: sendFinalPaymentEmail,
      });
      if (result?.data) {
        setSuccess("Final payment received successfully.");
        setTimeout(() => {
          setSuccess("");
          refetch();
        }, 3000);
      }
    } catch (err) {
      setError(`Server error: ${err?.data?.msg || err?.status}`);
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Final Payment</DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 2 }}>
          Are you sure you want to mark the final payment as received?
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={sendFinalPaymentEmail}
              onChange={(e) => setSendFinalPaymentEmail(e.target.checked)}
            />
          }
          label="Send a 'Final Payment Received' email to the client"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          color="primary"
          variant="contained"
          onClick={handleFinalPayment}
          disabled={isFinalPaymentFetching}
        >
          {isFinalPaymentFetching ? <CircularProgress size={20} /> : "Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EventFinalPaymentDialog;
