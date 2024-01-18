import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { useGetAllVideoLinksQuery } from "../services/video";
import Form from "./Form";
import Navbar from "./Navbar";
import Events from "./Events";
import EventPreview from "./EventPreview";

function HomePage() {
  const [showForm, setShowForm] = useState(false);
  const [showFullEvents, setShowFullEvents] = useState(false);
  const [showMoreVideos, setShowMoreVideos] = useState(false);
  const [sortedVideoLinks, setSortedVideoLinks] = useState([]);
  const { data: videoLinks, isLoading } = useGetAllVideoLinksQuery();

  useEffect(() => {
    if (videoLinks) {
      const sortedLinks = [...videoLinks].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setSortedVideoLinks(sortedLinks);
    }
  }, [videoLinks]);

  const toggleShowMore = () => {
    setShowMoreVideos(!showMoreVideos);
  };

  const renderVideoIframes = (videos) => {
    return videos.map((video, index) => (
      <Box
        key={index}
        sx={{
          position: "relative",
          overflow: "hidden",
          width: "100%",
          height: "100%",
          paddingTop: "6.25%",
          mb: 2,
        }}
      >
        <iframe
          src={video.url}
          title={video.description}
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          style={{
            width: "calc(100px + 55vmin)",
            height: "calc(10px + 40vmin)",
          }}
        />
      </Box>
    ));
  };

  return (
    <>
      <Navbar />
      <Container
        maxWidth={false}
        sx={{
          textAlign: "center",
          backgroundColor: "#282c34",
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          padding: "2rem 0 2rem 0",
          fontSize: "calc(10px + 2vmin)",
        }}
      >
        <Box
          spacing={2}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box sx={{ mb: 1, fontSize: "calc(8px + 1.2vmin)" }}>
            <Typography
              mb={2}
              sx={{
                fontSize: "calc(10px + 2vmin)",
              }}
              variant="h4"
            >
              DJ & Mood Creator
            </Typography>
          </Box>
          <Box sx={{ mb: 1, fontSize: "calc(8px + 1.2vmin)" }}>
            <Typography
              mb={2}
              sx={{
                fontSize: "calc(10px + 2vmin)",
              }}
              variant="h4"
            >
              Bringing Harmony to Your Event
            </Typography>
          </Box>
          <Box
            sx={{
              width: "calc(100px + 55vmin)",
              height: "calc(100px + 55vmin)%",
              mb: 3,
            }}
          >
            {showFullEvents ? (
              <>
                <Button onClick={() => setShowFullEvents(false)}>
                  Hide Events
                </Button>
                <Box
                  sx={{
                    width: "calc(100px + 55vmin)",
                    height: "calc(100px + 55vmin)%",
                  }}
                >
                  <Events />
                </Box>
              </>
            ) : (
              <>
                <Button onClick={() => setShowFullEvents(true)}>
                  Show All Events
                </Button>
                <EventPreview onClick={() => setShowFullEvents(true)} />
              </>
            )}
          </Box>
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              width: "100%",
              height: "100%",
            }}
          >
            <iframe
              allow="autoplay"
              style={{
                width: "calc(100px + 55vmin)",
                height: "calc(5px + 15vmin)",
                minHeight: "100px",
                maxHeight: "200px",
              }}
              src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1678702296&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"
            />
          </Box>
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              width: "100%",
              height: "100%",
            }}
          >
            <iframe
              allow="autoplay"
              style={{
                width: "calc(100px + 55vmin)",
                height: "calc(5px + 15vmin)",
                minHeight: "100px",
                maxHeight: "200px",
              }}
              src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1651701087&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"
            />
          </Box>
          {isLoading ? (
            <Typography>Loading videos...</Typography>
          ) : (
            renderVideoIframes(sortedVideoLinks.slice(0, 2))
          )}
          {sortedVideoLinks.length > 2 && (
            <Button onClick={toggleShowMore}>
              {showMoreVideos ? "Hide Older Videos" : "Show More Videos"}
            </Button>
          )}
          {showMoreVideos && renderVideoIframes(sortedVideoLinks.slice(2))}

          <Box
            sx={{
              direction: "column",
              alignItems: "center",
              width: "100%",
              mt: 3,
            }}
          >
            <Button
              variant="contained"
              fullWidth
              onClick={() => setShowForm(!showForm)}
              sx={{
                backgroundColor: "#9c490e",
                "&:hover": { backgroundColor: "#cc6f2d" },
              }}
            >
              {showForm ? "Close Form" : "Book Party or Event"}
            </Button>
            {showForm && (
              <Box sx={{ mt: 3 }}>
                <Form />
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default HomePage;
