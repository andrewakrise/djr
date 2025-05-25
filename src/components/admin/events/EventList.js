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
  useLazyGetFinalQuery,
  useLazyGetReceiptQuery,
  useGetEventImageUrlQuery,
} from "../../../services/event";
import { useSendEventEmailWithAttachmentsMutation } from "../../../services/emails";
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
  Add as AddIcon,
} from "@mui/icons-material";
import ConfirmationDialog from "../../helpers/ConfirmationDialog";
import GenerateInvoiceDialog from "./GenerateInvoiceDialog";
import GenerateDepositDialog from "./GenerateDepositDialog";
import { saveAs } from "file-saver";
import {
  generateUniqueFileName,
  convertTo12HourFormat,
} from "../../helpers/utils";
import AdminEventModal from "./AdminEventModal";
import ClientEmailDialog from "../ClientEmailDialog";
import EventConfirmationDialog from "./EventConfirmationDialog";
import EventFinalPaymentDialog from "./EventFinalPaymentDialog";
import GenerateFinalDialog from "./GenerateFinalDialog";
import EventFinalEmailDialog from "./EventFinalEmailDialog";
import GenerateReceiptDialog from "./GenerateReceiptDialog";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import GenerateDepositReceiptDialog from "./GenerateDepositReceiptDialog";
import { useLazyGetDepositReceiptQuery } from "../../../services/event";
import { gradient } from "../../helpers/utils";

dayjs.extend(utc);
dayjs.extend(timezone);

function EventList() {
  const { data: events, isLoading, isError, refetch } = useGetAllEventsQuery();
  const [deleteEvent] = useDeleteEventMutation();

  const [triggerGetInvoice, { isFetching }] = useLazyGetInvoiceQuery();
  const [triggerGetDeposit, { isFetching: isDepositFetching }] =
    useLazyGetDepositQuery();
  const [triggerGetFinal, { isFetching: isFinalFetching }] =
    useLazyGetFinalQuery();

  const [sendEventEmail] = useSendEventEmailWithAttachmentsMutation();

  const [confirmEvent, { isLoading: isConfirmEventFetching }] =
    useConfirmEventMutation();
  const [unconfirmEvent, { isLoading: isUnconfirmEventFetching }] =
    useUnconfirmEventMutation();
  const [finalPaymentEvent, { isLoading: isFinalPaymentFetching }] =
    useFinalPaymentEventMutation();
  const [togglePublic, { isLoading: isTogglePublicLoading }] =
    useTogglePublicMutation();

  const [triggerGetReceipt, { isFetching: isReceiptFetching }] =
    useLazyGetReceiptQuery();
  const [currentDownloadingReceiptId, setCurrentDownloadingReceiptId] =
    useState(null);

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

  const [openGenerateFinalDialog, setOpenGenerateFinalDialog] = useState(false);
  const [eventForFinal, setEventForFinal] = useState(null);
  const [currentDownloadingFinalId, setCurrentDownloadingFinalId] =
    useState(null);

  const [openFinalEmailDialog, setOpenFinalEmailDialog] = useState(false);
  const [eventForFinalEmail, setEventForFinalEmail] = useState(null);

  const [openGenerateReceiptDialog, setOpenGenerateReceiptDialog] =
    useState(false);
  const [eventForReceipt, setEventForReceipt] = useState(null);

  const [
    openGenerateDepositReceiptDialog,
    setOpenGenerateDepositReceiptDialog,
  ] = useState(false);
  const [eventForDepositReceipt, setEventForDepositReceipt] = useState(null);
  const [triggerGetDepositReceipt, { isFetching: isDepositReceiptFetching }] =
    useLazyGetDepositReceiptQuery();
  const [
    currentDownloadingDepositReceiptId,
    setCurrentDownloadingDepositReceiptId,
  ] = useState(null);

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

  const handleEdit = (row) => {
    const originalEvent = events?.find((e) => e._id === row.id);
    setSelectedEvent(originalEvent || row);
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

      if (result.type === "application/json") {
        const textData = await result.text();
        const jsonData = JSON.parse(textData);
        console.warn("No invoice file:", jsonData.msg);
        setError(jsonData.msg || "No invoice file available.");
        return;
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
      setError(`Error downloading Invoice: ${error?.msg || error?.status}`);
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

      if (result.type === "application/json") {
        const textData = await result.text();
        const jsonData = JSON.parse(textData);
        console.warn("No deposit file:", jsonData.msg);
        setError(jsonData.msg || "No deposit file available.");
        return;
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
      setError(`Error downloading Deposit: ${error?.msg || error?.status}`);
    } finally {
      setCurrentDownloadingId(null);
    }
  };

  const handleDownloadReceipt = async (eventId, eventDate, eventTitle) => {
    try {
      setCurrentDownloadingReceiptId(eventId);
      const result = await triggerGetReceipt(eventId).unwrap();
      if (!result) {
        throw new Error("Failed to download the receipt");
      }

      if (result.type === "application/json") {
        const textData = await result.text();
        const jsonData = JSON.parse(textData);
        console.warn("No final receipt file:", jsonData.msg);
        setError(jsonData.msg || "No receipt file available.");
        return;
      }

      const blob = new Blob([result], { type: "application/pdf" });
      const fileName = generateUniqueFileName(
        eventTitle,
        eventDate,
        "Paid Receipt"
      );
      saveAs(blob, `${fileName}.pdf`);
    } catch (error) {
      setError(`Error downloading receipt: ${error.message}`);
    } finally {
      setCurrentDownloadingReceiptId(null);
    }
  };

  const handleOpenPreviewDialog = (row) => {
    const originalEvent = events?.find((e) => e._id === row.id);
    setEventForPreview(originalEvent || row);
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
        setSuccess(result?.msg || "Public/Private status updated successfully");
        refetch?.();
      }
    } catch (err) {
      setError(`Server error: ${err?.data?.msg || err?.status}`);
    }
  };

  const handleOpenGenerateFinalDialog = (event) => {
    setEventForFinal(event);
    setOpenGenerateFinalDialog(true);
  };

  const handleCloseGenerateFinalDialog = () => {
    setEventForFinal(null);
    setOpenGenerateFinalDialog(false);
  };

  const handleDownloadFinal = async (eventId, eventDate, eventTitle) => {
    try {
      setCurrentDownloadingFinalId(eventId);
      const result = await triggerGetFinal(eventId).unwrap();
      if (!result) {
        throw new Error("Failed to download Final Bill");
      }

      if (result.type === "application/json") {
        const textData = await result.text();
        const jsonData = JSON.parse(textData);
        console.warn("No final file:", jsonData.msg);
        setError(jsonData.msg || "No final file available.");
        return;
      }

      const blob = new Blob([result], { type: "application/pdf" });
      const fileName = generateUniqueFileName(
        eventTitle,
        eventDate,
        "Final Bill"
      );
      saveAs(blob, `${fileName}.pdf`);
    } catch (error) {
      console.error("Error downloading Final Bill:", error);
      setError(`Error downloading Final Bill: ${error.message}`);
    } finally {
      setCurrentDownloadingFinalId(null);
    }
  };

  const handleOpenFinalEmailDialog = (event) => {
    setEventForFinalEmail(event);
    setOpenFinalEmailDialog(true);
  };

  const handleCloseFinalEmailDialog = () => {
    setEventForFinalEmail(null);
    setOpenFinalEmailDialog(false);
  };

  const handleOpenGenerateReceiptDialog = (event) => {
    setEventForReceipt(event);
    setOpenGenerateReceiptDialog(true);
  };

  const handleCloseGenerateReceiptDialog = () => {
    setOpenGenerateReceiptDialog(false);
    setEventForReceipt(null);
  };

  const handleOpenGenerateDepositReceiptDialog = (event) => {
    setEventForDepositReceipt(event);
    setOpenGenerateDepositReceiptDialog(true);
  };

  const handleCloseGenerateDepositReceiptDialog = () => {
    setEventForDepositReceipt(null);
    setOpenGenerateDepositReceiptDialog(false);
  };

  const handleDownloadDepositReceipt = async (
    eventId,
    eventDate,
    eventTitle
  ) => {
    try {
      setCurrentDownloadingDepositReceiptId(eventId);
      const result = await triggerGetDepositReceipt(eventId).unwrap();
      if (!result) {
        throw new Error("Failed to download deposit receipt");
      }
      if (result.type === "application/json") {
        const textData = await result.text();
        const jsonData = JSON.parse(textData);
        setError(jsonData.msg || "No deposit receipt file available.");
        return;
      }
      const blob = new Blob([result], { type: "application/pdf" });
      const fileName = generateUniqueFileName(
        eventTitle,
        eventDate,
        "Deposit Receipt"
      );
      saveAs(blob, `${fileName}.pdf`);
    } catch (error) {
      setError(`Error downloading deposit receipt: ${error.message}`);
    } finally {
      setCurrentDownloadingDepositReceiptId(null);
    }
  };

  const rows =
    events?.map((event) => ({
      id: event?._id,
      eventSummary: {
        title: event?.title,
        clientName: event?.clientName,
        startDateTime: event?.startDateTime
          ? dayjs(event.startDateTime)
              .tz("America/Vancouver")
              .format("MMMM D, YYYY h:mm A")
          : event?.date && event?.startTime
          ? `${dayjs(event.date).format(
              "MMMM D, YYYY"
            )} ${convertTo12HourFormat(event.startTime)}`
          : "",
        endDateTime: event?.endDateTime
          ? dayjs(event.endDateTime)
              .tz("America/Vancouver")
              .format("MMMM D, YYYY h:mm A")
          : event?.date && event?.endTime
          ? `${dayjs(event.date).format(
              "MMMM D, YYYY"
            )} ${convertTo12HourFormat(event.endTime)}`
          : "",
      },
      clientInfo: {
        clientCompanyName: event?.clientCompanyName,
        clientEmail: event?.clientEmail,
        phoneNumber: event?.phoneNumber,
        location: event?.location,
        address: event?.address,
      },
      expensesSummary: {
        equipmentExpense: event?.expenses?.equipment || 0,
        carExpense: event?.expenses?.car || 0,
        foodExpense: event?.expenses?.food || 0,
        otherExpenses: event?.expenses?.other || [],
      },
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
      eventDate: event?.startDateTime
        ? dayjs(event.startDateTime).tz("America/Vancouver").startOf("day")
        : event?.date
        ? dayjs(event.date).tz("America/Vancouver").startOf("day")
        : null,
    })) || [];

  const eventDateRows =
    events?.map((event) => ({
      id: event?._id,
      title: event?.title,
      clientName: event?.clientName,
      startDateTime: event?.startDateTime
        ? dayjs(event.startDateTime)
            .tz("America/Vancouver")
            .format("MMMM D, YYYY h:mm A")
        : event?.date && event?.startTime
        ? `${dayjs(event.date).format("MMMM D, YYYY")} ${convertTo12HourFormat(
            event.startTime
          )}`
        : "",
      endDateTime: event?.endDateTime
        ? dayjs(event.endDateTime)
            .tz("America/Vancouver")
            .format("MMMM D, YYYY h:mm A")
        : event?.date && event?.endTime
        ? `${dayjs(event.date).format("MMMM D, YYYY")} ${convertTo12HourFormat(
            event.endTime
          )}`
        : "",
      clientCompanyName: event?.clientCompanyName,
      clientEmail: event?.clientEmail,
      phoneNumber: event?.phoneNumber,
      location: event?.location,
      address: event?.address,
      equipmentExpense: event?.expenses?.equipment || 0,
      carExpense: event?.expenses?.car || 0,
      foodExpense: event?.expenses?.food || 0,
      otherExpenses: event?.expenses?.other || [],
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
      eventDate: event?.startDateTime
        ? dayjs(event.startDateTime).tz("America/Vancouver").startOf("day")
        : event?.date
        ? dayjs(event.date).tz("America/Vancouver").startOf("day")
        : null,
    })) || [];

  const today = dayjs().tz("America/Vancouver").startOf("day");
  const todayEvents = rows?.filter(
    (row) => row.eventDate && row.eventDate.isSame(today)
  );

  const upcomingEvents = rows
    .filter((row) => row.eventDate && row.eventDate.isAfter(today))
    .sort((a, b) => a.eventDate.valueOf() - b.eventDate.valueOf());

  const nextEventDate =
    upcomingEvents.length > 0 ? upcomingEvents[0].eventDate : null;
  const nextEvents = nextEventDate
    ? rows.filter((row) => row.eventDate && row.eventDate.isSame(nextEventDate))
    : [];

  const eventsToHighlight = todayEvents.length > 0 ? todayEvents : nextEvents;
  const highlightedEventIds = eventsToHighlight.map((event) => event.id);

  const columns = [
    {
      field: "eventSummary",
      headerName: "Event / Client / Date",
      width: window.innerWidth < 768 ? 155 : 225,
      renderCell: (params) => {
        const { title, clientName, startDateTime, endDateTime } =
          params.value || {};
        const { clientCompanyName, clientEmail, phoneNumber } =
          params?.row?.clientInfo || {};
        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              whiteSpace: "pre-line",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: { xs: 500, sm: 600 },
                fontSize: { xs: "0.8rem", sm: "1rem" },
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#b0bec5",
                fontSize: { xs: "0.7rem", sm: "0.875rem" },
              }}
            >
              {clientName}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: "0.7rem", sm: "0.875rem" },
              }}
            >
              {startDateTime}
              {endDateTime ? `\n${endDateTime}` : ""}
            </Typography>

            {/* Client Info Section */}
            <Box sx={{ mt: 1, pt: 1, borderTop: "1px solid #374151" }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  fontSize: { xs: "0.7rem", sm: "0.875rem" },
                }}
              >
                {clientCompanyName}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#b0bec5",
                  fontSize: { xs: "0.7rem", sm: "0.875rem" },
                }}
              >
                {clientEmail}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: "0.7rem", sm: "0.875rem" },
                }}
              >
                {phoneNumber}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 275,
      renderCell: (params) => {
        // Get the original event data
        const originalEvent = eventDateRows?.find(
          (e) => e?.id === params?.row?.id
        );
        const eventData = originalEvent;

        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
              py: 1,
            }}
          >
            {/* Line 1: Basic Actions */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                borderBottom: "1px solid #374151",
                pb: 0.5,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  minWidth: "2rem",
                  fontSize: "0.6rem",
                  color: "#9ca3af",
                  fontWeight: 500,
                }}
              >
                Setup:
              </Typography>
              <IconButton
                color="primary"
                onClick={() => handleEdit(params?.row)}
                aria-label="edit"
                size="small"
              >
                <Edit />
              </IconButton>
              <IconButton
                color="error"
                onClick={() => handleDelete(params?.row?.id)}
                aria-label="delete"
                size="small"
              >
                <Delete />
              </IconButton>
              <IconButton
                color="info"
                onClick={() => handleOpenPreviewDialog(params?.row)}
                aria-label="preview"
                size="small"
              >
                <VisibilityIcon />
              </IconButton>
              <Tooltip
                title={
                  params?.row?.isPublic ? "Set to Private" : "Set to Public"
                }
              >
                <IconButton
                  color={params?.row?.isPublic ? "success" : "warning"}
                  onClick={() =>
                    handleTogglePublic({ eventId: params?.row?.id })
                  }
                  aria-label="toggle-public"
                  size="small"
                >
                  {params?.row?.isPublic ? <PublicIcon /> : <PublicOffIcon />}
                </IconButton>
              </Tooltip>
            </Box>

            {/* Line 2: Invoice/Deposit & Email */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                borderBottom: "1px solid #374151",
                pb: 0.5,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  minWidth: "2rem",
                  fontSize: "0.6rem",
                  color: "#9ca3af",
                  fontWeight: 500,
                }}
              >
                Bills:
              </Typography>
              <Tooltip title="Generate Invoice">
                <IconButton
                  color="secondary"
                  onClick={() => handleOpenGenerateInvoiceDialog(eventData)}
                  aria-label="generate-invoice"
                  size="small"
                >
                  <PictureAsPdfIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Download Invoice">
                <IconButton
                  color="secondary"
                  onClick={() =>
                    handleDownloadInvoice(
                      params?.row?.id,
                      eventData?.startDateTime || eventData?.date,
                      eventData?.title
                    )
                  }
                  aria-label="download-invoice"
                  size="small"
                >
                  {isFetching && currentDownloadingId === params?.row?.id ? (
                    <CircularProgress size={16} />
                  ) : (
                    <Download />
                  )}
                </IconButton>
              </Tooltip>
              <Tooltip title="Generate Deposit">
                <IconButton
                  color="success"
                  onClick={() => handleOpenGenerateDepositDialog(eventData)}
                  aria-label="generate-deposit"
                  size="small"
                >
                  <PictureAsPdfIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Download Deposit">
                <IconButton
                  color="success"
                  onClick={() =>
                    handleDownloadDeposit(
                      params?.row?.id,
                      eventData?.startDateTime || eventData?.date,
                      eventData?.title
                    )
                  }
                  aria-label="download-deposit"
                  size="small"
                >
                  {isDepositFetching &&
                  currentDownloadingId === params?.row?.id ? (
                    <CircularProgress size={16} />
                  ) : (
                    <Download />
                  )}
                </IconButton>
              </Tooltip>
              <Tooltip title="Send Email to Client">
                <IconButton
                  color="primary"
                  onClick={() => handleOpenEmailDialog(eventData)}
                  aria-label="send-email"
                  size="small"
                >
                  <EmailIcon />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Line 3: Deposit Receipt & Confirm */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                borderBottom: "1px solid #374151",
                pb: 0.5,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  minWidth: "2rem",
                  fontSize: "0.6rem",
                  color: "#9ca3af",
                  fontWeight: 500,
                }}
              >
                Deposit:
              </Typography>
              <Tooltip title="Generate Deposit Receipt">
                <IconButton
                  color="primary"
                  onClick={() =>
                    handleOpenGenerateDepositReceiptDialog(eventData)
                  }
                  aria-label="generate-deposit-receipt"
                  size="small"
                >
                  <PictureAsPdfIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Download Deposit Receipt">
                <IconButton
                  color="primary"
                  onClick={() =>
                    handleDownloadDepositReceipt(
                      params?.row?.id,
                      eventData?.startDateTime || eventData?.date,
                      eventData?.title
                    )
                  }
                  aria-label="download-deposit-receipt"
                  size="small"
                >
                  {isDepositReceiptFetching &&
                  currentDownloadingDepositReceiptId === params?.row?.id ? (
                    <CircularProgress size={16} />
                  ) : (
                    <Download />
                  )}
                </IconButton>
              </Tooltip>
              <Tooltip title="Confirm the Event payment received">
                <IconButton
                  color="warning"
                  onClick={() => handleConfirmEventClick(params?.row)}
                  aria-label="confirm-event"
                  size="small"
                >
                  {params?.row?.isConfirmed ? <CheckCircle /> : <Unpublished />}
                </IconButton>
              </Tooltip>
            </Box>

            {/* Line 4: Final Bill & Receipt */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  minWidth: "1rem",
                  fontSize: "0.6rem",
                  color: "#9ca3af",
                  fontWeight: 500,
                }}
              >
                Final:
              </Typography>
              <Tooltip title="Generate Final Bill">
                <IconButton
                  color="warning"
                  onClick={() => handleOpenGenerateFinalDialog(eventData)}
                  size="small"
                >
                  <PictureAsPdfIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Download Final Bill">
                <IconButton
                  color="info"
                  onClick={() =>
                    handleDownloadFinal(
                      params?.row?.id,
                      eventData?.startDateTime || eventData?.date,
                      eventData?.title
                    )
                  }
                  size="small"
                >
                  {isFinalFetching &&
                  currentDownloadingFinalId === params?.row?.id ? (
                    <CircularProgress size={16} />
                  ) : (
                    <Download />
                  )}
                </IconButton>
              </Tooltip>
              <Tooltip title="Send Final Bill Email to Client">
                <IconButton
                  color="primary"
                  onClick={() => handleOpenFinalEmailDialog(eventData)}
                  size="small"
                >
                  <EmailIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Generate Paid Receipt">
                <IconButton
                  color="primary"
                  onClick={() => handleOpenGenerateReceiptDialog(eventData)}
                  size="small"
                >
                  <PictureAsPdfIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Download Paid Receipt">
                <IconButton
                  color="success"
                  onClick={() =>
                    handleDownloadReceipt(
                      params?.row?.id,
                      eventData?.startDateTime || eventData?.date,
                      eventData?.title
                    )
                  }
                  size="small"
                >
                  {isReceiptFetching &&
                  currentDownloadingReceiptId === params?.row?.id ? (
                    <CircularProgress size={16} />
                  ) : (
                    <Download />
                  )}
                </IconButton>
              </Tooltip>
              {/* Final Payment Button - only show if confirmed but not fully paid */}
              <Tooltip
                title={`${
                  params?.row?.isConfirmed && params?.row?.isFullyPaid
                    ? "Final payment received ✓"
                    : "Confirm final payment received"
                }`}
              >
                <IconButton
                  color="success"
                  onClick={() =>
                    handleOpenFinalPaymentDialog({
                      ...eventData,
                      id: params?.row?.id,
                    })
                  }
                  size="small"
                >
                  <Unpublished />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        );
      },
    },
    {
      field: "paymentStatus",
      headerName: "Status & Payment",
      width: 200,
      renderCell: (params) => {
        const confirmed = params?.row?.isConfirmed;
        const fullyPaid = params?.row?.isFullyPaid;
        const totalSum = params?.row?.totalSum || 0;
        const depositSum = params?.row?.depositSum || 0;

        // Calculate remaining amount based on payment status
        let remainingAmount = 0;
        let remainingLabel = "";
        let statusText = "";
        let statusColor = "#ffffff";

        if (!confirmed) {
          remainingAmount = depositSum;
          remainingLabel = "Awaiting Deposit";
          statusText = "Await Deposit";
          statusColor = "#ff9800"; // orange
        } else if (confirmed && !fullyPaid) {
          remainingAmount = totalSum - depositSum;
          remainingLabel = "Remaining Final";
          statusText = "In Progress";
          statusColor = "#2196f3"; // blue
        } else if (fullyPaid) {
          remainingAmount = 0;
          remainingLabel = "";
          statusText = "Done";
          statusColor = "#4caf50"; // green
        }
        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              whiteSpace: "pre-line",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: statusColor,
                mb: 0.5,
              }}
            >
              {statusText}
            </Typography>
            <Typography variant="body2">Total: ${totalSum}</Typography>
            <Typography variant="body2" mt={0.25}>
              Deposit: ${depositSum}
            </Typography>
            {remainingAmount > 0 && (
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: "#ff5722",
                  borderTop: "1px solid #374151",
                  pt: 0.25,
                  mt: 0.25,
                }}
              >
                {remainingLabel}: ${remainingAmount}
              </Typography>
            )}
            {remainingAmount === 0 && fullyPaid && (
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: "#4caf50",
                  borderTop: "1px solid #374151",
                  pt: 0.5,
                  mt: 0.5,
                }}
              >
                Paid in Full ✓
              </Typography>
            )}
          </Box>
        );
      },
    },
    {
      field: "otherExpenses",
      headerName: "Expenses",
      width: 175,
      renderCell: (params) => {
        const { equipmentExpense, carExpense, foodExpense, otherExpenses } =
          params?.row?.expensesSummary || {};

        // Calculate total expenses
        const otherExpensesTotal =
          otherExpenses && otherExpenses.length > 0
            ? otherExpenses.reduce(
                (sum, expense) => sum + (Number(expense?.amount) || 0),
                0
              )
            : 0;
        const totalExpenses =
          (equipmentExpense || 0) +
          (carExpense || 0) +
          (foodExpense || 0) +
          otherExpensesTotal;

        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              whiteSpace: "pre-line",
            }}
          >
            <Typography variant="body2">
              Equipment: ${equipmentExpense}
            </Typography>
            <Typography variant="body2">Car: ${carExpense}</Typography>
            <Typography variant="body2">Food: ${foodExpense}</Typography>
            {otherExpenses &&
              otherExpenses.length > 0 &&
              otherExpenses.map((o, idx) => (
                <Typography variant="body2" key={idx}>
                  {o?.description}: ${o?.amount}
                </Typography>
              ))}
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                borderTop: "1px solid #374151",
                pt: 0.05,
                mt: 0.05,
              }}
            >
              Total: ${totalExpenses}
            </Typography>
          </Box>
        );
      },
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
        padding: "0.5rem 0",
        margin: 0,
        width: "100%",
      }}
    >
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleDialogOpen}
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
        Event
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
      <Box
        sx={{
          height: { xs: 600, md: "calc(100vh - 12rem)" },
          width: "100%",
          mt: 1,
          color: "#ffffff",
        }}
      >
        {rows?.length > 0 ? (
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            disableSelectionOnClick
            getRowHeight={() => "auto"}
            getRowClassName={(params) =>
              highlightedEventIds.includes(params.id)
                ? "highlighted-event-row"
                : ""
            }
            sx={{
              ".MuiDataGrid-cell": {
                whiteSpace: "normal",
                wordWrap: "break-word",
                color: "#ffffff",
                borderRight: "1px solid #374151",
              },
              ".MuiDataGrid-columnHeaders": {
                borderBottom: "1px solid #374151",
              },
              ".MuiDataGrid-cell:last-of-type": {
                borderRight: "none",
              },
              "& .highlighted-event-row": {
                backgroundColor: "rgba(68, 160, 141, 0.2)",
                "&:hover": {
                  backgroundColor: "rgba(68, 160, 141, 0.3)",
                },
              },
              "& .highlighted-event-row .MuiDataGrid-cell": {
                borderRight: "1px solid rgba(68, 160, 141, 0.5)",
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
      <GenerateFinalDialog
        open={openGenerateFinalDialog}
        onClose={handleCloseGenerateFinalDialog}
        event={eventForFinal}
        refetchEvents={refetch}
      />
      <EventFinalEmailDialog
        open={openFinalEmailDialog}
        onClose={handleCloseFinalEmailDialog}
        event={eventForFinalEmail}
      />
      <GenerateReceiptDialog
        open={openGenerateReceiptDialog}
        onClose={handleCloseGenerateReceiptDialog}
        event={eventForReceipt}
        refetchEvents={refetch}
      />
      <GenerateDepositReceiptDialog
        open={openGenerateDepositReceiptDialog}
        onClose={handleCloseGenerateDepositReceiptDialog}
        event={eventForDepositReceipt}
        refetchEvents={refetch}
      />
    </Box>
  );
}

export default EventList;
