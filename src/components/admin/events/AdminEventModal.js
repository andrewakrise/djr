// src/components/helpers/AdminEventModal.js
import React from "react";
import {
  Box,
  Typography,
  Modal,
  Button,
  IconButton,
  Divider,
} from "@mui/material";
import { Cancel } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { gradient } from "../../helpers/utils";

const StyledModalBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 600,
  maxHeight: "90vh",
  background: "linear-gradient(-45deg, #43C6AC, #191654, #000C40, #41295a)",
  backgroundSize: "400% 400%",
  animation: `${gradient} 10s ease infinite`,
  borderRadius: "8px",
  boxShadow: 24,
  padding: theme.spacing(4),
  color: "white",
  overflowY: "auto",
}));

const AdminEventModal = ({ open, onClose, event }) => {
  if (!event) return null;

  console.log("event", event);
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="event-details-title"
      aria-describedby="event-details-description"
    >
      <StyledModalBox>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            id="event-details-title"
            variant="h5"
            component="h2"
            gutterBottom
          >
            {event?.title}
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              width: "3.5rem",
              height: "3.5rem",
              background: "linear-gradient(-45deg, #44A08D, #093637)",
              backgroundSize: "400% 400%",
              animation: `${gradient} 10s ease infinite`,
              m: 0,
              p: 0,
            }}
          >
            <Cancel />
          </IconButton>
        </Box>

        <Typography
          id="event-details-date"
          variant="body1"
          component="div"
          gutterBottom
        >
          {new Date(event?.date).toLocaleDateString("en-CA", {
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "America/Vancouver",
          })}
        </Typography>

        {event?.imageUrl && (
          <Box sx={{ mb: 2 }}>
            <img
              src={event?.imageUrl}
              alt={`${event?.title} Poster`}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "8px",
              }}
            />
          </Box>
        )}

        <Typography id="event-details-description" sx={{ mt: 2 }}>
          {event?.description}
        </Typography>

        <Divider sx={{ my: 2, borderColor: "#ffffff" }} />

        <Typography variant="body1" gutterBottom>
          <strong>Client Name:</strong> {event?.clientName || "N/A"}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Client Email:</strong> {event?.clientEmail || "N/A"}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Phone Number:</strong> {event?.phoneNumber || "N/A"}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Event Address:</strong> {event?.address || "N/A"}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Location:</strong>{" "}
          {event?.location ? (
            <a
              href={event?.location}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#44A08D" }}
            >
              View on Google Maps
            </a>
          ) : (
            "N/A"
          )}
        </Typography>

        <Divider sx={{ my: 2, borderColor: "#ffffff" }} />

        <Typography variant="body1" gutterBottom>
          <strong>Event Start Time:</strong> {event?.startTime || "N/A"}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Event End Time:</strong> {event?.endTime || "N/A"}
        </Typography>

        <Divider sx={{ my: 2, borderColor: "#ffffff" }} />

        <Typography variant="body1" gutterBottom>
          <strong>Confirmed:</strong> {event?.isConfirmed ? "Is " : "Not "}
          Confirmed
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Fully Paid:</strong> {event?.isFullyPaid ? "Is " : "Not "}
          Fully Paid
        </Typography>

        <Divider sx={{ my: 2, borderColor: "#ffffff" }} />

        <Typography variant="body1" gutterBottom>
          <strong>Services:</strong> {event?.services || "N/A"}
        </Typography>

        <Typography variant="body1" gutterBottom>
          <strong>Total Sum:</strong> ${event?.totalSum || "N/A"}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Deposit Required:</strong> ${event?.depositSum || "N/A"}
        </Typography>

        {event?.isConfirmed && !event?.isFullyPaid && (
          <Typography variant="body1" gutterBottom>
            <strong>Final Payment:</strong> $
            {event?.totalSum - event?.depositSum || "N/A"}
          </Typography>
        )}

        {event?.ticketUrl && (
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="secondary"
              href={event?.ticketUrl}
              target="_blank"
              rel="noopener noreferrer"
              fullWidth
            >
              Get Tickets
            </Button>
          </Box>
        )}

        <Button
          onClick={onClose}
          sx={{
            color: "white",
            mt: 2,
            width: "100%",
            padding: "0.5rem 1.5rem",
            boxSizing: "border-box",
            borderRadius: "0.5rem",
            background: "linear-gradient(-45deg, #44A08D, #093637)",
            backgroundSize: "400% 400%",
            animation: `${gradient} 10s ease infinite`,
          }}
        >
          Close
        </Button>
      </StyledModalBox>
    </Modal>
  );
};

export default AdminEventModal;
