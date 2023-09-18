import Events from "./Events";
import { Box, Typography } from "@mui/material";
import eventData from "../assets/eventsData";

function EventThumbnail({ poster, title }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 1,
        borderRadius: "4px",
        overflow: "hidden",
      }}
    >
      <img
        src={poster}
        alt="Event Poster"
        style={{
          width: "100%",
          height: "calc(150px + 15vmin)",
          objectFit: "contain",
        }}
      />
      <Typography
        sx={{
          mt: 1,
          fontSize: "calc(5px + 1vmin)",
          textAlign: "center",
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}

export default function EventPreview({ onClick }) {
  const now = new Date();
  const sortedEvents = [...eventData].sort((a, b) => a.date - b.date);
  const futureEvents = sortedEvents.filter((event) => event.date >= now);
  const closestTwoEvents = futureEvents.slice(0, 2);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        overflowX: "auto",
        gap: "12px",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      {closestTwoEvents.map((event, index) => (
        <EventThumbnail key={index} {...event} />
      ))}
    </Box>
  );
}
