// src/components/helpers/EventModal.js
import React from "react";
import { Box, Typography, Modal, Button, IconButton } from "@mui/material";
import { Cancel } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { gradient } from "./utils";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useGetEventImageUrlQuery } from "../../services/event";
import privateParty2 from "../../assets/private-party-2.png";

// Configure dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);

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
  const { data: imageUrlData } = useGetEventImageUrlQuery(event?._id, {
    skip: !event?._id,
  });
  if (!event) return;
  // console.log("");

  // Format date based on either new or legacy format
  let formattedDate;
  let formattedStartTime;
  let formattedEndTime;

  if (event?.startDateTime) {
    formattedDate = dayjs(event.startDateTime)
      .tz("America/Vancouver")
      .format("MMMM D, YYYY");

    formattedStartTime = dayjs(event.startDateTime)
      .tz("America/Vancouver")
      .format("h:mm A");

    if (event?.endDateTime) {
      formattedEndTime = dayjs(event.endDateTime)
        .tz("America/Vancouver")
        .format("h:mm A");
    }
  } else if (event?.date) {
    formattedDate = dayjs(event.date)
      .tz("America/Vancouver")
      .format("MMMM D, YYYY");

    if (event?.startTime) {
      formattedStartTime = event.startTime;
    }

    if (event?.endTime) {
      formattedEndTime = event.endTime;
    }
  }

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
              <Box>
                <Typography
                  id="event-details-title"
                  variant="h5"
                  component="h2"
                  gutterBottom
                >
                  {event?.title}
                </Typography>
                <Typography
                  id="event-details-title"
                  variant="body1"
                  component="div"
                  gutterBottom
                >
                  {formattedDate}
                </Typography>
                {event?.isPublic &&
                  (formattedStartTime || formattedEndTime) && (
                    <Typography variant="body1" component="div" gutterBottom>
                      {formattedStartTime && `Start: ${formattedStartTime}`}
                      {formattedStartTime && formattedEndTime && " | "}
                      {formattedEndTime && `End: ${formattedEndTime}`}
                    </Typography>
                  )}
              </Box>
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
            {
              <Box sx={{ mb: 2 }}>
                <img
                  src={imageUrlData?.url || privateParty2}
                  alt={`${event?.title} Poster`}
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "8px",
                  }}
                />
              </Box>
            }
            {event?.isPublic && (
              <Typography
                variant="body1"
                id="event-details-description"
                sx={{ whiteSpace: "pre-wrap", mt: 2 }}
              >
                {event?.description}
              </Typography>
            )}
            {event?.location && event?.isPublic && (
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
            {event?.ticketUrl && event?.isPublic && (
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
