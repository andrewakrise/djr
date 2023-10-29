import { useState } from "react";
import { Container, Typography, Link, Box, Button } from "@mui/material";
import Form from "./components/Form";
import Navbar from "./components/Navbar";
import Events from "./components/Events";
import EventPreview from "./components/EventPreview";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [showFullEvents, setShowFullEvents] = useState(false);

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
              scrolling="no"
              frameBorder="no"
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
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              width: "100%",
              height: "100%",
              paddingTop: "6.25%",
            }}
          >
            <iframe
              src="https://www.youtube.com/embed/oN9OIOZGkCo"
              scrolling="no"
              frameBorder="no"
              style={{
                width: "calc(100px + 55vmin)",
                height: "calc(10px + 40vmin)",
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              title="YouTube video player"
            />
          </Box>
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              width: "100%",
              height: "100%",
              paddingTop: "6.25%",
            }}
          >
            <iframe
              src="https://player.twitch.tv/?video=1962035730&parent=www.djsrise.com"
              frameBorder="0"
              allowFullScreen="true"
              scrolling="no"
              style={{
                width: "calc(100px + 55vmin)",
                height: "calc(10px + 40vmin)",
              }}
            ></iframe>
          </Box>
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

export default App;
