import React from "react";
import { Box, Grid, Typography, CardMedia } from "@mui/material";
import { Movie } from "@mui/icons-material";

const SquareGalleryView = ({
  getAlternatedMedia,
  handlePopupOpen,
  stopVideo,
}) => {
  return (
    <Grid container spacing={2} sx={{ maxWidth: "1200px", px: 2, mt: 4 }}>
      {getAlternatedMedia.map((item, index) => (
        <Grid item xs={6} sm={4} md={3} key={item._id}>
          <Box
            onClick={() => {
              stopVideo();
              handlePopupOpen(item);
            }}
            sx={{
              position: "relative",
              width: "100%",
              paddingTop: "100%",
              cursor: "pointer",
              borderRadius: "8px",
              overflow: "hidden",
              backgroundColor: "#000",
              "&:hover": {
                "& .media-overlay": {
                  opacity: 1,
                },
                "& .media-content": {
                  transform: "scale(1.05)",
                },
              },
            }}
          >
            {item.type === "video" ? (
              <>
                <Box
                  component="video"
                  src={item.url}
                  muted
                  playsInline
                  preload="metadata"
                  poster={item.thumbnailUrl}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.3s ease",
                  }}
                  className="media-content"
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "white",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    borderRadius: "50%",
                    padding: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Movie sx={{ fontSize: "2rem" }} />
                </Box>
              </>
            ) : (
              <Box
                component="img"
                src={item.url}
                alt={item.originalName}
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.3s ease",
                }}
                className="media-content"
              />
            )}
            <Box
              className="media-overlay"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                opacity: 0,
                transition: "opacity 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: "white",
                  textAlign: "center",
                  padding: "8px",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  borderRadius: "4px",
                }}
              >
                {item.type === "video" ? "Play Video" : "View Image"}
              </Typography>
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default SquareGalleryView;
