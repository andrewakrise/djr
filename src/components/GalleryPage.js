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
  Dialog,
  IconButton,
} from "@mui/material";
import { useGetFilesByCategoryQuery } from "../services/file";
import { gradient } from "./helpers/utils";
import IconLinks from "./helpers/IconLinks";
import BackButton from "./helpers/BackButton";
import logo from "../assets/icons/garder-table-setup.JPG";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight, Movie, Close } from "@mui/icons-material";

function GalleryPage() {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedPopupItem, setSelectedPopupItem] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
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

  // Simple video control function
  const stopAllVideos = useCallback(() => {
    Object.values(videoRefs.current).forEach((video) => {
      if (video && !video.paused) {
        video.pause();
        video.currentTime = 0;
      }
    });
    setActiveVideoId(null);
  }, []);

  // Video ref callback
  const videoRef = useCallback((element, id) => {
    if (element) {
      videoRefs.current[id] = element;
    } else {
      delete videoRefs.current[id];
    }
  }, []);

  // Handle video events
  const handleVideoEvent = useCallback(
    (event, id) => {
      const type = event.type;
      if (type === "play") {
        stopAllVideos();
        setActiveVideoId(id);
      } else if (
        (type === "pause" || type === "ended") &&
        activeVideoId === id
      ) {
        setActiveVideoId(null);
      }
    },
    [activeVideoId, stopAllVideos]
  );

  // Render video component
  const renderVideo = useCallback(
    (item, options = {}) => {
      const { thumbnail = false, controls = true } = options;

      return (
        <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
          <video
            ref={(el) => videoRef(el, item._id)}
            src={item.url}
            poster={item.thumbnailUrl}
            controls={controls}
            playsInline
            muted={thumbnail}
            preload="metadata"
            onPlay={(e) => handleVideoEvent(e, item._id)}
            onPause={(e) => handleVideoEvent(e, item._id)}
            onEnded={(e) => handleVideoEvent(e, item._id)}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              width: "auto",
              height: "auto",
              objectFit: "contain",
              backgroundColor: "#000",
            }}
          />
          {!thumbnail && isMobile && (
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
              }}
            >
              Click to play
            </Typography>
          )}
        </Box>
      );
    },
    [isMobile, activeVideoId, videoRef, handleVideoEvent]
  );

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
        stopAllVideos();
        setSelectedMediaIndex(next);
      },
      afterChange: (current) => {
        stopAllVideos();
      },
      prevArrow: <CustomPrevArrow />,
      nextArrow: <CustomNextArrow />,
    }),
    [stopAllVideos]
  );

  // Basic thumbnail settings
  const thumbnailSettings = useMemo(
    () => ({
      slidesToShow: 20,
      slidesToScroll: 1,
      dots: false,
      centerMode: false,
      centerPadding: "0px",
      focusOnSelect: true,
      infinite: false,
      arrows: false,
      swipeToSlide: true,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 15,
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
            slidesToShow: 8,
          },
        },
      ],
    }),
    []
  );

  // Update popup handlers
  const handlePopupOpen = useCallback(
    (item) => {
      stopAllVideos();
      setSelectedPopupItem(item);
      setOpenPopup(true);
    },
    [stopAllVideos]
  );

  const handlePopupClose = useCallback(() => {
    stopAllVideos();
    setOpenPopup(false);
    setSelectedPopupItem(null);
  }, [stopAllVideos]);

  // Update thumbnail click handler
  const handleThumbnailClick = useCallback(
    (index) => {
      stopAllVideos();
      setSelectedMediaIndex(index);
      sliderRef.current?.slickGoTo(index);
    },
    [stopAllVideos]
  );

  // Improved ResizeObserver implementation
  useEffect(() => {
    let isSubscribed = true;

    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      resizeTimeoutRef.current = setTimeout(() => {
        if (isSubscribed && sliderRef.current) {
          stopAllVideos();
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
      stopAllVideos();
    };
  }, [stopAllVideos]);

  // Update the slider rendering
  const renderSliderItem = useCallback(
    (item) => {
      return (
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
          }}
        >
          {item.type === "video" ? (
            renderVideo(item)
          ) : (
            <CardMedia
              component="img"
              image={item.url}
              alt={item.originalName}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
              }}
            />
          )}
        </Box>
      );
    },
    [isMobile, renderVideo]
  );

  // Update thumbnail rendering
  const renderThumbnail = useCallback(
    (item, index) => {
      return (
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
                selectedMediaIndex === index ? "2px solid #44A08D" : "none",
            }}
          >
            {item.type === "video" ? (
              renderVideo(item, { thumbnail: true, controls: false })
            ) : (
              <CardMedia
                component="img"
                image={item.url}
                alt={item.originalName}
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
      );
    },
    [selectedMediaIndex, handleThumbnailClick, renderVideo]
  );

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
        <>
          <Box
            sx={{
              width: "100%",
              maxWidth: "1200px",
              mb: 4,
              px: 2,
            }}
          >
            <Slider ref={sliderRef} {...settings}>
              {getAlternatedMedia.map(renderSliderItem)}
            </Slider>

            {/* Thumbnail Navigation */}
            <Box
              sx={{
                mt: 2,
                px: 0,
                width: "100%",
                overflowX: "auto",
                "&::-webkit-scrollbar": {
                  height: "6px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "3px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "rgba(255, 255, 255, 0.3)",
                  borderRadius: "3px",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.5)",
                  },
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  padding: "0 4px",
                  minWidth: "max-content",
                }}
              >
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
                      {item.type === "video" ? (
                        renderVideo(item, { thumbnail: true, controls: false })
                      ) : (
                        <CardMedia
                          component="img"
                          image={item.url}
                          alt={item.originalName}
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
              </Box>
            </Box>
          </Box>
        </>
      )}
      {/* Grid of Smaller Media Items */}
      <Grid container spacing={2} sx={{ maxWidth: "1200px", px: 2, mt: 4 }}>
        {getAlternatedMedia.map((item, index) => (
          <Grid item xs={6} sm={4} md={3} key={item._id}>
            <Box
              onClick={() => handlePopupOpen(item)}
              sx={{
                position: "relative",
                width: "100%",
                paddingTop: "100%",
                cursor: "pointer",
                borderRadius: "8px",
                overflow: "hidden",
                backgroundColor: "#000",
                "&:hover": {
                  "& .media-overlay": {
                    opacity: 1,
                  },
                  "& .media-content": {
                    transform: "scale(1.05)",
                  },
                },
              }}
            >
              {item.type === "video" ? (
                <>
                  <Box
                    component="video"
                    src={item.url}
                    muted
                    playsInline
                    preload="metadata"
                    poster={item.thumbnailUrl}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.3s ease",
                    }}
                    className="media-content"
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      color: "white",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      borderRadius: "50%",
                      padding: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Movie sx={{ fontSize: "2rem" }} />
                  </Box>
                </>
              ) : (
                <Box
                  component="img"
                  src={item.url}
                  alt={item.originalName}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.3s ease",
                  }}
                  className="media-content"
                />
              )}
              <Box
                className="media-overlay"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: "white",
                    textAlign: "center",
                    padding: "8px",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    borderRadius: "4px",
                  }}
                >
                  {item.type === "video" ? "Play Video" : "View Image"}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Popup Dialog */}
      <Dialog
        open={openPopup}
        onClose={handlePopupClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "transparent",
            boxShadow: "none",
            overflow: "hidden",
          },
        }}
      >
        <Box
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
            onClick={handlePopupClose}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.7)",
              },
            }}
          >
            <Close />
          </IconButton>
          {selectedPopupItem &&
            (selectedPopupItem.type === "video" ? (
              <Box
                component="video"
                ref={(el) => videoRef(el, selectedPopupItem._id)}
                src={selectedPopupItem.url}
                controls
                autoPlay
                onPlay={(e) => handleVideoEvent(e, selectedPopupItem._id)}
                onPause={(e) => handleVideoEvent(e, selectedPopupItem._id)}
                onEnded={(e) => handleVideoEvent(e, selectedPopupItem._id)}
                sx={{
                  width: "100%",
                  maxHeight: "90vh",
                  objectFit: "contain",
                }}
              />
            ) : (
              <Box
                component="img"
                src={selectedPopupItem.url}
                alt={selectedPopupItem.originalName}
                sx={{
                  width: "100%",
                  maxHeight: "90vh",
                  objectFit: "contain",
                }}
              />
            ))}
        </Box>
      </Dialog>
    </Container>
  );
}

export default GalleryPage;
