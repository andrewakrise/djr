// src/components/helpers/EventModal.js
import React from "react";
import { Box, Typography, Modal, Button, IconButton } from "@mui/material";
import { Cancel } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { gradient } from "./utils";

const StyledModalBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 500,
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

const EventModal = ({ open, onClose, event }) => {
  if (!event) return;
  // console.log("");

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="event-details-title"
      aria-describedby="event-details-description"
    >
      <StyledModalBox>
        {event && (
          <>
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
            {event.image?.url && event.image?.url && (
              <Box sx={{ mb: 2 }}>
                <img
                  src={event?.image?.url}
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
            {event?.location && (
              <Typography sx={{ mt: 2 }}>
                <strong>Location:</strong>{" "}
                <a
                  href={event?.location}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#44A08D" }}
                >
                  View on Google Maps
                </a>
              </Typography>
            )}
            {event?.ticketUrl && (
              <Button
                variant="contained"
                color="secondary"
                href={event?.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ mt: 3 }}
              >
                Get Tickets
              </Button>
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
          </>
        )}
      </StyledModalBox>
    </Modal>
  );
};

export default EventModal;