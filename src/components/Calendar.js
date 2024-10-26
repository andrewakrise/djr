import React from "react";
import { Container, Typography, Box, Avatar } from "@mui/material";
import IconLinks from "./helpers/IconLinks";
import BackButton from "./helpers/BackButton";
import { gradient } from "./helpers/utils";
import logo from "../assets/icons/garder-table-setup.JPG";
import EventCalendar from "./helpers/EventCalendar";

function CalendarPage() {
  return (
    <Container
      maxWidth={false}
      sx={{
        textAlign: "center",
        background:
          "linear-gradient(-45deg, #0f2027, #203a43, #2c5364, #1c1c1c)",
        backgroundSize: "400% 400%",
        animation: `${gradient} 10s ease infinite`,
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        padding: "2rem 0 2rem 0",
        fontSize: "calc(0.75rem + 2vmin)",
      }}
    >
      <BackButton />
      <Box
        spacing={2}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          maxWidth: "40rem",
          p: "1rem",
          m: "0",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            mb: 1,
            fontSize: "calc(0.5rem + 1.2vmin)",
            gap: "1rem",
          }}
        >
          <Typography
            sx={{
              fontSize: "calc(2rem + 2vmin)",
              letterSpacing: "0.5rem",
            }}
            variant="h3"
          >
            DJ RISE
          </Typography>
          <Typography
            sx={{
              fontSize: "calc(2rem + 2vmin)",
              letterSpacing: "0.5rem",
            }}
            variant="h3"
          >
            CALENDAR
          </Typography>
        </Box>
        <Avatar
          src={logo}
          sx={{ width: "15rem", height: "15rem", mb: "2rem" }}
          alt="RISE DJ"
        />
        <IconLinks />
        <Box
          sx={{
            width: "100%",
            maxWidth: "50rem",
            mt: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: "calc(1rem + 1vmin)",
              letterSpacing: "0.2rem",
              mb: 2,
            }}
            variant="body1"
          >
            Explore the events below.
          </Typography>
          <Box
            sx={{
              width: "100%",
              mt: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <EventCalendar />
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default CalendarPage;
