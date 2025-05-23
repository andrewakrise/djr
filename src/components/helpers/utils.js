import React from "react";
import { keyframes } from "@mui/system";

export const gradient = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

export const formatDateToLocalAmericaPacific = (date) => {
  return new Date(date).toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const generateUniqueInvoiceNumber = (date) => {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });
  return `CNT-INV-${formattedDate}`;
};
export const generateUniqueDepositNumber = (date) => {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });
  return `BLL-${formattedDate}`;
};

export const generateUniqueFinalNumber = (date) => {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });
  return `FNL-BLL-${formattedDate}`;
};

export const generateUniqueReceiptNumber = (date) => {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });
  return `FNL-RCPT-${formattedDate}`;
};

export const generateUniqueDepositReceiptNumber = (date) => {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });
  return `DPT-RCPT-${formattedDate}`;
};

export const generateUniqueFileName = (title, date, fileFormat) => {
  const sanitizedFileName = `${title} at ${formatDateToLocalAmericaPacific(
    date
  )} ${fileFormat} ${formatDateToLocalAmericaPacific(new Date())}`.replace(
    /[.,?/\\|<>]/g,
    ""
  );
  return sanitizedFileName;
};

export const convertTo12HourFormat = (time) => {
  if (!time) return "";
  const [hour, minute] = time.split(":");
  const intHour = parseInt(hour, 10);
  const period = intHour >= 12 ? "pm" : "am";
  const formattedHour = intHour % 12 === 0 ? 12 : intHour % 12;
  return `${formattedHour}:${minute} ${period}`;
};
