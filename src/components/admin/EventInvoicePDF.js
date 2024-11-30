// EventInvoicePDF.js
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  section: {
    marginBottom: 10,
  },
  header: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
  },
  field: {
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
  },
});

const EventInvoicePDF = ({ event }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Invoice Contract</Text>
        <View style={styles.section}>
          <Text style={styles.field}>
            <Text style={styles.label}>Event Title: </Text>
            {event?.title || ""}
          </Text>
          <Text style={styles.field}>
            <Text style={styles.label}>Client Name: </Text>
            {event?.clientName || ""}
          </Text>
          <Text style={styles.field}>
            <Text style={styles.label}>Client Email: </Text>
            {event?.clientEmail || ""}
          </Text>
          <Text style={styles.field}>
            <Text style={styles.label}>Date: </Text>
            {new Date(event?.date)?.toLocaleDateString()}
          </Text>
          <Text style={styles.field}>
            <Text style={styles.label}>Start Time: </Text>
            {event?.startTime || ""}
          </Text>
          <Text style={styles.field}>
            <Text style={styles.label}>End Time: </Text>
            {event?.endTime || ""}
          </Text>
          <Text style={styles.field}>
            <Text style={styles.label}>Location: </Text>
            {event?.location || ""}
          </Text>
          <Text style={styles.field}>
            <Text style={styles.label}>Address: </Text>
            {event?.address || ""}
          </Text>
          <Text style={styles.field}>
            <Text style={styles.label}>Services: </Text>
            {/* {event?.services?.join(", ") || ""} */}
            {Array.isArray(event?.services)
              ? event?.services.join(", ")
              : event?.services || ""}
          </Text>
          <Text style={styles.field}>
            <Text style={styles.label}>Total Sum: </Text>$
            {event?.totalSum || ""}
          </Text>
          <Text style={styles.field}>
            <Text style={styles.label}>Deposit Sum: </Text>$
            {event?.depositSum || ""}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Terms and Conditions:</Text>
          <Text>
            {/* Add your terms and conditions here */}
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default EventInvoicePDF;
