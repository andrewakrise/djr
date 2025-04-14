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
  FormControl,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Chip,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import {
  useUploadFileMutation,
  useUpdateFileMutation,
} from "../../../services/file";
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
  const [priorityOptimization, setPriorityOptimization] = useState(false);

  const [uploadFile, { isLoading: isAdding }] = useUploadFileMutation();
  const [updateFile, { isLoading: isUpdating }] = useUpdateFileMutation();

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
    setPriorityOptimization(false);
  }, [isEditMode, item]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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
      const isVideo = file.type.startsWith("video/");
      if (isVideo) {
        setPriorityOptimization(true);
      }
      setFormData((prev) => ({
        ...prev,
        media: file,
      }));
      setPreviewUrl(URL.createObjectURL(file));
      setTouchedFields((prev) => ({
        ...prev,
        media: true,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("tags", formData.tags);
      formDataToSend.append("category", "gallery");
      if (formData.media) {
        formDataToSend.append("file", formData.media);
      }
      if (priorityOptimization) {
        formDataToSend.append("priorityOptimization", "true");
      }

      if (isEditMode) {
        await updateFile({
          id: item._id,
          formData: formDataToSend,
        }).unwrap();
      } else {
        await uploadFile(formDataToSend).unwrap();
      }

      setSuccessMsg(
        `Media ${isEditMode ? "updated" : "added"} successfully${
          priorityOptimization ? " and optimization started" : ""
        }`
      );
      refetchGallery();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setErrorMsg(error?.data?.msg || "Error processing media");
    }
  };

  const renderPreview = () => {
    if (!previewUrl) return null;

    const isVideo =
      formData.media?.type?.startsWith("video/") || item?.type === "video";

    return (
      <Box sx={{ mt: 2, position: "relative" }}>
        <Typography variant="subtitle1" gutterBottom>
          Preview:
        </Typography>
        {isVideo ? (
          <Box sx={{ position: "relative" }}>
            <video
              src={previewUrl}
              controls
              preload="metadata"
              playsInline
              style={{ maxWidth: "100%", maxHeight: "200px" }}
            />
            {item?.videoMetadata && (
              <Chip
                label={
                  item.videoMetadata.isOptimized ? "Optimized" : "Optimizing..."
                }
                color={item.videoMetadata.isOptimized ? "success" : "warning"}
                size="small"
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                }}
              />
            )}
          </Box>
        ) : (
          <img
            src={previewUrl}
            alt="Preview"
            style={{ maxWidth: "100%", maxHeight: "200px" }}
          />
        )}
      </Box>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditMode ? "Edit Media" : "Add New Media"}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Alert>
        )}
        {successMsg && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMsg}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touchedFields.title && !isNotEmpty(formData.title)}
          helperText={
            touchedFields.title && !isNotEmpty(formData.title)
              ? "Title is required"
              : ""
          }
          sx={{ mb: 2, mt: 1 }}
        />

        <TextField
          fullWidth
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          onBlur={handleBlur}
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Tags (comma separated)"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          onBlur={handleBlur}
          sx={{ mb: 2 }}
        />

        <Button variant="outlined" component="label" fullWidth sx={{ mb: 2 }}>
          {isEditMode ? "Change Media" : "Upload Media"}
          <input
            type="file"
            hidden
            accept="image/*,video/*"
            onChange={handleFileChange}
          />
        </Button>

        {formData.media?.type?.startsWith("video/") && (
          <FormControlLabel
            control={
              <Checkbox
                checked={priorityOptimization}
                onChange={(e) => setPriorityOptimization(e.target.checked)}
              />
            }
            label="Priority video optimization"
          />
        )}

        {renderPreview()}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isAdding || isUpdating || !isNotEmpty(formData.title)}
          sx={{
            background: "linear-gradient(-45deg, #44A08D, #093637)",
            "&:hover": {
              background: "linear-gradient(-45deg, #44A08D, #093637)",
            },
          }}
        >
          {isAdding || isUpdating ? (
            <CircularProgress size={24} color="inherit" />
          ) : isEditMode ? (
            "Update"
          ) : (
            "Add"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default GalleryAddEditDialog;
