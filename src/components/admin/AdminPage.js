import React, { useEffect, useState } from "react";
import { Container, Box, Tab, Tabs } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import VideoLinkList from "./video/VideoLinkList";
import AdminNavbar from "./AdminNavbar";
import EventList from "./events/EventList";
import ReviewList from "./reviews/ReviewList";
import GalleryAdmin from "./gallery/GalleryAdmin";

function AdminPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  // Get the current tab from URL or default to 0
  const getTabValue = () => {
    const tab = location.hash.slice(1) || "events";
    switch (tab) {
      case "events":
        return 0;
      case "reviews":
        return 1;
      case "gallery":
        return 2;
      case "videos":
        return 3;
      default:
        return 0;
    }
  };

  const [currentTab, setCurrentTab] = useState(getTabValue());

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    const tabNames = ["events", "reviews", "gallery", "videos"];
    navigate(`#${tabNames[newValue]}`, { replace: true });
  };

  return (
    <div style={{ height: "100vh" }}>
      <AdminNavbar />
      <Container
        maxWidth={false}
        sx={{
          textAlign: "center",
          backgroundColor: "transparent",
          height: "calc(100% - 3rem)",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          color: "white",
          padding: "1rem 0",
          fontSize: "calc(10px + 2vmin)",
        }}
      >
        <Box sx={{ width: "100%", borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": {
                color: "white",
                "&.Mui-selected": {
                  color: "#44A08D",
                },
              },
            }}
          >
            <Tab label="Events" />
            <Tab label="Reviews" />
            <Tab label="Gallery" />
            <Tab label="Videos" />
          </Tabs>
        </Box>

        <Box sx={{ width: "100%", mt: 2 }}>
          {currentTab === 0 && <EventList />}
          {currentTab === 1 && <ReviewList />}
          {currentTab === 2 && <GalleryAdmin />}
          {currentTab === 3 && <VideoLinkList />}
        </Box>
      </Container>
    </div>
  );
}

export default AdminPage;
