// ./EventConfirmationDialog.js
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

function EventConfirmationDialog({
  open,
  onClose,
  onConfirmEvent,
  event,
  sendConfirmationEmail,
  setSendConfirmationEmail,
  refetch,
  setSuccess,
  setError,
  isConfirmEventFetching,
  confirmMode,
}) {
  const handleConfirm = async () => {
    if (!event?.id) {
      setError("No event selected");
      return;
    }

    try {
      const result = await onConfirmEvent(
        confirmMode === "confirm"
          ? { eventId: event.id, sendEmail: sendConfirmationEmail }
          : { eventId: event.id }
      );
      if (result?.data) {
        setSuccess("Event confirmed successfully.");
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
      <DialogTitle>
        {confirmMode === "confirm" ? "Confirm Event" : "Unconfirm Event"}
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 2 }}>
          {confirmMode === "confirm"
            ? "Are you sure you want to confirm this event?"
            : "Are you sure you want to unconfirm this event?"}
        </Typography>
        {confirmMode === "confirm" && (
          <FormControlLabel
            control={
              <Checkbox
                checked={sendConfirmationEmail}
                onChange={(e) => setSendConfirmationEmail(e.target.checked)}
              />
            }
            label="Send confirmation email to client"
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          color="primary"
          variant="contained"
          onClick={handleConfirm}
          disabled={isConfirmEventFetching}
        >
          {isConfirmEventFetching ? (
            <CircularProgress />
          ) : confirmMode === "confirm" ? (
            "Confirm"
          ) : (
            "UnConfirm"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EventConfirmationDialog;
