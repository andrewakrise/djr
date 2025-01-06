import React, { useState } from "react";
import {
  useGetAllEventsQuery,
  useDeleteEventMutation,
  useLazyGetInvoiceQuery,
  useLazyGetDepositQuery,
  useConfirmEventMutation,
  useUnconfirmEventMutation,
  useFinalPaymentEventMutation,
  useTogglePublicMutation,
} from "../../services/event";
import { useSendEventEmailWithAttachmentsMutation } from "../../services/emails";
import {
  Typography,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Alert,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EventAddEdit from "./EventAddEdit";
import {
  Delete,
  Edit,
  PictureAsPdf as PictureAsPdfIcon,
  Download,
  Visibility as VisibilityIcon,
  Email as EmailIcon,
  CheckCircle,
  Unpublished,
  Public as PublicIcon,
  PublicOff as PublicOffIcon,
} from "@mui/icons-material";
import ConfirmationDialog from "../helpers/ConfirmationDialog";
import GenerateInvoiceDialog from "./GenerateInvoiceDialog";
import GenerateDepositDialog from "./GenerateDepositDialog";
import { saveAs } from "file-saver";
import { generateUniqueFileName } from "../helpers/utils";
import AdminEventModal from "./AdminEventModal";
import ClientEmailDialog from "./ClientEmailDialog";
import EventConfirmationDialog from "./EventConfirmationDialog";
import EventFinalPaymentDialog from "./EventFinalPaymentDialog";

function EventList() {
  const { data: events, isLoading, isError, refetch } = useGetAllEventsQuery();
  const [deleteEvent] = useDeleteEventMutation();
  const [triggerGetInvoice, { isFetching }] = useLazyGetInvoiceQuery();
  const [triggerGetDeposit, { isFetching: isDepositFetching }] =
    useLazyGetDepositQuery();
  const [sendEventEmail] = useSendEventEmailWithAttachmentsMutation();
  const [confirmEvent, { isLoading: isConfirmEventFetching }] =
    useConfirmEventMutation();
  const [unconfirmEvent, { isLoading: isUnconfirmEventFetching }] =
    useUnconfirmEventMutation();
  const [finalPaymentEvent, { isLoading: isFinalPaymentFetching }] =
    useFinalPaymentEventMutation();
  const [togglePublic, { isLoading: isTogglePublicLoading }] =
    useTogglePublicMutation();

  const [openAddEventForm, setOpenAddEventForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [eventIdToDelete, setEventIdToDelete] = useState(null);
  const [openGenerateInvoiceDialog, setOpenGenerateInvoiceDialog] =
    useState(false);
  const [openGenerateDepositDialog, setOpenGenerateDepositDialog] =
    useState(false);
  const [eventForInvoice, setEventForInvoice] = useState(null);
  const [currentDownloadingId, setCurrentDownloadingId] = useState(null);
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [eventForPreview, setEventForPreview] = useState(null);
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const [openConfirmEventDialog, setOpenConfirmEventDialog] = useState(false);
  const [sendConfirmationEmail, setSendConfirmationEmail] = useState(false);
  const [eventToConfirm, setEventToConfirm] = useState(null);
  const [confirmMode, setConfirmMode] = useState("confirm");
  const [openFinalPaymentDialog, setOpenFinalPaymentDialog] = useState(false);
  const [eventToFinalize, setEventToFinalize] = useState(null);
  const [sendFinalPaymentEmail, setSendFinalPaymentEmail] = useState(false);

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

  const handleOpenGenerateInvoiceDialog = (event) => {
    setEventForInvoice(event);
    setOpenGenerateInvoiceDialog(true);
  };

  const handleCloseGenerateInvoiceDialog = () => {
    setEventForInvoice(null);
    setOpenGenerateInvoiceDialog(false);
  };

  const handleOpenGenerateDepositDialog = (event) => {
    setEventForInvoice(event);
    setOpenGenerateDepositDialog(true);
  };

  const handleCloseGenerateDepositDialog = () => {
    setEventForInvoice(null);
    setOpenGenerateDepositDialog(false);
  };

  const handleDownloadInvoice = async (eventId, eventDate, eventTitle) => {
    try {
      setCurrentDownloadingId(eventId);
      const result = await triggerGetInvoice(eventId).unwrap();
      if (!result) {
        throw new Error("Failed to download Invoice");
      }

      const blob = new Blob([result], { type: "application/pdf" });
      const fileName = generateUniqueFileName(
        eventTitle,
        eventDate,
        "Contract-Invoice"
      );

      saveAs(blob, `${fileName}.pdf`);
    } catch (error) {
      console.error("Error downloading Invoice:", error);
    } finally {
      setCurrentDownloadingId(null);
    }
  };

  const handleDownloadDeposit = async (eventId, eventDate, eventTitle) => {
    try {
      setCurrentDownloadingId(eventId);
      const result = await triggerGetDeposit(eventId).unwrap();
      if (!result) {
        throw new Error("Failed to download Deposit");
      }

      const blob = new Blob([result], { type: "application/pdf" });
      const fileName = generateUniqueFileName(
        eventTitle,
        eventDate,
        "Deposit Bill"
      );

      saveAs(blob, `${fileName}.pdf`);
    } catch (error) {
      console.error("Error downloading Deposit:", error);
    } finally {
      setCurrentDownloadingId(null);
    }
  };

  const handleOpenPreviewDialog = (event) => {
    setEventForPreview(event);
    setOpenPreviewDialog(true);
  };

  const handleClosePreviewDialog = () => {
    setEventForPreview(null);
    setOpenPreviewDialog(false);
  };

  const handleOpenEmailDialog = (event) => {
    setSelectedEvent(event);
    setOpenEmailDialog(true);
  };

  const handleCloseEmailDialog = () => {
    setSelectedEvent(null);
    setOpenEmailDialog(false);
  };

  const handleConfirmEventClick = async (selectedEvent) => {
    setEventToConfirm(selectedEvent);
    setConfirmMode(selectedEvent.isConfirmed ? "unconfirm" : "confirm");
    setOpenConfirmEventDialog(true);
  };

  const handleCloseConfirmEventDialog = () => {
    setConfirmMode("");
    setEventToConfirm(null);
    setOpenConfirmEventDialog(false);
    setSendConfirmationEmail(false);
  };

  const handleOpenFinalPaymentDialog = (event) => {
    setEventToFinalize(event);
    setOpenFinalPaymentDialog(true);
  };

  const handleCloseFinalPaymentDialog = () => {
    setEventToFinalize(null);
    setOpenFinalPaymentDialog(false);
    setSendFinalPaymentEmail(false);
  };

  const handleTogglePublic = async (row) => {
    try {
      const { eventId } = row;
      console.log("handleTogglePublic eventId", eventId);
      const result = await togglePublic(eventId).unwrap();
      console.log("handleTogglePublic result", result);
      if (result?.event) {
        setSuccess(
          result?.msg || "Public/Private status updated successfully"
        );
        refetch?.();
      }
    } catch (err) {
      setError(`Server error: ${err?.data?.msg || err?.status}`);
    }
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
      clientCompanyName: event?.clientCompanyName,
      clientEmail: event?.clientEmail,
      phoneNumber: event?.phoneNumber,
      services: event?.services.join(", "),
      totalSum: event?.totalSum,
      depositSum: event?.depositSum,
      imageUrl: event?.image?.url || "",
      description: event?.description,
      ticketUrl: event?.ticketUrl,
      pdfInvoice: event?.pdfInvoice,
      pdfDeposit: event?.pdfDeposit,
      isPublic: event?.isPublic,
      isConfirmed: event?.isConfirmed,
      isFullyPaid: event?.isFullyPaid,
    })) || [];

  const columns = [
    {
      field: "actions",
      headerName: "Actions",
      width: 225,
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
          <IconButton
            color="secondary"
            onClick={() => handleOpenGenerateInvoiceDialog(params?.row)}
            aria-label="generate-invoice"
          >
            <PictureAsPdfIcon />
          </IconButton>
          <IconButton
            color="success"
            onClick={() => handleOpenGenerateDepositDialog(params?.row)}
            aria-label="generate-invoice"
          >
            <PictureAsPdfIcon />
          </IconButton>
          <IconButton
            color="info"
            onClick={() => handleOpenPreviewDialog(params?.row)}
            aria-label="preview"
          >
            <VisibilityIcon />
          </IconButton>
        </>
      ),
    },
    {
      field: "invoice",
      headerName: "Inv/Dep",
      width: 100,
      renderCell: (params) => (
        <>
          {params?.row?.pdfInvoice && (
            <Tooltip title="Download Invoice">
              <IconButton
                color="secondary"
                onClick={() =>
                  handleDownloadInvoice(
                    params.row.id,
                    params.row.date,
                    params.row.title
                  )
                }
                aria-label="download-invoice"
              >
                {isFetching && currentDownloadingId === params?.row?.id ? (
                  <CircularProgress />
                ) : (
                  <Download />
                )}
              </IconButton>
            </Tooltip>
          )}
          {params?.row?.pdfDeposit && (
            <Tooltip title="Download Deposit">
              <IconButton
                color="success"
                onClick={() =>
                  handleDownloadDeposit(
                    params.row.id,
                    params.row.date,
                    params.row.title
                  )
                }
                aria-label="download-deposit"
              >
                {isDepositFetching &&
                currentDownloadingId === params?.row?.id ? (
                  <CircularProgress />
                ) : (
                  <Download />
                )}
              </IconButton>
            </Tooltip>
          )}
          {!params?.row?.pdfInvoice && !params?.row?.pdfDeposit && (
            <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
              No File
            </Typography>
          )}
        </>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      width: 55,
      renderCell: (params) => (
        <Tooltip title="Send Email to Client">
          <IconButton
            color="primary"
            onClick={() => handleOpenEmailDialog(params?.row)}
            aria-label="send-email"
          >
            <EmailIcon />
          </IconButton>
        </Tooltip>
      ),
    },
    {
      field: "Confirm",
      headerName: "Confirm",
      width: 70,
      renderCell: (params) => {
        const confirmed = params?.row?.isConfirmed;
        return (
          <Tooltip title="Confirm the Event payment reaceived">
            <IconButton
              color="warning"
              onClick={() => handleConfirmEventClick(params?.row)}
              aria-label="confirm-event"
            >
              {confirmed ? <CheckCircle /> : <Unpublished />}
            </IconButton>
          </Tooltip>
        );
      },
    },
    {
      field: "isPublic",
      headerName: "Public",
      width: 70,
      renderCell: (params) => {
        const { isPublic } = params.row;
        return (
          <Tooltip title={isPublic ? "Set to Private" : "Set to Public"}>
            <IconButton
              color={isPublic ? "success" : "warning"}
              onClick={() => handleTogglePublic({ eventId: params.row.id })}
              aria-label="toggle-public"
            >
              {isPublic ? <PublicIcon /> : <PublicOffIcon />}
            </IconButton>
          </Tooltip>
        );
      },
    },
    {
      field: "donePayto",
      headerName: "Done/Awaiting",
      width: 120,
      renderCell: (params) => {
        const confirmed = params?.row?.isConfirmed;
        // We'll also read isFullyPaid:
        const fullyPaid = params?.row?.isFullyPaid;

        // 1) If deposit not paid (isConfirmed = false), display something like "N/A" or disable button
        // 2) If deposit is paid (isConfirmed = true) but final NOT paid (isFullyPaid = false)
        // 3) If final is fully paid, show "Done Payment"

        const eventDate = new Date(params.row.date);
        const today = new Date();
        const dateHasPassed = eventDate < today;
        const finalPaymentSum =
          params?.row?.totalSum - params?.row?.depositSum || 0;

        // Let's define the text or the button:
        if (!confirmed) {
          return <Typography variant="body2">Await Deposit</Typography>;
        } else if (confirmed && !fullyPaid) {
          if (!dateHasPassed) {
            // date not passed, show "In Progress" (still future event)
            return <Typography variant="body2">In Progress</Typography>;
          } else {
            // date has passed, but final not paid => show a button to confirm final payment
            return (
              <Tooltip title="Confirm final payment">
                <IconButton
                  color="success"
                  onClick={() => handleOpenFinalPaymentDialog(params?.row)}
                >
                  <Unpublished /> ${finalPaymentSum}
                </IconButton>
              </Tooltip>
            );
          }
        } else if (fullyPaid) {
          return (
            <Typography
              variant="body2"
              color="success.main"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: "0.5rem",
                height: "100%",
              }}
            >
              <CheckCircle /> Done
            </Typography>
          );
        }
      },
    },
    {
      field: "clientName",
      headerName: "Client Name",
      width: 150,
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
      field: "clientCompanyName",
      headerName: "Company/Venue",
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
  // console.log("events", events);
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
        {rows?.length > 0 ? (
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
      <GenerateInvoiceDialog
        open={openGenerateInvoiceDialog}
        onClose={handleCloseGenerateInvoiceDialog}
        event={eventForInvoice}
        refetchEvents={refetch}
      />
      <GenerateDepositDialog
        open={openGenerateDepositDialog}
        onClose={handleCloseGenerateDepositDialog}
        event={eventForInvoice}
        refetchEvents={refetch}
      />
      <AdminEventModal
        open={openPreviewDialog}
        onClose={handleClosePreviewDialog}
        event={eventForPreview}
      />
      <ClientEmailDialog
        open={openEmailDialog}
        onClose={handleCloseEmailDialog}
        event={selectedEvent}
        sendEventEmail={sendEventEmail}
      />
      <EventConfirmationDialog
        open={openConfirmEventDialog}
        onClose={() => {
          setEventToConfirm(null);
          setOpenConfirmEventDialog(false);
          setSendConfirmationEmail(false);
        }}
        onConfirmEvent={
          confirmMode === "confirm" ? confirmEvent : unconfirmEvent
        }
        event={eventToConfirm}
        sendConfirmationEmail={sendConfirmationEmail}
        setSendConfirmationEmail={setSendConfirmationEmail}
        refetch={refetch}
        setSuccess={setSuccess}
        setError={setError}
        isConfirmEventFetching={
          isConfirmEventFetching || isUnconfirmEventFetching
        }
        confirmMode={confirmMode}
      />
      <EventFinalPaymentDialog
        open={openFinalPaymentDialog}
        onClose={handleCloseFinalPaymentDialog}
        onFinalPayment={finalPaymentEvent}
        event={eventToFinalize}
        sendFinalPaymentEmail={sendFinalPaymentEmail}
        setSendFinalPaymentEmail={setSendFinalPaymentEmail}
        refetch={refetch}
        setSuccess={setSuccess}
        setError={setError}
        isFinalPaymentFetching={isFinalPaymentFetching}
      />
    </Box>
  );
}

export default EventList;
