import React from "react";
import { Container, Typography, Box } from "@mui/material";
import { gradient } from "./helpers/utils";
import logo from "../assets/icons/garder-table-setup.JPG";
import HeaderSection from "./helpers/HeaderSection";
import useMediaQuery from "@mui/material/useMediaQuery";
import CalendarView from "./helpers/CalendarView";

function CalendarPage() {
  const isDesktop = useMediaQuery("(min-width:900px)");

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
        <HeaderSection
          mainTitle="DJ RISE"
          subTitle="CALENDAR"
          logo={logo}
          avatarAlt="DJ RISE"
        />
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
            {isDesktop ? (
              <CalendarView
                viewMode="month"
                allowedViews={["month", "agenda"]}
              />
            ) : (
              <CalendarView viewMode="agenda" allowedViews={["agenda"]} />
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default CalendarPage;
