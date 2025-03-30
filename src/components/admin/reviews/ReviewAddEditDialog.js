// src/components/admin/reviews/ReviewAddEditDialog.js
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Box,
  Alert,
  Avatar,
  IconButton,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import {
  useAddReviewAsAdminMutation,
  useUpdateReviewMutation,
} from "../../../services/review";
import StarRating from "../../helpers/StarRating";
import { gradient } from "../../helpers/utils";

function ReviewAddEditDialog({ open, onClose, refetchReviews, review }) {
  const isEditMode = Boolean(review);
  // console.log("ReviewAddEditDialog isEditMode", isEditMode);
  // console.log("ReviewAddEditDialog review", review);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    eventDate: "",
    eventName: "",
    message: "",
    rate: 1,
    isWillingToHireAgain: false,
    isWillRecommend: false,
    isVerified: false,
    isImageOnly: false,
  });
  // console.log("ReviewAddEditDialog formData", formData);

  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [addReviewAsAdmin, { isLoading: isAdding }] =
    useAddReviewAsAdminMutation();
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();

  useEffect(() => {
    if (isEditMode && review) {
      setFormData({
        email: review.email || "",
        name: review.name || "",
        eventDate: review.eventDate ? review.eventDate.split("T")[0] : "",
        eventName: review.eventName || "",
        message: review.message || "",
        rate: review.rate || 1,
        isWillingToHireAgain: review.isWillingToHireAgain || false,
        isWillRecommend: review.isWillRecommend || false,
        isVerified: review.isVerified || false,
        isImageOnly: review.isImageOnly || false,
      });
      setPreviewImage(review.image?.url || "");
    } else {
      setFormData({
        email: "",
        name: "",
        eventDate: "",
        eventName: "",
        message: "",
        rate: 1,
        isWillingToHireAgain: false,
        isWillRecommend: false,
        isVerified: false,
        isImageOnly: false,
      });
      setPreviewImage("");
      setImageFile(null);
    }
    setErrorMsg("");
    setSuccessMsg("");
  }, [isEditMode, review]);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
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
      if (isEditMode && review._id) {
        // console.log("edit exec");
        const updateData = new FormData();
        updateData.append("email", formData.email);
        updateData.append("name", formData.name);
        updateData.append("eventDate", formData.eventDate);
        updateData.append("eventName", formData.eventName);
        updateData.append("message", formData.message);
        updateData.append("rate", formData.rate);
        updateData.append(
          "isWillingToHireAgain",
          formData.isWillingToHireAgain
        );
        updateData.append("isWillRecommend", formData.isWillRecommend);
        updateData.append("isVerified", formData.isVerified);
        updateData.append("isImageOnly", formData.isImageOnly);
        if (imageFile) {
          updateData.append("image", imageFile);
        }
        // console.log("handleSubmit Edit updateData", updateData);
        await updateReview({ reviewId: review._id, data: updateData }).unwrap();
        setSuccessMsg("Review updated successfully.");
      } else {
        // console.log("add exec");

        const addData = new FormData();
        addData.append("email", formData.email);
        addData.append("name", formData.name);
        addData.append("eventDate", formData.eventDate);
        addData.append("eventName", formData.eventName);
        addData.append("message", formData.message);
        addData.append("rate", formData.rate);
        addData.append("isWillingToHireAgain", formData.isWillingToHireAgain);
        addData.append("isWillRecommend", formData.isWillRecommend);
        addData.append("isVerified", formData.isVerified);
        addData.append("isImageOnly", formData.isImageOnly);
        if (imageFile) {
          addData.append("image", imageFile);
        }
        // console.log("handleSubmit add new addData", addData);

        await addReviewAsAdmin(addData).unwrap();
        setSuccessMsg("Review added successfully.");
      }

      refetchReviews?.();
      onClose();
    } catch (err) {
      setErrorMsg(err?.data?.msg || "An error occurred. Please try again.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEditMode ? "Edit Review" : "Add New Review"}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
          {successMsg && <Alert severity="success">{successMsg}</Alert>}
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            required
          />
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
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
          />
          <TextField
            label="Event Name"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
          />
          <TextField
            label="Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            multiline
            rows={4}
            required
          />
          <Box>
            <Typography variant="body1">Rating:</Typography>
            <StarRating
              rating={formData.rate}
              onRateChange={handleRateChange}
            />
          </Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isWillingToHireAgain}
                onChange={handleChange}
                name="isWillingToHireAgain"
              />
            }
            label="Willing to Hire Again"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isWillRecommend}
                onChange={handleChange}
                name="isWillRecommend"
              />
            }
            label="Will Recommend"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isVerified}
                onChange={handleChange}
                name="isVerified"
              />
            }
            label="Verified"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isImageOnly}
                onChange={handleChange}
                name="isImageOnly"
              />
            }
            label="Image Only Review"
          />
          <Box>
            <Typography variant="body1">Review Image:</Typography>
            {previewImage && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  mt: 1,
                }}
              >
                <Avatar
                  src={previewImage}
                  alt="Review Image"
                  sx={{ width: 100, height: 100 }}
                  variant="rounded"
                />
                <Button variant="contained" component="label">
                  Change Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
              </Box>
            )}
            {!previewImage && (
              <Button variant="contained" component="label" sx={{ mt: 1 }}>
                Upload Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isAdding || isUpdating}
          sx={{
            background: "linear-gradient(-45deg, #44A08D, #093637)",
            backgroundSize: "400% 400%",
            animation: `${gradient} 10s ease infinite`,
            color: "white",
            "&:hover": {
              background: "linear-gradient(-45deg, #44A08D, #093637)",
            },
          }}
        >
          {isAdding || isUpdating
            ? "Submitting..."
            : isEditMode
            ? "Update Review"
            : "Add Review"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ReviewAddEditDialog;
