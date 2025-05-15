import React from "react";
import { Container, Typography, Box } from "@mui/material";
import { gradient } from "./helpers/utils";
import logo from "../assets/icons/boat-science-world.JPG";
import FormPage from "./FormPage";
import HeaderSection from "./helpers/HeaderSection";

function BookingPage() {
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
          subTitle="BOOKING"
          logo={logo}
          avatarAlt="DJ RISE"
        />
        <Box
          sx={{
            width: "100%",
            maxWidth: "35rem",
            mt: 2,
          }}
        >
          <Box sx={{ mb: 1, fontSize: "calc(0.5rem + 1.2vmin)" }}>
            <Typography
              sx={{
                fontSize: "calc(1rem + 2vmin)",
                letterSpacing: "0.35rem",
                mb: 2,
              }}
              variant="h6"
            >
              DJ BOOKINGS:
            </Typography>
            <Typography
              sx={{
                fontSize: "calc(0.75rem + 1vmin)",
                fontFamily: "Roboto",
                letterSpacing: "0.15rem",
                mt: 2,
              }}
              variant="body"
            >
              andrewrisedj@gmail.com
            </Typography>
          </Box>
        </Box>
        <Box sx={{ width: "100%", maxWidth: "40rem", mt: 5, mx: "auto" }}>
          <Typography
            sx={{
              fontSize: "calc(1rem + 2vmin)",
              letterSpacing: "0.35rem",
              mb: 2,
            }}
            variant="h6"
          >
            or use the Form
          </Typography>
          <Box sx={{ width: "100%", maxWidth: "30rem", mx: "auto" }}>
            <FormPage />
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default BookingPage;
