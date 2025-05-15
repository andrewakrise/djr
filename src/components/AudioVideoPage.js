import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Avatar, Button } from "@mui/material";
import { useGetAllVideoLinksQuery } from "../services/video";
import IconLinks from "./helpers/IconLinks";
import { gradient } from "./helpers/utils";
import logo from "../assets/icons/boat-science-world.JPG";
import HeaderSection from "./helpers/HeaderSection";

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

  useEffect(() => {
    // Load Mixcloud widget script
    const script = document.createElement("script");
    script.src = "https://widget.mixcloud.com/media/js/widgetApi.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const toggleShowMore = () => {
    setShowMoreVideos(!showMoreVideos);
  };

  const renderVideoIframes = (videos) => {
    return videos?.map((video, index) => {
      const isMixcloud = video?.url?.includes("mixcloud.com");

      return (
        <Box
          key={index}
          sx={{
            position: "relative",
            overflow: "hidden",
            width: "100%",
            height: "100%",
            paddingTop: isMixcloud ? "56.25%" : "56.25%",
            mb: 2,
          }}
        >
          {isMixcloud ? (
            <iframe
              src={`https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&light=1&feed=${encodeURIComponent(
                video.url
              )}`}
              title={video?.description}
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none",
              }}
            />
          ) : (
            <iframe
              src={video?.url}
              title={video?.description}
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none",
              }}
            />
          )}
        </Box>
      );
    });
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            maxWidth: "40rem",
            p: "1rem",
            mt: -3,
            mb: 1,
          }}
        >
          <HeaderSection
            mainTitle="DJ RISE"
            subTitle="AUDIOS & VIDEOS"
            logo={logo}
            avatarAlt="DJ RISE"
          />
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
              src="https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&light=1&feed=%2Fvandjrise%2Fdj-rise-ucc-birthday-party-old-school-hip-hop-rnb%2F"
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
              src="https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&light=1&feed=%2Fvandjrise%2Fdj-rise-kids-bowl-club-oct-23-2024%2F"
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
              src="https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&light=1&feed=%2Fvandjrise%2Fdj-rise-vgc-student-party-july-07-2024%2F"
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
              src="https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&light=1&feed=%2Fvandjrise%2Fdj-rise-00s-rnb-disco-hits%2F"
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
              src="https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&light=1&feed=%2Fvandjrise%2Frise-dj-nice-house-music-001%2F"
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
              src="https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&light=1&feed=%2Fvandjrise%2Fdj-rise-oldies-dance-promo-mix%2F"
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
