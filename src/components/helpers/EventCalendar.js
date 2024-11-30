// src/components/helpers/EventCalendar.js
import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useGetAllEventsQuery } from "../../services/event";
import { Event } from "@mui/icons-material";
import EventModal from "./EventModal";

const EventCalendar = () => {
  const { data: events, isLoading, isError, error } = useGetAllEventsQuery();

  const [openModal, setOpenModal] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState(null);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedEvent(null);
  };

  const getFilteredEvents = (events) => {
    if (!events) return [];

    const now = new Date();

    const futureEvents = events?.filter(
      (event) => new Date(event?.date) >= now
    );
    const pastEvents = events?.filter((event) => new Date(event?.date) < now);

    futureEvents?.sort((a, b) => new Date(a?.date) - new Date(b?.date));

    pastEvents?.sort((a, b) => new Date(b?.date) - new Date(a?.date));

    const combinedEvents = [...futureEvents, ...pastEvents];

    if (combinedEvents?.length >= 7) {
      return combinedEvents?.slice(0, 7);
    } else if (combinedEvents?.length >= 5) {
      return combinedEvents;
    } else {
      return combinedEvents;
    }
  };

  const filteredEvents = getFilteredEvents(events);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography color="error" sx={{ mt: 4 }}>
        Error: {error?.data?.msg || "Failed to load events."}
      </Typography>
    );
  }
  // console.log("filteredEvents", filteredEvents);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        maxWidth: "33rem",
        p: 2,
        backgroundColor: "rgba(9, 54, 55, 0.5)",
        borderRadius: "0.5rem",
        boxShadow: 3,
      }}
    >
      <List>
        {filteredEvents?.map((event) => {
          const eventDate = new Date(event?.date);
          const formattedDate = eventDate?.toLocaleDateString("en-CA", {
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "America/Vancouver",
          });
          const isFuture = eventDate >= new Date();

          return (
            <React.Fragment key={event?._id}>
              <ListItem
                alignItems="flex-start"
                button
                onClick={() => handleEventClick(event)}
                sx={{
                  backgroundColor: isFuture
                    ? "rgba(68, 160, 141, 0.75)"
                    : "rgba(130, 192, 204, 0.75)",
                  borderRadius: "0.25rem",
                  mb: 1,
                  "&:hover": {
                    backgroundColor: isFuture
                      ? "rgba(61, 165, 140, 0.85)"
                      : "rgba(122, 181, 187, 0.85)",
                  },
                }}
              >
                <ListItemAvatar>
                  {event?.image?.url ? (
                    <Avatar
                      alt={event?.title}
                      src={event?.image?.url}
                      sx={{
                        width: 56,
                        height: 56,
                        border: "1px solid #093637",
                        borderRadius: 0,
                        mr: 2,
                      }}
                    />
                  ) : (
                    <Avatar
                      sx={{
                        bgcolor: "#fff",
                        color: isFuture ? "#093637" : "#093637",
                        mr: 2,
                      }}
                    >
                      <Event />
                    </Avatar>
                  )}
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="h6" sx={{ color: "#093637" }}>
                      {event?.title}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" sx={{ color: "#093637" }}>
                      {formattedDate}
                    </Typography>
                  }
                />
              </ListItem>
            </React.Fragment>
          );
        })}
      </List>
      <EventModal
        open={openModal}
        onClose={handleCloseModal}
        event={selectedEvent}
      />
    </Box>
  );
};

export default EventCalendar;
