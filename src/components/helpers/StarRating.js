// src/components/helpers/StarRating.js

import React from "react";
import { Rating } from "@mui/material";

function StarRating({ rating, onRateChange }) {
  return (
    <Rating
      name="star-rating"
      value={rating}
      onChange={(event, newValue) => {
        if (onRateChange) {
          onRateChange(newValue);
        }
      }}
      precision={1}
      max={5}
    />
  );
}

export default StarRating;
