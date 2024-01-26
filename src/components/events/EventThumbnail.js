import { Box, Typography } from "@mui/material";

function EventThumbnail({ event }) {
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
        src={event?.image?.url || ""}
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
        {event?.title || ""}
      </Typography>
    </Box>
  );
}

export default EventThumbnail;
