// src/components/helpers/StarRating.js

import React from "react";
import { Rating } from "@mui/material";

function StarRating({ rating, onRateChange, readOnly = false }) {
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
      readOnly={readOnly}
    />
  );
}

export default StarRating;
