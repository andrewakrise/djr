// GenerateInvoiceDialog.js
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { pdf } from "@react-pdf/renderer";
import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import { printPlugin } from "@react-pdf-viewer/print";
import { getFilePlugin } from "@react-pdf-viewer/get-file";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/toolbar/lib/styles/index.css";
import "@react-pdf-viewer/zoom/lib/styles/index.css";
import "@react-pdf-viewer/print/lib/styles/index.css";
import EventInvoicePDF from "./EventInvoicePDF";
import { useUploadInvoiceMutation } from "../../../services/event";
import { generateUniqueFileName } from "../../helpers/utils";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Configure dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const GenerateInvoiceDialog = ({ open, onClose, event, refetchEvents }) => {
  const [pdfBlob, setPdfBlob] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showLegalInfo, setShowLegalInfo] = useState(true);
  const [uploadInvoice, { isLoading }] = useUploadInvoiceMutation();

  // Plugins for PDF Viewer
  const zoomPluginInstance = zoomPlugin();
  const printPluginInstance = printPlugin();
  const getFilePluginInstance = getFilePlugin();
  const toolbarPluginInstance = toolbarPlugin();
  const { Toolbar } = toolbarPluginInstance;
  const { ZoomInButton, ZoomOutButton, ZoomPopover } = zoomPluginInstance;
  const { PrintButton } = printPluginInstance;

  useEffect(() => {
    if (event) {
      generatePdf(event);
    }
    // Clean up URL.createObjectURL when component unmounts or event changes
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [event, showLegalInfo]);

  const generatePdf = async (event) => {
    try {
      const blob = await pdf(
        <EventInvoicePDF event={event} showLegalInfo={showLegalInfo} />
      ).toBlob();
      setPdfBlob(blob);
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      setError(`Error generating PDF: ${err.message}`);
    }
  };

  const handleShowLegalInfoChange = () => {
    setShowLegalInfo(!showLegalInfo);
  };

  const handleUploadInvoice = async () => {
    if (!pdfBlob) {
      setError("No PDF to upload");
      return;
    }

    // Use the new datetime format for the filename if available
    let fileName;
    if (event?.startDateTime) {
      const formattedDate = dayjs(event.startDateTime)
        .tz("America/Vancouver")
        .format("YYYY-MM-DD");
      fileName = generateUniqueFileName(
        event?.title,
        formattedDate,
        "Contract-Invoice"
      );
    } else if (event?.date) {
      // Fallback to old date field if startDateTime is not available
      fileName = generateUniqueFileName(
        event?.title,
        event?.date,
        "Contract-Invoice"
      );
    } else {
      fileName = generateUniqueFileName(
        event?.title,
        new Date().toISOString().split("T")[0],
        "Contract-Invoice"
      );
    }

    // console.log("fileName", fileName)
    const formData = new FormData();
    formData.append("pdfInvoice", pdfBlob, `${fileName}.pdf`);

    const result = await uploadInvoice({
      eventId: event?.id,
      formData,
    });

    if (result?.data && result?.data?.event) {
      setSuccess("Invoice uploaded successfully");
      refetchEvents?.();
      onClose();
    } else {
      setError(
        `Error uploading invoice: ${
          result?.error.data?.msg || "Error on the Server"
        }`
      );
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Invoice Preview</DialogTitle>
      <DialogContent dividers style={{ minHeight: "600px" }}>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <FormControlLabel
          control={
            <Checkbox
              checked={showLegalInfo}
              onChange={handleShowLegalInfoChange}
              color="primary"
            />
          }
          label="Include legal information in footer"
          style={{ marginBottom: "10px" }}
        />
        <div style={{ height: "100%", width: "100%" }}>
          {pdfUrl ? (
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  height: "100%",
                  width: "100%",
                }}
              >
                <Toolbar>
                  {(props) => (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      <ZoomOutButton {...props} />
                      <ZoomPopover {...props} />
                      <ZoomInButton {...props} />
                      <PrintButton {...props} />
                    </div>
                  )}
                </Toolbar>
                <div style={{ flexGrow: 1, overflow: "auto", width: "90%" }}>
                  <Viewer
                    fileUrl={pdfUrl}
                    plugins={[
                      toolbarPluginInstance,
                      zoomPluginInstance,
                      printPluginInstance,
                      getFilePluginInstance,
                    ]}
                    defaultScale={SpecialZoomLevel.PageWidth}
                  />
                </div>
              </div>
            </Worker>
          ) : (
            <div
              style={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress />
            </div>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleUploadInvoice}
          color="primary"
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : "Upload Invoice"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GenerateInvoiceDialog;
