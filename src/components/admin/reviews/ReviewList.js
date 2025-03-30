// src/components/admin/reviews/ReviewList.js

import React, { useState } from "react";
import {
  useGetAllReviewsQuery,
  useDeleteReviewMutation,
  useUpdateReviewMutation,
} from "../../../services/review";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Delete,
  Edit,
  CheckCircle,
  Cancel as CancelIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import ConfirmationDialog from "../../helpers/ConfirmationDialog";
import ReviewAddEditDialog from "./ReviewAddEditDialog";
import { gradient } from "../../helpers/utils";

function ReviewList() {
  const { data: reviews, refetch } = useGetAllReviewsQuery();
  const [deleteReview] = useDeleteReviewMutation();
  const [updateReview] = useUpdateReviewMutation();
  // console.log("reviews", reviews);

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [reviewIdToDelete, setReviewIdToDelete] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleDelete = (id) => {
    setReviewIdToDelete(id);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!reviewIdToDelete) {
      setErrorMsg("Review ID is missing.");
      return;
    }
    try {
      await deleteReview(reviewIdToDelete).unwrap();
      setSuccessMsg("Review deleted successfully.");
      refetch();
    } catch (err) {
      setErrorMsg(err?.data?.msg || "Failed to delete review.");
    } finally {
      setOpenConfirmDialog(false);
      setReviewIdToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setOpenConfirmDialog(false);
    setReviewIdToDelete(null);
  };

  const handleEdit = (review) => {
    setSelectedReview(review);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setSelectedReview(null);
    setOpenEditDialog(false);
  };

  const handleVerifyToggle = async (review) => {
    try {
      const updatedData = { isVerified: !review.isVerified };
      await updateReview({ reviewId: review._id, data: updatedData }).unwrap();
      setSuccessMsg(
        `Review has been ${updatedData.isVerified ? "verified" : "unverified"}.`
      );
      refetch?.();
    } catch (err) {
      setErrorMsg(err?.data?.msg || "Failed to update review.");
    }
  };

  const columns = [
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <>
          <Tooltip title="Verify/Unverify Review">
            <IconButton
              color={params.row?.isVerified ? "success" : "warning"}
              onClick={() => handleVerifyToggle(params.row)}
              aria-label="verify-review"
            >
              {params.row.isVerified ? <CheckCircle /> : <CancelIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Review">
            <IconButton
              color="primary"
              onClick={() => handleEdit(params.row)}
              aria-label="edit-review"
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Review">
            <IconButton
              color="error"
              onClick={() => handleDelete(params.row._id)}
              aria-label="delete-review"
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
    {
      field: "isImageOnly",
      headerName: "Image Only",
      width: 120,
      renderCell: (params) =>
        params.value ? (
          <CheckCircle color="success" />
        ) : (
          <CancelIcon color="error" />
        ),
    },
    { field: "name", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "eventName",
      headerName: "Event Name",
      width: 150,
      valueGetter: (params) => params.row?.eventName || "N/A",
    },
    {
      field: "eventDate",
      headerName: "Event Date",
      width: 150,
      valueGetter: (params) =>
        new Date(params.row?.eventDate).toLocaleDateString("en-CA", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
    },
    { field: "rate", headerName: "Rating", width: 100 },
    {
      field: "isVerified",
      headerName: "Verified",
      width: 100,
      renderCell: (params) =>
        params?.value ? (
          <CheckCircle color="success" />
        ) : (
          <CancelIcon color="error" />
        ),
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "1rem 0",
        margin: "1rem 0",
        width: "100%",
      }}
    >
      <Typography variant="h4" sx={{ mb: 2, textAlign: "center" }}>
        Reviews
      </Typography>
      <Box sx={{ mb: 2, alignSelf: "center" }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddDialog(true)}
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
          Add Review
        </Button>
      </Box>

      {successMsg && <Alert severity="success">{successMsg}</Alert>}
      {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
      <Box sx={{ height: 600, width: "100%", mt: 2 }}>
        {reviews && reviews?.reviews && reviews?.reviews?.length > 0 ? (
          <DataGrid
            rows={reviews?.reviews}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            disableSelectionOnClick
            getRowId={(row) => row._id}
            sx={{
              ".MuiDataGrid-cell": {
                whiteSpace: "normal",
                wordWrap: "break-word",
                color: "#ffffff",
              },
            }}
          />
        ) : (
          <Typography variant="h6" sx={{ mt: 4 }}>
            No reviews available.
          </Typography>
        )}
      </Box>

      <ConfirmationDialog
        open={openConfirmDialog}
        title="Delete Review"
        content="Are you sure you want to delete this review? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Edit Review Dialog */}
      {selectedReview && (
        <ReviewAddEditDialog
          open={openEditDialog}
          onClose={handleCloseEditDialog}
          refetchReviews={refetch}
          review={selectedReview}
        />
      )}
      <ReviewAddEditDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        refetchReviews={refetch}
      />
    </Box>
  );
}

export default ReviewList;
