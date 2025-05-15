import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import BackButton from "./BackButton";
import IconLinks from "./IconLinks";

/**
 * HeaderSection - Reusable header for public pages
 * Props:
 * - mainTitle: string (required)
 * - subTitle: string (optional)
 * - logo: image import or url (required)
 * - avatarAlt: string (optional)
 * - sx: object (optional, for Box overrides)
 */
const HeaderSection = ({
  mainTitle,
  subTitle,
  logo,
  avatarAlt = "DJ RISE",
  sx = {},
}) => (
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
      m: 0,
      ...sx,
    }}
  >
    {subTitle && <BackButton />}
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        mt: -5,
        mb: 1,
        fontSize: "calc(0.5rem + 1.2vmin)",
        gap: "1rem",
      }}
    >
      <Typography
        sx={{
          fontSize: "calc(2rem + 1vmin)",
          letterSpacing: "0.5rem",
        }}
        variant="h3"
      >
        {mainTitle}
      </Typography>
      {subTitle && (
        <Typography
          sx={{
            fontSize: "calc(1.5rem + 1vmin)",
            letterSpacing: "0.5rem",
          }}
          variant="h3"
        >
          {subTitle}
        </Typography>
      )}
    </Box>
    <Avatar
      src={logo}
      sx={{ width: "15rem", height: "15rem", mb: "2rem" }}
      alt={avatarAlt}
    />
    <IconLinks />
  </Box>
);

export default HeaderSection;
