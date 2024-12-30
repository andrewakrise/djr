import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Avatar, Button } from "@mui/material";
import { useGetAllVideoLinksQuery } from "../services/video";
import IconLinks from "./helpers/IconLinks";
import BackButton from "./helpers/BackButton";
import { gradient } from "./helpers/utils";
import logo from "../assets/icons/boat-science-world.JPG";

function AudioVideoPage() {
  const [showMoreVideos, setShowMoreVideos] = useState(false);
  const [sortedVideoLinks, setSortedVideoLinks] = useState([]);
  const { data: videoLinks, isLoading } = useGetAllVideoLinksQuery();

  useEffect(() => {
    if (videoLinks) {
      const sortedLinks = [...videoLinks].sort(
        (a, b) => new Date(b?.createdAt) - new Date(a?.createdAt)
      );
      setSortedVideoLinks(sortedLinks);
    }
  }, [videoLinks]);

  const toggleShowMore = () => {
    setShowMoreVideos(!showMoreVideos);
  };

  const renderVideoIframes = (videos) => {
    return videos?.map((video, index) => (
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
          src={video?.url}
          title={video?.description}
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          style={{
            minWidth: "18rem",
            width: "100%",
            maxWidth: "45rem",
            minHeight: "35rem",
            height: "100%",
            maxHeight: "50rem",
          }}
        />
      </Box>
    ));
  };

  return (
    <>
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
        <BackButton />
        <Box
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
          <Typography
            sx={{
              fontSize: "calc(2rem + 2vmin)",
              letterSpacing: "0.5rem",
              mb: 2,
            }}
            variant="h3"
          >
            DJ RISE
          </Typography>
          <Typography
            sx={{
              fontSize: "calc(2rem + 2vmin)",
              letterSpacing: "0.5rem",
            }}
            variant="h3"
          >
            AUDIOS & VIDEOS
          </Typography>
        </Box>
        <Avatar
          src={logo}
          sx={{ width: "15rem", height: "15rem", mb: "2rem" }}
          alt="RISE DJ"
        />
        <IconLinks />
        <Box
          spacing={2}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            maxWidth: "50rem",
            mt: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: "calc(1rem + 1vmin)",
              letterSpacing: "0.2rem",
              mb: 2,
            }}
            variant="body1"
          >
            Explore music sessions below:
          </Typography>
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              width: "100%",
              mb: 2,
            }}
          >
            <iframe
              allow="autoplay"
              style={{
                minWidth: "18rem",
                width: "100%",
                maxWidth: "45rem",
                minHeight: "4rem",
                height: "100%",
                maxHeight: "7.5rem",
              }}
              src="https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&light=1&feed=%2Fandrewrisedj%2Fdj-rise-ucc-birthday-party-old-school-hip-hop-rnb%2F"
            />
          </Box>
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              width: "100%",
              mb: 2,
            }}
          >
            <iframe
              allow="autoplay"
              style={{
                minWidth: "18rem",
                width: "100%",
                maxWidth: "45rem",
                minHeight: "4rem",
                height: "100%",
                maxHeight: "7.5rem",
              }}
              src="https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&light=1&feed=%2Fandrewrisedj%2Fdj-rise-kids-bowl-club-oct-23-2024%2F"
            />
          </Box>
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              width: "100%",
              mb: 2,
            }}
          >
            <iframe
              allow="autoplay"
              style={{
                minWidth: "18rem",
                width: "100%",
                maxWidth: "45rem",
                minHeight: "4rem",
                height: "100%",
                maxHeight: "7.5rem",
              }}
              src="https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&light=1&feed=%2Fandrewrisedj%2Fdj-rise-vgc-student-party-july-07-2024%2F"
            />
          </Box>
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              width: "100%",
              mb: 2,
            }}
          >
            <iframe
              allow="autoplay"
              style={{
                minWidth: "18rem",
                width: "100%",
                maxWidth: "45rem",
                minHeight: "4rem",
                height: "100%",
                maxHeight: "7.5rem",
              }}
              src="https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&light=1&feed=%2Fandrewrisedj%2Fdj-rise-00s-rnb-disco-hits%2F"
            />
          </Box>
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              width: "100%",
              mb: 2,
            }}
          >
            <iframe
              allow="autoplay"
              style={{
                minWidth: "18rem",
                width: "100%",
                maxWidth: "45rem",
                minHeight: "4rem",
                height: "100%",
                maxHeight: "7.5rem",
              }}
              src="https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&light=1&feed=%2Fandrewrisedj%2Frise-dj-nice-house-music-001%2F"
            />
          </Box>
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              width: "100%",
              mb: 2,
            }}
          >
            <iframe
              allow="autoplay"
              style={{
                minWidth: "18rem",
                width: "100%",
                maxWidth: "45rem",
                minHeight: "4rem",
                height: "100%",
                maxHeight: "7.5rem",
              }}
              src="https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&light=1&feed=%2Fandrewrisedj%2Fdj-rise-oldies-dance-promo-mix%2F"
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
        </Box>
      </Container>
    </>
  );
}

export default AudioVideoPage;
