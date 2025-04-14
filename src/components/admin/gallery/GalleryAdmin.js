import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  CircularProgress,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import {
  useGetFilesByCategoryQuery,
  useDeleteFileMutation,
} from "../../../services/file";
import { useNotification } from "../../../context/NotificationContext";
import ConfirmationDialog from "../../helpers/ConfirmationDialog";
import GalleryAddEditDialog from "./GalleryAddEditDialog";
import { gradient } from "../../helpers/utils";

const GalleryAdmin = () => {
  const {
    data: galleryItems,
    isLoading,
    refetch,
  } = useGetFilesByCategoryQuery({ category: "gallery" });
  const [deleteFile] = useDeleteFileMutation();
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { showNotification } = useNotification();

  // Preload media when gallery items change
  useEffect(() => {
    if (galleryItems) {
      galleryItems.forEach((item) => {
        if (item.preloadUrls) {
          item.preloadUrls.forEach((url) => {
            const link = document.createElement("link");
            link.rel = "preload";
            link.as = url.endsWith(".mp4") ? "video" : "image";
            link.href = url;
            document.head.appendChild(link);
          });
        }
      });
    }
  }, [galleryItems]);

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
      await deleteFile(selectedItem._id).unwrap();
      showNotification("Gallery item deleted successfully", "success");
      setOpenConfirmation(false);
      refetch();
    } catch (error) {
      showNotification("Failed to delete gallery item", "error");
    }
  };

  const renderMediaPreview = (item) => {
    if (item.type === "video") {
      return (
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="video"
            src={item.url}
            title={item.title}
            controls
            preload="metadata"
            playsInline
            sx={{ height: 200 }}
          />
          {item.videoMetadata && (
            <Box
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                display: "flex",
                gap: 1,
              }}
            >
              {item.videoMetadata.isOptimized ? (
                <Chip
                  label="Optimized"
                  color="success"
                  size="small"
                  sx={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
                />
              ) : (
                <Chip
                  label="Optimizing..."
                  color="warning"
                  size="small"
                  sx={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
                />
              )}
              {item.videoMetadata.error && (
                <Chip
                  label="Error"
                  color="error"
                  size="small"
                  sx={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
                  title={item.videoMetadata.error}
                />
              )}
            </Box>
          )}
        </Box>
      );
    }
    return (
      <CardMedia
        component="img"
        image={item.url}
        title={item.title}
        sx={{ height: 200 }}
        loading="eager"
      />
    );
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
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => refetch()}
          >
            Refresh
          </Button>
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
      </Box>

      <Grid container spacing={3}>
        {galleryItems?.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item?._id}>
            <Card>
              {renderMediaPreview(item)}
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
