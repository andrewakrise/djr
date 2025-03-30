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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import {
  useGetAllGalleryMediaQuery,
  useAddGalleryMediaMutation,
  useUpdateGalleryMediaMutation,
  useDeleteGalleryMediaMutation,
} from "../../../services/gallery";
import { useNotification } from "../../../context/NotificationContext";
import ConfirmationDialog from "../../helpers/ConfirmationDialog";

const GalleryAdmin = () => {
  const { data: galleryItems, isLoading } = useGetAllGalleryMediaQuery();
  console.log("galleryItems", galleryItems);
  const [addGalleryMedia] = useAddGalleryMediaMutation();
  const [updateGalleryMedia] = useUpdateGalleryMediaMutation();
  const [deleteGalleryMedia] = useDeleteGalleryMediaMutation();
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    media: null,
  });
  const { showNotification } = useNotification();

  const handleOpenDialog = (item = null) => {
    if (item) {
      setFormData({
        title: item.title,
        description: item.description,
        tags: item.tags.join(", "),
        media: null,
      });
      setSelectedItem(item);
    } else {
      setFormData({
        title: "",
        description: "",
        tags: "",
        media: null,
      });
      setSelectedItem(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, media: e.target.files[0] }));
  };

  const handleSubmit = async () => {
    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("tags", formData.tags);
      if (formData.media) {
        submitData.append("media", formData.media);
      }

      if (selectedItem) {
        await updateGalleryMedia({
          id: selectedItem._id,
          formData: submitData,
        }).unwrap();
        showNotification("Gallery item updated successfully", "success");
      } else {
        await addGalleryMedia(submitData).unwrap();
        showNotification("Gallery item added successfully", "success");
      }

      handleCloseDialog();
    } catch (error) {
      showNotification(
        `Failed to ${selectedItem ? "update" : "add"} gallery item`,
        "error"
      );
    }
  };

  const handleDelete = async () => {
    try {
      await deleteGalleryMedia(selectedItem._id).unwrap();
      showNotification("Gallery item deleted successfully", "success");
      setOpenConfirmation(false);
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

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedItem ? "Edit Gallery Item" : "Add New Gallery Item"}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              multiline
              rows={4}
              fullWidth
            />
            <TextField
              label="Tags (comma-separated)"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              fullWidth
            />
            <Button variant="outlined" component="label" fullWidth>
              Upload Media
              <input
                type="file"
                hidden
                accept="image/*,video/*"
                onChange={handleFileChange}
              />
            </Button>
            {formData.media && (
              <Typography variant="body2">
                Selected file: {formData.media.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmationDialog
        open={openConfirmation}
        title="Delete Gallery Item"
        content="Are you sure you want to delete this gallery item? This action cannot be undone."
        onConfirm={handleDelete}
        onClose={() => setOpenConfirmation(false)}
      />
    </Box>
  );
};

export default GalleryAdmin;
