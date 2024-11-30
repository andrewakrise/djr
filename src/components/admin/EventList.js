import React, { useState } from "react";
import {
  useGetAllEventsQuery,
  useDeleteEventMutation,
} from "../../services/event";
import {
  Typography,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Alert,
  Avatar,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EventAddEdit from "./EventAddEdit";
import { Delete, Edit } from "@mui/icons-material";
import ConfirmationDialog from "../helpers/ConfirmationDialog";

function EventList() {
  const { data: events, isLoading, isError, refetch } = useGetAllEventsQuery();
  const [deleteEvent] = useDeleteEventMutation();
  const [openAddEventForm, setOpenAddEventForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [eventIdToDelete, setEventIdToDelete] = useState(null);

  const handleDialogOpen = () => {
    setOpenAddEventForm(true);
  };

  const handleDialogClose = () => {
    setSelectedEvent(null);
    setOpenAddEventForm(false);
  };

  const handleConfirmDelete = async () => {
    try {
      const result = await deleteEvent(eventIdToDelete);
      if (result?.data) {
        setSuccess("Event deleted successfully");
        setTimeout(() => {
          setError("");
          setSuccess("");
          refetch();
        }, 3000);
      }
    } catch (err) {
      setError(`Server error: ${err?.data?.msg || err?.status}`);
    } finally {
      setOpenConfirmDialog(false);
      setEventIdToDelete(null);
    }
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    handleDialogOpen();
  };

  const handleDelete = (id) => {
    setEventIdToDelete(id);
    setOpenConfirmDialog(true);
  };

  const handleCancelDelete = () => {
    setOpenConfirmDialog(false);
    setEventIdToDelete(null);
  };

  const rows =
    events?.map((event) => ({
      id: event?._id,
      title: event?.title,
      date: new Date(event?.date)?.toLocaleDateString("en-CA", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "America/Vancouver",
      }),
      startTime: event?.startTime,
      endTime: event?.endTime,
      location: event?.location,
      address: event?.address,
      clientName: event?.clientName,
      clientEmail: event?.clientEmail,
      phoneNumber: event?.phoneNumber,
      services: event?.services.join(", "),
      totalSum: event?.totalSum,
      depositSum: event?.depositSum,
      imageUrl: event?.image?.url || "",
      description: event?.description,
      ticketUrl: event?.ticketUrl,
    })) || [];

  const columns = [
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            onClick={() => handleEdit(params?.row)}
            aria-label="edit"
          >
            <Edit />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete(params?.row?.id)}
            aria-label="delete"
          >
            <Delete />
          </IconButton>
        </>
      ),
    },
    { field: "title", headerName: "Title", width: 150 },
    { field: "date", headerName: "Date", width: 150 },
    {
      field: "startTime",
      headerName: "Start Time",
      width: 100,
    },
    {
      field: "endTime",
      headerName: "End Time",
      width: 100,
    },
    {
      field: "clientName",
      headerName: "Client Name",
      width: 150,
    },
    {
      field: "clientEmail",
      headerName: "Client Email",
      width: 200,
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      width: 150,
    },
    {
      field: "services",
      headerName: "Services",
      width: 200,
    },
    {
      field: "totalSum",
      headerName: "Total Sum",
      width: 100,
      valueGetter: (value, row) => (row.totalSum ? `$${row.totalSum}` : ""),
    },
    {
      field: "depositSum",
      headerName: "Deposit Sum",
      width: 100,
      valueGetter: (value, row) => (row.depositSum ? `$${row.depositSum}` : ""),
    },
  ];

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 4,
        }}
      >
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography color="error" sx={{ mt: 4 }}>
        Error loading events.
      </Typography>
    );
  }
  console.log("events", events);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem 0",
        margin: "1rem 0",
        width: "100%",
      }}
    >
      <Typography variant="h4" sx={{ mb: 2, textAlign: "center" }}>
        Events
      </Typography>
      <Button variant="contained" color="primary" onClick={handleDialogOpen}>
        Add New Event
      </Button>
      <Dialog open={openAddEventForm} onClose={handleDialogClose} fullWidth>
        <DialogTitle>
          {selectedEvent ? "Update Event" : "Add a New Event"}
        </DialogTitle>
        <DialogContent>
          <EventAddEdit
            event={selectedEvent}
            onAddSuccess={() => {
              handleDialogClose();
              setSelectedEvent(null);
            }}
            refetchEvents={refetch}
          />
        </DialogContent>
      </Dialog>
      {success && <Alert severity="success">{success}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ height: 600, width: "100%", mt: 2, color: "#ffffff" }}>
        {rows.length > 0 ? (
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            disableSelectionOnClick
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
            No events available.
          </Typography>
        )}
      </Box>
      <ConfirmationDialog
        open={openConfirmDialog}
        title="Delete Event"
        content="Are you sure you want to delete this event? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </Box>
  );
}

export default EventList;
