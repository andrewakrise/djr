import React from "react";
import { Container } from "@mui/material";
import VideoLinkList from "./VideoLinkList";
import AdminNavbar from "./AdminNavbar";
import EventLists from "./EventList";
import ReviewList from "./ReviewList";

function AdminPage() {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
  }
  return (
    <>
      <AdminNavbar />
      <Container
        maxWidth={false}
        sx={{
          textAlign: "center",
          backgroundColor: "#282c34",
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          padding: "1rem 0",
          fontSize: "calc(10px + 2vmin)",
        }}
      >
        <EventLists />
        <ReviewList />
        <VideoLinkList />
      </Container>
    </>
  );
}

export default AdminPage;
