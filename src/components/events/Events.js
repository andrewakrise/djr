import React from "react";
import { useGetAllEventsQuery } from "../../services/event";
import EventSlider from "./EventSlider";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function Events({ isPreview = false }) {
  const { data: events, isLoading, isError, error } = useGetAllEventsQuery();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography color="error">
        Error: {error?.data?.message || "Unknown error"}
      </Typography>
    );
  }

  return <EventSlider events={events} isPreview={isPreview} />;
}
