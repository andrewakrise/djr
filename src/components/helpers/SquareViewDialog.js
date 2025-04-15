import React from "react";
import { Box, Dialog, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

const SquareViewDialog = ({ open, onClose, selectedItem, stopVideo }) => {
  const handleClose = (e) => {
    e.stopPropagation();
    stopVideo();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      onClick={(e) => e.stopPropagation()}
      PaperProps={{
        sx: {
          backgroundColor: "transparent",
          boxShadow: "none",
          overflow: "hidden",
        },
      }}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.9)",
            },
            zIndex: 9999,
            padding: "8px",
            boxShadow: "0px 0px 10px rgba(0,0,0,0.5)",
          }}
          aria-label="close"
          size="large"
        >
          <Close fontSize="medium" />
        </IconButton>
        {selectedItem &&
          (selectedItem.type === "video" ? (
            <Box
              component="video"
              src={selectedItem.url}
              controls
              autoPlay
              onClick={(e) => e.stopPropagation()}
              sx={{
                width: "100%",
                maxHeight: "90vh",
                objectFit: "contain",
                zIndex: 1,
                position: "relative",
              }}
            />
          ) : (
            <Box
              component="img"
              src={selectedItem.url}
              alt={selectedItem.originalName}
              sx={{
                width: "100%",
                maxHeight: "90vh",
                objectFit: "contain",
                zIndex: 1,
                position: "relative",
              }}
            />
          ))}
      </Box>
    </Dialog>
  );
};

export default SquareViewDialog;
