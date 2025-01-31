// src/components/admin/GenerateReceiptDialog.js
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

import { useUploadReceiptMutation } from "../../services/event";
import { generateUniqueFileName } from "../helpers/utils";
import EventReceiptPDF from "./EventReceiptPDF";

const GenerateReceiptDialog = ({ open, onClose, event, refetchEvents }) => {
  const [pdfBlob, setPdfBlob] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Our RTK mutation for uploading the "receipt" PDF
  const [uploadReceipt, { isLoading }] = useUploadReceiptMutation();

  // Plugins for PDF preview
  const zoomPluginInstance = zoomPlugin();
  const printPluginInstance = printPlugin();
  const getFilePluginInstance = getFilePlugin();
  const toolbarPluginInstance = toolbarPlugin();
  const { Toolbar } = toolbarPluginInstance;
  const { ZoomInButton, ZoomOutButton, ZoomPopover } = zoomPluginInstance;
  const { PrintButton } = printPluginInstance;

  // Whenever the dialog opens with a given event, generate the PDF
  useEffect(() => {
    if (event) generatePdf(event);
    return () => {
      // Clean up object URLs
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [event]);

  const generatePdf = async (eventData) => {
    try {
      const blob = await pdf(<EventReceiptPDF event={eventData} />).toBlob();
      setPdfBlob(blob);
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      setError(`Error generating PDF: ${err.message}`);
    }
  };

  // Upload the finished receipt PDF to the server
  const handleUploadReceipt = async () => {
    if (!pdfBlob) {
      setError("No PDF to upload");
      return;
    }
    setError("");
    setSuccess("");

    // Generate a name for the saved PDF
    const fileName = generateUniqueFileName(event?.date, "Paid Receipt");

    const formData = new FormData();
    formData.append("pdfReceipt", pdfBlob, `${fileName}.pdf`);

    const result = await uploadReceipt({
      eventId: event?.id, //
      formData,
    });

    if (result?.data && result?.data?.event) {
      setSuccess("Receipt uploaded successfully!");
      refetchEvents?.();
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setError(
        `Error uploading receipt: ${result?.error?.data?.msg || "Server error"}`
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
      <DialogTitle>Paid Receipt Preview</DialogTitle>
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
          onClick={handleUploadReceipt}
          color="primary"
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : "Upload Receipt"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GenerateReceiptDialog;
