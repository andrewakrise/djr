import React from "react";
import { useGetAllEventsQuery } from "../../services/event";
import EventThumbnail from "./EventThumbnail";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function EventPreview() {
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

  const previewEvents = events?.slice(0, 2);

  return (
    <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
      {previewEvents?.map((event) => (
        <EventThumbnail key={event?._id} event={event} />
      ))}
    </Box>
  );
}
