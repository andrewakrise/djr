import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import {
  useGetAllGalleryMediaQuery,
  useDeleteGalleryMediaMutation,
} from "../../../services/gallery";
import { useNotification } from "../../../context/NotificationContext";
import ConfirmationDialog from "../../helpers/ConfirmationDialog";
import GalleryAddEditDialog from "./GalleryAddEditDialog";
import { gradient } from "../../helpers/utils";

const GalleryAdmin = () => {
  const {
    data: galleryItems,
    isLoading,
    refetch,
  } = useGetAllGalleryMediaQuery();
  const [deleteGalleryMedia] = useDeleteGalleryMediaMutation();
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { showNotification } = useNotification();

  const handleOpenDialog = (item = null) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  const handleDelete = async () => {
    try {
      await deleteGalleryMedia(selectedItem._id).unwrap();
      showNotification("Gallery item deleted successfully", "success");
      setOpenConfirmation(false);
      refetch();
    } catch (error) {
      showNotification("Failed to delete gallery item", "error");
    }
  };

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
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Gallery Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            background: "linear-gradient(-45deg, #44A08D, #093637)",
            backgroundSize: "400% 400%",
            animation: `${gradient} 10s ease infinite`,
            "&:hover": {
              background: "linear-gradient(-45deg, #44A08D, #093637)",
            },
          }}
        >
          Add New Item
        </Button>
      </Box>

      <Grid container spacing={3}>
        {galleryItems?.media?.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item?._id}>
            <Card>
              <CardMedia
                component={item?.mediaType === "video" ? "video" : "img"}
                height="200"
                image={item?.url}
                alt={item?.title}
                controls={item?.mediaType === "video"}
              />
              <CardContent>
                <Typography variant="h6">{item?.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {item?.description}
                </Typography>
                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(item)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => {
                      setSelectedItem(item);
                      setOpenConfirmation(true);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <GalleryAddEditDialog
        open={openDialog}
        onClose={handleCloseDialog}
        refetchGallery={refetch}
        item={selectedItem}
      />

      <ConfirmationDialog
        open={openConfirmation}
        title="Delete Gallery Item"
        content="Are you sure you want to delete this gallery item? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setOpenConfirmation(false)}
        onClose={() => setOpenConfirmation(false)}
      />
    </Box>
  );
};

export default GalleryAdmin;
