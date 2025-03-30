import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  Container,
  Grid,
  CardMedia,
  Typography,
  Box,
  CircularProgress,
  Avatar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useGetAllGalleryMediaQuery } from "../services/gallery";
import { gradient } from "./helpers/utils";
import IconLinks from "./helpers/IconLinks";
import BackButton from "./helpers/BackButton";
import logo from "../assets/icons/garder-table-setup.JPG";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight, Movie } from "@mui/icons-material";

function GalleryPage() {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const sliderRef = useRef(null);
  const videoRefs = useRef({});
  const resizeTimeoutRef = useRef(null);
  const resizeObserverRef = useRef(null);
  const lastActiveVideoRef = useRef(null);

  const { data: galleryData, isLoading } = useGetAllGalleryMediaQuery({
    mediaType: undefined,
  });

  // Function to alternate between videos and images
  const getAlternatedMedia = React.useMemo(() => {
    if (!galleryData?.media) return [];

    const videos = galleryData.media.filter(
      (item) => item.mediaType === "video"
    );
    const images = galleryData.media.filter(
      (item) => item.mediaType === "image"
    );

    const result = [];
    const maxLength = Math.max(videos.length, images.length);

    for (let i = 0; i < maxLength; i++) {
      if (videos[i]) result.push(videos[i]);
      if (images[i]) result.push(images[i]);
    }

    return result;
  }, [galleryData?.media]);

  // Simple video control function
  const stopVideo = useCallback(() => {
    // Find all video elements in the document
    const allVideos = document.getElementsByTagName("video");

    // Find the currently playing video
    const playingVideo = Array.from(allVideos).find((video) => !video.paused);

    if (playingVideo) {
      playingVideo.pause();
      playingVideo.currentTime = 0;
      setActiveVideoId(null);
    }
  }, []);

  // Custom arrow components
  const CustomPrevArrow = ({ onClick }) => (
    <Box
      onClick={onClick}
      sx={{
        position: "absolute",
        left: "1rem",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 1,
        cursor: "pointer",
        color: "white",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        borderRadius: "50%",
        p: 1,
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
      }}
    >
      <ChevronLeft sx={{ fontSize: "4rem" }} />
    </Box>
  );

  const CustomNextArrow = ({ onClick }) => (
    <Box
      onClick={onClick}
      sx={{
        position: "absolute",
        right: "1rem",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 1,
        cursor: "pointer",
        color: "white",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        borderRadius: "50%",
        p: 1,
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
      }}
    >
      <ChevronRight sx={{ fontSize: "4rem" }} />
    </Box>
  );

  // Basic slider settings
  const settings = useMemo(
    () => ({
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      beforeChange: (current, next) => {
        stopVideo();
        setSelectedMediaIndex(next);
      },
      afterChange: (current) => {
        stopVideo();
      },
      prevArrow: <CustomPrevArrow />,
      nextArrow: <CustomNextArrow />,
    }),
    [stopVideo]
  );

  // Basic thumbnail settings
  const thumbnailSettings = useMemo(
    () => ({
      slidesToShow: 20,
      slidesToScroll: 1,
      dots: false,
      centerMode: true,
      centerPadding: "0px",
      focusOnSelect: true,
      infinite: true,
      arrows: false,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 10,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 10,
          },
        },
        {
          breakpoint: 500,
          settings: {
            slidesToShow: 6,
          },
        },
      ],
    }),
    []
  );

  // Simple thumbnail click handler
  const handleThumbnailClick = useCallback((index) => {
    setSelectedMediaIndex(index);
    sliderRef.current?.slickGoTo(index);
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
          const currentIndex = sliderRef.current.innerSlider.state.currentSlide;
          sliderRef.current.slickGoTo(currentIndex, true);
        }
      }, 250);
    };

    // Create a single ResizeObserver instance
    resizeObserverRef.current = new ResizeObserver((entries) => {
      requestAnimationFrame(() => {
        if (isSubscribed) {
          handleResize();
        }
      });
    });

    // Observe only the container
    const container = document.querySelector(".gallery-container");
    if (container) {
      resizeObserverRef.current.observe(container);
    }

    return () => {
      isSubscribed = false;
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      stopVideo();
    };
  }, [stopVideo]);

  // Add cleanup effect for video refs
  useEffect(() => {
    return () => {
      stopVideo();
    };
  }, [stopVideo]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

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
      <BackButton />
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            mb: 1,
            fontSize: "calc(0.5rem + 1.2vmin)",
            gap: "1rem",
          }}
        >
          <Typography
            sx={{
              fontSize: "calc(2rem + 2vmin)",
              letterSpacing: "0.5rem",
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
            GALLERY
          </Typography>
        </Box>
        <Avatar
          src={logo}
          sx={{ width: "15rem", height: "15rem", mb: "2rem" }}
          alt="RISE DJ"
        />
        <IconLinks />
      </Box>
      {/* Featured Media Section */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "1200px",
          mb: 4,
          px: 2,
        }}
      >
        <Slider ref={sliderRef} {...settings}>
          {getAlternatedMedia.map((item, index) => (
            <Box
              key={item._id}
              sx={{
                height: isMobile ? "600px" : "800px",
                position: "relative",
                overflow: "hidden",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": {
                  "& .media-overlay": {
                    opacity: 1,
                  },
                },
              }}
            >
              {item.mediaType === "video" ? (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <video
                    src={item.url}
                    controls
                    playsInline
                    muted={false}
                    ref={(el) => {
                      if (el) {
                        videoRefs.current[item._id] = el;
                      }
                    }}
                    onPlay={() => {
                      setActiveVideoId(item._id);
                    }}
                    onPause={() => {
                      if (activeVideoId === item._id) {
                        setActiveVideoId(null);
                      }
                    }}
                    onEnded={() => {
                      if (activeVideoId === item._id) {
                        setActiveVideoId(null);
                      }
                    }}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      width: "auto",
                      height: "auto",
                      objectFit: "contain",
                      backgroundColor: "#000",
                    }}
                  />
                  <Typography
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      color: "white",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      padding: "0.5rem 1rem",
                      borderRadius: "4px",
                      fontSize: "0.9rem",
                      pointerEvents: "none",
                      opacity: activeVideoId === item._id ? 0 : 1,
                      transition: "opacity 0.3s ease",
                      display: isMobile ? "block" : "none",
                    }}
                  >
                    Click to play
                  </Typography>
                </Box>
              ) : (
                <CardMedia
                  component="img"
                  image={item.url}
                  alt={item.title}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              )}
            </Box>
          ))}
        </Slider>

        {/* Thumbnail Navigation */}
        <Box sx={{ mt: 2, px: 0 }}>
          <Slider {...thumbnailSettings}>
            {getAlternatedMedia.map((item, index) => (
              <Box
                key={item._id}
                onClick={() => handleThumbnailClick(index)}
                sx={{
                  padding: "0",
                  cursor: "pointer",
                  opacity: selectedMediaIndex === index ? 1 : 0.6,
                  transition: "opacity 0.3s ease",
                  "&:hover": {
                    opacity: 1,
                  },
                }}
              >
                <Box
                  sx={{
                    width: "3rem",
                    height: "3rem",
                    position: "relative",
                    borderRadius: "4px",
                    overflow: "hidden",
                    border:
                      selectedMediaIndex === index
                        ? "2px solid #44A08D"
                        : "none",
                  }}
                >
                  {item.mediaType === "video" ? (
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <video
                        src={item.url}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          backgroundColor: "#000",
                        }}
                        muted
                        playsInline
                      />
                      <Typography
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          color: "white",
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                          padding: "0.3rem 0.6rem",
                          borderRadius: "4px",
                          fontSize: "0.7rem",
                          pointerEvents: "none",
                          display: isMobile ? "block" : "none",
                        }}
                      >
                        Click to play
                      </Typography>
                    </Box>
                  ) : (
                    <CardMedia
                      component="img"
                      image={item.url}
                      alt={item.title}
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </Box>
              </Box>
            ))}
          </Slider>
        </Box>
      </Box>

      {/* Grid of Smaller Media Items */}
      <Grid container spacing={2} sx={{ maxWidth: "1200px", px: 2 }}>
        {getAlternatedMedia.map((item, index) => (
          <Grid item xs={6} sm={4} md={3} key={item._id}>
            <Box
              sx={{
                position: "relative",
                paddingTop: "100%",
                cursor: "pointer",
                "&:hover": {
                  "& .media-overlay": {
                    opacity: 1,
                  },
                },
              }}
              onClick={() => handleThumbnailClick(index)}
            >
              {item.mediaType === "video" ? (
                <>
                  <video
                    src={item.url}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "4px",
                      backgroundColor: "#000",
                    }}
                    muted
                    playsInline
                  />
                  <Typography
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      color: "white",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      padding: "0.3rem 0.6rem",
                      borderRadius: "4px",
                      fontSize: "1rem",
                      pointerEvents: "none",
                      display: isMobile ? "block" : "none",
                    }}
                  >
                    Click to play
                  </Typography>
                  <Movie
                    sx={{
                      position: "absolute",
                      top: isMobile ? "15%" : "15%",
                      left: isMobile ? "15%" : "15%",
                      transform: "translate(-50%, -50%)",
                      color: "white",
                      // backgroundColor: "rgba(0, 0, 0, 0.5)",
                      padding: "0.3rem 0rem",
                      borderRadius: "4px",
                      fontSize: isMobile ? "2.5rem" : "3.5rem",
                      pointerEvents: "none",
                    }}
                  />
                </>
              ) : (
                <CardMedia
                  component="img"
                  image={item.url}
                  alt={item.title}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />
              )}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default GalleryPage;
