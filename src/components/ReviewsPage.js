// src/components/ReviewsPage.js

import React, { useState } from "react";
import {
  createTheme,
  ThemeProvider,
  Container,
  Typography,
  Box,
  Avatar,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Alert,
  CircularProgress,
  Grid,
  Snackbar,
  Pagination,
} from "@mui/material";
import {
  useGetAllVerifiedReviewsQuery,
  useAddReviewMutation,
} from "../services/review";
import StarRating from "./helpers/StarRating";
import ReviewModal from "./helpers/ReviewModal";
import IconLinks from "./helpers/IconLinks";
import BackButton from "./helpers/BackButton";
import { gradient } from "./helpers/utils";
import logo from "../assets/icons/boat-science-world.JPG";
import { KeyboardArrowDown } from "@mui/icons-material";

const ITEMS_PER_PAGE = 50;

const theme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          width: "100%",
          background: "linear-gradient(-45deg, #44A08D, #093637)",
          backgroundSize: "400% 400%",
          animation: `${gradient} 10s ease infinite`,
          color: "#fff",
          "&:hover": {
            background: "linear-gradient(-45deg, #44A08D, #093637)",
            backgroundSize: "400% 400%",
            animation: `${gradient} 10s ease infinite`,
          },
          "&.Mui-focused": {
            background: "linear-gradient(-45deg, #44A08D, #093637)",
            backgroundSize: "400% 400%",
            animation: `${gradient} 10s ease infinite`,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#fff",
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: "#fff",
        },
      },
    },
  },
});

function ReviewsPage() {
  const [page, setPage] = useState(1);
  const {
    data: reviewsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllVerifiedReviewsQuery({ page, limit: ITEMS_PER_PAGE });
  const [addReview, { isLoading: isAdding }] = useAddReviewMutation();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    eventDate: "",
    eventName: "",
    message: "",
    rate: 1,
    isWillingToHireAgain: false,
    isWillRecommend: false,
  });
  // console.log("ReviewsPage formData", formData);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRateChange = (newRate) => {
    setFormData((prev) => ({
      ...prev,
      rate: newRate,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (
      !formData.email ||
      !formData.name ||
      !formData.eventDate ||
      !formData.message ||
      !formData.rate
    ) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    try {
      const reviewToSubmit = { ...formData };
      // console.log("handleSubmit reviewToSubmit", reviewToSubmit);

      await addReview(reviewToSubmit).unwrap();
      setSuccessMsg(
        "Review submitted successfully and is pending verification."
      );
      setFormData({
        email: "",
        name: "",
        eventDate: "",
        eventName: "",
        message: "",
        rate: 1,
        isWillingToHireAgain: false,
        isWillRecommend: false,
      });
      refetch?.();
    } catch (err) {
      setErrorMsg(err?.data?.msg || "Failed to submit review.");
    }
  };

  const handleReviewClick = (review) => {
    setSelectedReview(review);
    setOpenReviewModal(true);
  };

  const handleCloseReviewModal = () => {
    setSelectedReview(null);
    setOpenReviewModal(false);
  };

  const renderReviewMessage = (message) => {
    if (!message) return "";
    // Remove any duplicate phrases and clean up the message
    const cleanMessage = message.replace(/(\b\w+\b)(?=.*\1)/g, "");
    return cleanMessage.length > 150
      ? `${cleanMessage.substring(0, 150)}...`
      : cleanMessage;
  };

  const scrollToReviewForm = () => {
    const formElement = document.getElementById("review-form");
    formElement?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <ThemeProvider theme={theme}>
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
              REVIEWS
            </Typography>
          </Box>
          <Avatar
            src={logo}
            sx={{ width: "15rem", height: "15rem", mb: "2rem" }}
            alt="RISE DJ"
          />
          <IconLinks />
          <Box
            sx={{
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
              Read what our clients say about our services.
            </Typography>

            {/* Quick Submit Review Button */}
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <Button
                onClick={scrollToReviewForm}
                variant="contained"
                startIcon={<KeyboardArrowDown />}
                sx={{
                  backgroundColor: "#9c490e",
                  "&:hover": { backgroundColor: "#cc6f2d" },
                  borderRadius: "2rem",
                  px: 3,
                  py: 1,
                }}
              >
                Submit Your Review
              </Button>
            </Box>

            <Box
              sx={{
                width: "100%",
                maxWidth: "50rem",
                mt: 2,
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  paddingRight: "1rem",
                  margin: 0,
                  padding: 0,
                  my: 2,
                }}
              >
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
                ) : isError ? (
                  <Typography color="error" sx={{ mt: 4 }}>
                    Error loading reviews: {error?.msg || "Unknown error."}
                  </Typography>
                ) : reviewsData?.reviews?.length > 0 ? (
                  <Grid container spacing={1}>
                    {reviewsData?.reviews?.map((review) => (
                      <Grid item xs={12} sm={6} md={4} key={review?._id} my={1}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                            padding: "0.5rem",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            borderRadius: "8px",
                            cursor: "pointer",
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              backgroundColor: "rgba(255, 255, 255, 0.2)",
                              transform: "translateY(-5px)",
                              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                            },
                          }}
                          onClick={() => handleReviewClick(review)}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <Avatar
                              sx={{
                                bgcolor: "primary.main",
                                mr: 1,
                                width: 40,
                                height: 40,
                              }}
                            >
                              {review?.name?.charAt(0)?.toUpperCase()}
                            </Avatar>
                            <Typography variant="h6" sx={{ flex: 1 }}>
                              {review?.name}
                            </Typography>
                          </Box>
                          <StarRating rating={review?.rate} readOnly />
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ my: 1 }}
                          >
                            {new Date(review?.eventDate)?.toLocaleDateString(
                              "en-CA",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              mt: 1,
                              flex: 1,
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {renderReviewMessage(review.message)}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              mt: 2,
                              flexWrap: "wrap",
                            }}
                          >
                            {review?.isWillingToHireAgain && (
                              <Typography
                                variant="caption"
                                sx={{
                                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                                  padding: "0.25rem 0.5rem",
                                  borderRadius: "4px",
                                }}
                              >
                                Would Hire Again
                              </Typography>
                            )}
                            {review?.isWillRecommend && (
                              <Typography
                                variant="caption"
                                sx={{
                                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                                  padding: "0.25rem 0.5rem",
                                  borderRadius: "4px",
                                }}
                              >
                                Would Recommend
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography>No reviews available.</Typography>
                )}
              </Box>

              {reviewsData?.pagination?.pages > 1 && (
                <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                  <Pagination
                    count={reviewsData.pagination.pages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    sx={{
                      "& .MuiPaginationItem-root": {
                        color: "white",
                      },
                      "& .MuiPaginationItem-page.Mui-selected": {
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                      },
                    }}
                  />
                </Box>
              )}

              {selectedReview && (
                <ReviewModal
                  open={openReviewModal}
                  onClose={handleCloseReviewModal}
                  review={selectedReview}
                />
              )}
              <Box
                id="review-form"
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "1rem",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  mt: 2,
                }}
              >
                <Typography variant="h5">Submit Your Review</Typography>
                {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
                {successMsg && <Alert severity="success">{successMsg}</Alert>}
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email"
                      required
                      sx={{
                        width: "75%",
                        backgroundColor: "#857f7b",
                        "&:hover": { backgroundColor: "#827165" },
                        borderRadius: "4px",
                        color: "white",
                        input: { color: "white" },
                        "& .MuiInputLabel-root": { color: "white" },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      sx={{
                        width: "75%",
                        backgroundColor: "#857f7b",
                        "&:hover": { backgroundColor: "#827165" },
                        borderRadius: "4px",
                        color: "white",
                        input: { color: "white" },
                        "& .MuiInputLabel-root": { color: "white" },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Event Date"
                      name="eventDate"
                      type="date"
                      value={formData.eventDate}
                      onChange={handleChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      required
                      sx={{
                        width: "75%",
                        backgroundColor: "#857f7b",
                        "&:hover": { backgroundColor: "#827165" },
                        borderRadius: "4px",
                        color: "white",
                        input: { color: "white" },
                        "& .MuiInputLabel-root": { color: "white" },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Event Name"
                      name="eventName"
                      value={formData.eventName}
                      onChange={handleChange}
                      sx={{
                        width: "75%",
                        backgroundColor: "#857f7b",
                        "&:hover": { backgroundColor: "#827165" },
                        borderRadius: "4px",
                        color: "white",
                        input: { color: "white" },
                        "& .MuiInputLabel-root": { color: "white" },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      multiline
                      rows={7}
                      required
                      sx={{
                        width: "75%",
                        backgroundColor: "#857f7b",
                        "&:hover": { backgroundColor: "#827165" },
                        borderRadius: "4px",
                        color: "white",
                        input: { color: "white" },
                        "& .MuiInputLabel-root": { color: "white" },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="body1">Rating:</Typography>
                      <StarRating
                        rating={formData.rate}
                        onRateChange={handleRateChange}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.isWillingToHireAgain}
                          onChange={handleChange}
                          name="isWillingToHireAgain"
                          sx={{
                            color: "white",
                            "&.Mui-checked": { color: "white" },
                          }}
                        />
                      }
                      label="Willing to Hire Again"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.isWillRecommend}
                          onChange={handleChange}
                          name="isWillRecommend"
                          sx={{
                            color: "white",
                            "&.Mui-checked": { color: "white" },
                          }}
                        />
                      }
                      label="Will Recommend"
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isAdding}
                  sx={{
                    flexDirection: "column",
                    justifyContent: "center",
                    alighItems: "center",
                    textAlign: "center",
                    width: "100%",
                    backgroundColor: "#9c490e",
                    "&:hover": { backgroundColor: "#cc6f2d" },
                  }}
                >
                  {isAdding ? "Submitting..." : "Submit Review"}
                </Button>
              </Box>
              <Snackbar
                open={Boolean(successMsg)}
                autoHideDuration={6000}
                onClose={() => setSuccessMsg("")}
              >
                <Alert
                  onClose={() => setSuccessMsg("")}
                  severity="success"
                  sx={{ width: "100%" }}
                >
                  {successMsg}
                </Alert>
              </Snackbar>
              <Snackbar
                open={Boolean(errorMsg)}
                autoHideDuration={6000}
                onClose={() => setErrorMsg("")}
              >
                <Alert
                  onClose={() => setErrorMsg("")}
                  severity="error"
                  sx={{ width: "100%" }}
                >
                  {errorMsg}
                </Alert>
              </Snackbar>
            </Box>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default ReviewsPage;
