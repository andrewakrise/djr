import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, IconButton } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { gradient } from "./utils";

export default function BackButton() {
  const navigate = useNavigate();

  const navBack = () => {
    navigate(-1);
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
        m: 0,
        p: 0,
      }}
    >
      <IconButton
        onClick={navBack}
        sx={{
          width: "5rem",
          height: "5rem",
          background: "linear-gradient(-45deg, #44A08D, #093637)",
          backgroundSize: "400% 400%",
          animation: `${gradient} 10s ease infinite`,
          m: 0,
          p: 0,
        }}
      >
        <ArrowBack />
      </IconButton>
    </Box>
  );
}
