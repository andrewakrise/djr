import React from "react";
import {
  Document,
  Page,
  Image,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import {
  formatDateToLocalAmericaPacific,
  generateUniqueDepositReceiptNumber,
  convertTo12HourFormat,
} from "../../helpers/utils";
import logo from "../../../assets/icons/logo.png";
import pioneerdjset from "../../../assets/pioneerdjset.jpg";

const styles = StyleSheet.create({
  page: {
    margin: 0,
    padding: 4,
    fontWeight: 400,
    fontSize: 10,
    flexDirection: "column",
  },
  topSection: {
    margin: 0,
    padding: 0,
    paddingLeft: 10,
    paddingRight: 10,
    color: "white",
    backgroundColor: "#282c34",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 55,
    height: 55,
  },
  wideHeaderImageUrl: {
    width: "100%",
    height: 80,
    padding: 0,
    margin: 0,
  },
  header: {
    textAlign: "left",
    color: "white",
    fontSize: 20,
    padding: 10,
    flex: 1,
  },
  receiptNumber: {
    textAlign: "right",
    color: "white",
  },
  receiptDate: {
    textAlign: "right",
    color: "white",
    marginBottom: 7,
  },
  clientHeader: {
    width: "100%",
    fontSize: 14,
    padding: 7,
    paddingLeft: 20,
    margin: 0,
    borderBottom: "1px solid #000",
  },
  eventClientSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
    padding: 10,
    margin: 0,
    marginBottom: 0,
    paddingBottom: 0,
    marginTop: 0,
    paddingTop: 0,
  },
  clientSection: {
    flex: 3,
    textAlign: "left",
    padding: 10,
    wordBreak: "break-word",
    margin: 0,
  },
  dateSection: {
    flex: 2,
    textAlign: "right",
    padding: 10,
  },
  eventDate: {
    flexDirection: "column",
    marginBottom: 10,
  },
  dateLabel: { fontWeight: 900, marginBottom: 7 },
  dateProp: { fontWeight: 500, fontSize: 12, color: "#585858" },
  clientField: {
    flexDirection: "row",
    marginBottom: 0,
    alignItems: "flex-start",
  },
  clientLabel: {
    fontWeight: 900,
    fontSize: 12,
    color: "black",
    width: 100,
  },
  clientProp: {
    fontWeight: 500,
    fontSize: 12,
    color: "#585858",
    flex: 1,
    lineHeight: 1.75,
  },
  serviceSection: {
    margin: 0,
    padding: 0,
    marginBottom: 0,
    paddingBottom: 0,
    marginTop: 0,
    paddingTop: 0,
    paddingLeft: 10,
    paddingRight: 10,
  },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 7,
    padding: 10,
    backgroundColor: "#BEBEBE",
  },
  serviceTable: {
    padding: 10,
  },
  serviceRow: {
    marginBottom: 6,
    borderBottom: "1px solid #BEBEBE",
  },
  serviceRowText: {
    paddingBottom: 5,
  },
  label: {
    fontWeight: 900,
    padding: 10,
    fontSize: 14,
  },
  paymentSection: {
    flexDirection: "column",
    width: "100%",
    padding: 10,
  },
  paymentField: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    textAlign: "right",
    width: "95%",
    marginBottom: 5,
  },
  paymentLabel: {
    fontWeight: 900,
    fontSize: 14,
    color: "#585858",
  },
  paymentProp: {
    marginLeft: 10,
    fontSize: 14,
  },
  footer: {
    borderTop: "1px solid #000",
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
});

const EventDepositReceiptPDF = ({ event }) => {
  const logoUrl = logo;
  const wideHeaderImageUrl = pioneerdjset;

  const receiptDate = formatDateToLocalAmericaPacific(new Date());
  const receiptNumber = generateUniqueDepositReceiptNumber(new Date());
  const depositSum = event?.depositSum || 0;

  const eventServices = event?.services?.split(", ").map((service) => {
    if (service === "Logistics and Setting of the above equipment") {
      return "Logistics and Setting of the above equipment at the event venue";
    }
    return service;
  });

  return (
    <Document>
      <Page size="A4" orientation="portrait" style={styles.page}>
        <View style={styles.topSection}>
          <Image
            src={logoUrl || "../../../assets/icons/logo.png"}
            style={styles.logo}
          />
          <Text style={styles.header}>DJ RISE Deposit Receipt</Text>
          <View>
            <Text style={styles.receiptDate}>
              Date: {receiptDate || "no date"}
            </Text>
            <Text style={styles.receiptNumber}>No. {receiptNumber}</Text>
          </View>
        </View>
        {/* Wide banner image */}
        <View>
          <Image
            src={wideHeaderImageUrl || "../../../assets/pioneerdjset.jpg"}
            style={styles.wideHeaderImageUrl}
          />
        </View>
        {/* "Deposit  Receipt Issued To:" */}
        <Text style={styles.clientHeader}>Deposit Receipt Issued To:</Text>
        <View style={styles.eventClientSection}>
          <View style={styles.clientSection}>
            <View style={styles.clientField}>
              <Text style={styles.clientLabel}>Name:</Text>
              <Text style={styles.clientProp}>{event?.clientName || "-"}</Text>
            </View>
            <View style={styles.clientField}>
              <Text style={styles.clientLabel}>Email:</Text>
              <Text style={styles.clientProp}>{event?.clientEmail || "-"}</Text>
            </View>
            <View style={styles.clientField}>
              <Text style={styles.clientLabel}>Company/Venue:</Text>
              <Text style={styles.clientProp}>
                {event?.clientCompanyName || "-"}
              </Text>
            </View>
            <View style={styles.clientField}>
              <Text style={styles.clientLabel}>Phone Number:</Text>
              <Text style={styles.clientProp}>{event?.phoneNumber || "-"}</Text>
            </View>
            <View style={styles.clientField}>
              <Text style={styles.clientLabel}>Event Address:</Text>
              <Text style={styles.clientProp}>{event?.address || "-"}</Text>
            </View>
          </View>

          {/* Right side: date/times */}
          <View style={styles.dateSection}>
            <View style={styles.eventDate}>
              <Text style={styles.dateLabel}>Event Date:</Text>
              <Text style={styles.dateProp}>
                {event?.startDateTime
                  ? formatDateToLocalAmericaPacific(event.startDateTime)
                  : "-"}
              </Text>
              <Text style={styles.dateProp}>
                {event?.startDateTime
                  ? convertTo12HourFormat(
                      new Date(event.startDateTime).toTimeString().slice(0, 5)
                    )
                  : ""}
                {event?.endDateTime
                  ? ` - ${convertTo12HourFormat(
                      new Date(event.endDateTime).toTimeString().slice(0, 5)
                    )}`
                  : ""}
              </Text>
            </View>
          </View>
        </View>
        {/* Optional list of DJ services again */}
        {eventServices && eventServices.length > 0 && (
          <View style={styles.serviceSection}>
            <Text style={styles.label}>DJ Services:</Text>
            <View style={styles.serviceTable}>
              <View style={styles.serviceHeader}>
                <Text>Description</Text>
                <Text>Amount</Text>
              </View>
              {eventServices.map((service, i) => (
                <View key={i} style={styles.serviceRow}>
                  <Text style={styles.serviceRowText}>{service}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        <View style={styles.paymentSection}>
          <View style={styles.paymentField}>
            <Text style={styles.paymentLabel}>Deposit Paid:</Text>
            <Text style={styles.paymentProp}>${depositSum.toFixed(2)}</Text>
          </View>
        </View>
        <View style={styles.footer}>
          <Text>
            Thank you for your deposit. This receipt confirms the payment of
            your deposit for the event. Please keep this document for your
            records.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default EventDepositReceiptPDF;
