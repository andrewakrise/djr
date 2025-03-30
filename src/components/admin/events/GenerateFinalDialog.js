// src/components/admin/GenerateFinalDialog.js
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

import { useUploadFinalMutation } from "../../../services/event";
import { generateUniqueFileName } from "../../helpers/utils";
import EventFinalPDF from "./EventFinalPDF";

const GenerateFinalDialog = ({ open, onClose, event, refetchEvents }) => {
  const [pdfBlob, setPdfBlob] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadFinal, { isLoading }] = useUploadFinalMutation();

  // PDF Viewer plugins
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
      const blob = await pdf(<EventFinalPDF event={eventData} />).toBlob();
      setPdfBlob(blob);
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      setError(`Error generating PDF: ${err.message}`);
    }
  };

  const handleUploadFinal = async () => {
    if (!pdfBlob) {
      setError("No PDF to upload");
      return;
    }
    const fileName = generateUniqueFileName(event?.date, "Final Bill");
    const formData = new FormData();
    formData.append("pdfFinal", pdfBlob, `${fileName}.pdf`);

    const result = await uploadFinal({
      eventId: event?.id,
      formData,
    });

    if (result?.data && result?.data?.event) {
      setSuccess("Final bill uploaded successfully");
      refetchEvents?.();
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setError(
        `Error uploading final bill: ${
          result?.error?.data?.msg || "Server error"
        }`
      );
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Final Bill Preview</DialogTitle>
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
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleUploadFinal}
          color="primary"
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : "Upload Final Bill"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GenerateFinalDialog;
