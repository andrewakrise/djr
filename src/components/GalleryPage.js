import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Container, Box, CircularProgress, useTheme } from "@mui/material";
import { useGetFilesByCategoryQuery } from "../services/file";
import { gradient } from "./helpers/utils";
import SquareGalleryView from "./helpers/SquareGalleryView";
import SquareViewDialog from "./helpers/SquareViewDialog";
import logo from "../assets/icons/garder-table-setup.JPG";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HeaderSection from "./helpers/HeaderSection";

function GalleryPage() {
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedPopupItem, setSelectedPopupItem] = useState(null);
  const theme = useTheme();
  const sliderRef = useRef(null);
  const videoRefs = useRef({});
  const resizeTimeoutRef = useRef(null);
  const resizeObserverRef = useRef(null);

  const { data: galleryItems, isLoading } = useGetFilesByCategoryQuery({
    category: "gallery",
  });

  // Function to alternate between videos and images
  const getAlternatedMedia = useMemo(() => {
    if (!galleryItems) return [];

    const videos = galleryItems.filter((item) => item.type === "video");
    const images = galleryItems.filter((item) => item.type === "image");

    const result = [];
    const maxLength = Math.max(videos.length, images.length);

    for (let i = 0; i < maxLength; i++) {
      if (videos[i]) result.push(videos[i]);
      if (images[i]) result.push(images[i]);
    }

    return result;
  }, [galleryItems]);

  // Enhanced video control function
  const stopVideo = useCallback(() => {
    // First stop the actively tracked video
    if (activeVideoId && videoRefs.current[activeVideoId]) {
      const video = videoRefs.current[activeVideoId];
      if (!video.paused) {
        video.pause();
        video.currentTime = 0;
      }
    }

    setActiveVideoId(null);
  }, [activeVideoId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(videoRefs.current).forEach((video) => {
        if (video && !video.paused) {
          video.pause();
        }
      });
    };
  }, []);

  // Improved ResizeObserver implementation
  useEffect(() => {
    let isSubscribed = true;

    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      resizeTimeoutRef.current = setTimeout(() => {
        if (isSubscribed && sliderRef.current) {
          stopVideo();
          if (
            sliderRef.current.innerSlider &&
            sliderRef.current.innerSlider.state
          ) {
            const currentIndex =
              sliderRef.current.innerSlider.state.currentSlide;
            sliderRef.current.slickGoTo(currentIndex, true);
          }
        }
      }, 250);
    };

    // Create a single ResizeObserver instance with error handling
    try {
      resizeObserverRef.current = new ResizeObserver((entries) => {
        // Use throttled requestAnimationFrame to prevent "loop completed" error
        if (!resizeTimeoutRef.current) {
          resizeTimeoutRef.current = setTimeout(() => {
            resizeTimeoutRef.current = null;
            if (isSubscribed) {
              handleResize();
            }
          }, 100);
        }
      });

      // Observe only the container
      const container = document.querySelector(".gallery-container");
      if (container) {
        resizeObserverRef.current.observe(container);
      }
    } catch (error) {
      console.log("ResizeObserver error:", error);
    }

    return () => {
      isSubscribed = false;
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      if (resizeObserverRef.current) {
        try {
          resizeObserverRef.current.disconnect();
        } catch (error) {
          console.log("Error disconnecting ResizeObserver:", error);
        }
      }
      stopVideo();
    };
  }, [stopVideo]);

  const handlePopupOpen = (item) => {
    stopVideo();
    setSelectedPopupItem(item);
    setOpenPopup(true);
  };

  const handlePopupClose = () => {
    stopVideo();
    setOpenPopup(false);
    setSelectedPopupItem(null);
  };

  return (
    <Container
      className="gallery-container"
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
        color: "white",
        padding: "2rem 0",
      }}
    >
      <Box
        spacing={2}
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
        <HeaderSection
          mainTitle="DJ RISE"
          subTitle="GALLERY"
          logo={logo}
          avatarAlt="DJ RISE"
        />
      </Box>

      {/* Featured Media Section */}
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 4,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <SquareGalleryView
          getAlternatedMedia={getAlternatedMedia}
          handlePopupOpen={handlePopupOpen}
          stopVideo={stopVideo}
        />
      )}

      {/* Popup Dialog */}
      <SquareViewDialog
        open={openPopup}
        onClose={handlePopupClose}
        selectedItem={selectedPopupItem}
        stopVideo={stopVideo}
      />
    </Container>
  );
}

export default GalleryPage;
