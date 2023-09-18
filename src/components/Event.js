import { Box, Typography, Link, Button } from "@mui/material";

function Event({ poster, title, description, mapsURL, ticketsURL, listenOn }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        borderRadius: 2,
        padding: 3,
        mb: 4,
      }}
    >
      <img
        src={poster}
        alt="Event Poster"
        style={{ width: "100%", height: "auto", borderRadius: "8px" }}
      />

      <Typography
        variant="h5"
        component="div"
        sx={{ mt: 2, color: "black", fontSize: "calc(8px + 1.2vmin)" }}
      >
        {title}
      </Typography>

      <Typography
        sx={{ mt: 1, mb: 2, color: "black", fontSize: "calc(5px + 1.2vmin)" }}
      >
        {description}
      </Typography>

      {mapsURL.length > 0 && (
        <Link href={mapsURL} target="_blank" rel="noopener noreferrer">
          <Button variant="contained" color="primary">
            View on Google Maps
          </Button>
        </Link>
      )}

      {ticketsURL.length > 0 && (
        <Link
          href={ticketsURL}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ mt: 2 }}
        >
          <Button variant="contained" color="secondary">
            Get Tickets
          </Button>
        </Link>
      )}
      {listenOn.length > 0 && (
        <Link
          href={listenOn}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ mt: 2 }}
        >
          <Button variant="contained" color="secondary">
            To Listen On
          </Button>
        </Link>
      )}
    </Box>
  );
}

export default Event;
