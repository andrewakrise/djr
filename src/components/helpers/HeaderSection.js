import React from "react";
import { Box, Typography, Avatar, useMediaQuery } from "@mui/material";
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
}) => {
  const isMobile = useMediaQuery("(max-width:900px)");

  return (
    <Box
      spacing={1}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        maxWidth: "40rem",
        p: "0.5rem",
        m: 0,
        ...sx,
      }}
    >
      {isMobile ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            mb: 0,
          }}
        >
          {/* Left: BackButton or empty space, fixed width */}
          <Box
            sx={{
              width: "3.5rem",
              height: "3.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              m: 0,
              p: 0,
            }}
          >
            {subTitle ? <BackButton /> : null}
          </Box>
          {/* Center: Titles, flex 1, centered */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              px: 1,
              py: 0,
              m: 0,
              width: "100%",
            }}
          >
            <Typography
              sx={{
                fontSize: "1.2rem",
                letterSpacing: "0.2rem",
                fontWeight: 700,
                lineHeight: 1.1,
                textAlign: "center",
              }}
              variant="h3"
            >
              {mainTitle}
            </Typography>
            {subTitle && (
              <Typography
                sx={{
                  fontSize: "1rem",
                  letterSpacing: "0.15rem",
                  fontWeight: 500,
                  lineHeight: 1.1,
                  textAlign: "center",
                }}
                variant="h3"
              >
                {subTitle}
              </Typography>
            )}
          </Box>
          {/* Right: Avatar, fixed width */}
          <Box
            sx={{
              width: "3.5rem",
              height: "3.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Avatar
              src={logo}
              sx={{ width: "3.5rem", height: "3.5rem" }}
              alt={avatarAlt}
            />
          </Box>
        </Box>
      ) : (
        <>
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
            sx={{ width: "15rem", height: "15rem", mb: "1rem" }}
            alt={avatarAlt}
          />
        </>
      )}
      <IconLinks />
    </Box>
  );
};

export default HeaderSection;
