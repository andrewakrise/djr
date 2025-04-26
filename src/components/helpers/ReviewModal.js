// src/components/helpers/ReviewModal.js

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Modal,
  Avatar,
  IconButton,
  Rating,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useGetReviewImageUrlQuery } from "../../services/review";
import { skipToken } from "@reduxjs/toolkit/dist/query";

const StyledModalBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 600,
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: 24,
  padding: theme.spacing(4),
  color: "#000",
}));

function ReviewModal({ open, onClose, review }) {
  // Only fetch signed URL if needed
  const shouldFetch = Boolean(
    open && review?.isImageOnly && review?.image?.public_id
  );
  const { data, isLoading } = useGetReviewImageUrlQuery(
    shouldFetch ? review._id : skipToken,
    { skip: !shouldFetch }
  );
  const signedImageUrl = data?.url || "";

  if (!review) return null;

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="review-modal-title">
      <StyledModalBox>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          {!review.isImageOnly && (
            <Typography id="review-modal-title" variant="h5">
              {review.name}
            </Typography>
          )}
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            mb: 2,
            flexDirection: review.isImageOnly ? "column" : "row",
            textAlign: review.isImageOnly ? "center" : "left",
          }}
        >
          {review.isImageOnly &&
            review.image &&
            (signedImageUrl || review.image.url) && (
              <Avatar
                src={signedImageUrl || review.image.url}
                alt={review.name}
                sx={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "1rem",
                }}
              />
            )}
          {!review.isImageOnly && (
            <Box>
              <Typography variant="body1">{review?.message}</Typography>
              <Rating value={review?.rate} readOnly precision={1} />
              <Typography variant="body2" color="textSecondary">
                {new Date(review?.eventDate)?.toLocaleDateString("en-CA", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Typography>
              {/* Additional Details */}
              {review?.isWillingToHireAgain && (
                <Typography variant="body2" gutterBottom>
                  <strong>Willing to Hire Again:</strong> Yes
                </Typography>
              )}
              {review?.isWillRecommend && (
                <Typography variant="body2" gutterBottom>
                  <strong>Will Recommend:</strong> Yes
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </StyledModalBox>
    </Modal>
  );
}

export default ReviewModal;
