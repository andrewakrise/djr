import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  Typography,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import {
  useAddGalleryMediaMutation,
  useUpdateGalleryMediaMutation,
} from "../../../services/gallery";
import { isNotEmpty, meetsMinLength } from "../../../utils/validation";
import { gradient } from "../../helpers/utils";

function GalleryAddEditDialog({ open, onClose, refetchGallery, item }) {
  const isEditMode = Boolean(item);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    media: null,
  });
  const [previewUrl, setPreviewUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [touchedFields, setTouchedFields] = useState({
    title: false,
    description: false,
    tags: false,
    media: false,
  });

  const [addGalleryMedia, { isLoading: isAdding }] =
    useAddGalleryMediaMutation();
  const [updateGalleryMedia, { isLoading: isUpdating }] =
    useUpdateGalleryMediaMutation();

  useEffect(() => {
    if (isEditMode && item) {
      setFormData({
        title: item.title || "",
        description: item.description || "",
        tags: item.tags?.join(", ") || "",
        media: null,
      });
      setPreviewUrl(item.url || "");
    } else {
      setFormData({
        title: "",
        description: "",
        tags: "",
        media: null,
      });
      setPreviewUrl("");
    }
    setErrorMsg("");
    setSuccessMsg("");
  }, [isEditMode, item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouchedFields((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, media: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!isNotEmpty(formData.title)) {
      errors.title = "Title is required";
    } else if (!meetsMinLength(formData.title, 3)) {
      errors.title = "Title must be at least 3 characters long";
    }

    if (!isNotEmpty(formData.description)) {
      errors.description = "Description is required";
    } else if (!meetsMinLength(formData.description, 10)) {
      errors.description = "Description must be at least 10 characters long";
    }

    if (!isEditMode && !formData.media) {
      errors.media = "Media file is required";
    }

    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setErrorMsg("Please fix the errors before submitting");
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("tags", formData.tags);
      if (formData.media) {
        submitData.append("media", formData.media);
      }

      if (isEditMode) {
        await updateGalleryMedia({
          id: item._id,
          formData: submitData,
        }).unwrap();
        setSuccessMsg("Gallery item updated successfully");
      } else {
        await addGalleryMedia(submitData).unwrap();
        setSuccessMsg("Gallery item added successfully");
      }

      refetchGallery();
      onClose();
    } catch (error) {
      console.error("Error:", error);
      setErrorMsg(
        error?.data?.msg ||
          `Failed to ${isEditMode ? "update" : "add"} gallery item`
      );
    }
  };

  const errors = validateForm();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {isEditMode ? "Edit Gallery Item" : "Add New Gallery Item"}
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={2}>
          {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
          {successMsg && <Alert severity="success">{successMsg}</Alert>}

          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touchedFields.title && !!errors.title}
            helperText={touchedFields.title && errors.title}
            fullWidth
            required
          />

          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touchedFields.description && !!errors.description}
            helperText={touchedFields.description && errors.description}
            multiline
            rows={4}
            fullWidth
            required
          />

          <TextField
            label="Tags (comma-separated)"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            onBlur={handleBlur}
            fullWidth
          />

          <Button
            variant="outlined"
            component="label"
            fullWidth
            error={touchedFields.media && !!errors.media}
          >
            Upload Media
            <input
              type="file"
              hidden
              accept="image/*,video/*"
              onChange={handleFileChange}
            />
          </Button>
          {touchedFields.media && errors.media && (
            <Typography color="error" variant="caption">
              {errors.media}
            </Typography>
          )}

          {previewUrl && (
            <Box mt={2}>
              <Typography variant="subtitle2">Preview:</Typography>
              {formData.media?.type?.startsWith("video/") ? (
                <video
                  src={previewUrl}
                  controls
                  style={{ maxWidth: "100%", maxHeight: "200px" }}
                />
              ) : (
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ maxWidth: "100%", maxHeight: "200px" }}
                />
              )}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isAdding || isUpdating}
          sx={{
            background: "linear-gradient(-45deg, #44A08D, #093637)",
            backgroundSize: "400% 400%",
            animation: `${gradient} 10s ease infinite`,
            "&:hover": {
              background: "linear-gradient(-45deg, #44A08D, #093637)",
            },
          }}
        >
          {isAdding || isUpdating ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default GalleryAddEditDialog;
