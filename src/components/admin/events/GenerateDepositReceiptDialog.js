import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
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

import { useUploadDepositReceiptMutation } from "../../../services/event";
import { generateUniqueFileName } from "../../helpers/utils";
import EventDepositReceiptPDF from "./EventDepositReceiptPDF";

const GenerateDepositReceiptDialog = ({
  open,
  onClose,
  event,
  refetchEvents,
}) => {
  const [pdfBlob, setPdfBlob] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // RTK mutation for uploading the deposit receipt PDF
  const [uploadDepositReceipt, { isLoading }] =
    useUploadDepositReceiptMutation();

  // Plugins for PDF preview
  const zoomPluginInstance = zoomPlugin();
  const printPluginInstance = printPlugin();
  const getFilePluginInstance = getFilePlugin();
  const toolbarPluginInstance = toolbarPlugin();
  const { Toolbar } = toolbarPluginInstance;
  const { ZoomInButton, ZoomOutButton, ZoomPopover } = zoomPluginInstance;
  const { PrintButton } = printPluginInstance;

  useEffect(() => {
    if (event) generatePdf(event);
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [event]);

  const generatePdf = async (eventData) => {
    try {
      const blob = await pdf(
        <EventDepositReceiptPDF event={eventData} />
      ).toBlob();
      setPdfBlob(blob);
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      setError(`Error generating PDF: ${err.message}`);
    }
  };

  const handleUploadDepositReceipt = async () => {
    if (!pdfBlob) {
      setError("No PDF to upload");
      return;
    }
    setError("");
    setSuccess("");

    const fileName = generateUniqueFileName(event?.date, "Deposit Receipt");
    const formData = new FormData();
    formData.append("pdfDepositReceipt", pdfBlob, `${fileName}.pdf`);

    const result = await uploadDepositReceipt({
      eventId: event?.id,
      formData,
    });

    if (result?.data && result?.data?.event) {
      setSuccess("Deposit receipt uploaded successfully!");
      refetchEvents?.();
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setError(
        `Error uploading deposit receipt: ${
          result?.error?.data?.msg || "Server error"
        }`
      );
    }
  };

  const handleClose = () => {
    setError("");
    setSuccess("");
    setPdfBlob(null);
    setPdfUrl("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Deposit Receipt Preview</DialogTitle>
      <DialogContent dividers style={{ minHeight: "600px" }}>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        {!pdfUrl ? (
          <CircularProgress />
        ) : (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <Toolbar>
                {(props) => (
                  <div
                    style={{ display: "flex", gap: "8px", marginBottom: "8px" }}
                  >
                    <ZoomOutButton {...props} />
                    <ZoomPopover {...props} />
                    <ZoomInButton {...props} />
                    <PrintButton {...props} />
                  </div>
                )}
              </Toolbar>
              <div style={{ flexGrow: 1, overflow: "auto" }}>
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
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleUploadDepositReceipt}
          color="primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size={24} />
          ) : (
            "Upload Deposit Receipt"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GenerateDepositReceiptDialog;
