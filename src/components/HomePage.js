import React, { Suspense, lazy } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Avatar,
  Link,
  CircularProgress,
  Divider,
} from "@mui/material";
import { ArrowRightAlt, OpenInNew } from "@mui/icons-material";
import IconLinks from "./helpers/IconLinks";
import { gradient } from "./helpers/utils";

// Lazy load the logo image
const logo = new URL("../assets/icons/Avatar-DJ-vinyl-1.JPG", import.meta.url);

function HomePage() {
  const linkItems = [
    {
      text: "bookings inquiries",
      href: "/booking",
    },
    { text: "gallery / reels / pictures", href: "/gallery" },
    { text: "reviews", href: "/reviews" },
    { text: "upcoming events / calendar", href: "/calendar" },
    { text: "audio & video previews", href: "/audio-video-previews" },
    { text: "instagram.com", href: "https://www.instagram.com/vandjrise" },
    {
      text: "mixcloud.com / dj mixes",
      href: "https://www.mixcloud.com/andrewrisedj",
    },
    {
      text: "vimeo.com videos / dj mixes",
      href: "https://vimeo.com/risedj",
    },
  ];

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
        <Box sx={{ mb: 1, fontSize: "calc(0.5rem + 1.2vmin)" }}>
          <Typography
            sx={{
              fontSize: "calc(2rem + 2vmin)",
              letterSpacing: "0.5rem",
            }}
            variant="h3"
          >
            DJ RISE
          </Typography>
        </Box>
        <Suspense fallback={<CircularProgress />}>
          <Avatar
            src={logo}
            sx={{ width: "15rem", height: "15rem", mb: "2rem" }}
            alt="DJ RISE"
            loading="lazy"
          />
        </Suspense>
        <IconLinks />
        <Box
          sx={{
            width: "100%",
            maxWidth: "35rem",
            mt: 2,
          }}
        >
          {linkItems?.map((item, index) => {
            const isExternal = /^https?:\/\//.test(item?.href);
            const isInstagram = item.text === "instagram.com";

            return (
              <React.Fragment key={index}>
                {isInstagram && (
                  <Divider
                    sx={{
                      my: 1,
                      borderColor: "rgba(255, 255, 255, 0.2)",
                      "&:before, &:after": {
                        borderColor: "rgba(255, 255, 255, 0.2)",
                      },
                    }}
                  />
                )}
                <Link
                  component={isExternal ? "a" : RouterLink}
                  to={isExternal ? undefined : item.href}
                  href={isExternal ? item.href : undefined}
                  underline="none"
                  color="inherit"
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    textDecoration: "none",
                    padding: "1rem",
                    width: "100%",
                    boxSizing: "border-box",
                    borderRadius: "1rem",
                    "&:hover": {
                      background: "linear-gradient(-45deg, #44A08D, #093637)",
                      backgroundSize: "400% 400%",
                      animation: `${gradient} 10s ease infinite`,
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="h6">{item.text}</Typography>
                    {isExternal && (
                      <OpenInNew sx={{ fontSize: "1rem", opacity: 0.7 }} />
                    )}
                  </Box>
                  <ArrowRightAlt />
                </Link>
              </React.Fragment>
            );
          })}
        </Box>
      </Box>
    </Container>
  );
}

export default HomePage;
