// src/components/admin/EventReceiptPDF.js
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
  generateUniqueReceiptNumber,
} from "../../helpers/utils";
import logo from "../../../assets/icons/logo.png";
import pioneerdjset from "../../../assets/pioneerdjset.jpg";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

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
  paymentTextField: {
    flexDirection: "row",
    justifyContent: "center",
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
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
});

const EventReceiptPDF = ({ event }) => {
  const logoUrl = logo;
  const wideHeaderImageUrl = pioneerdjset;

  const receiptDate = formatDateToLocalAmericaPacific(new Date());
  const receiptNumber = generateUniqueReceiptNumber(new Date());

  const totalSum = event?.totalSum || 0;
  const depositSum = event?.depositSum || 0;
  const finalSum = totalSum - depositSum;

  const eventServices = event?.services?.split(", ").map((service) => {
    if (service === "Logistics and Setting of the above equipment") {
      return "Logistics and Setting of the above equipment at the event venue";
    }
    return service;
  });

  let formattedStartDate = "";
  let formattedStartTime = "";
  let formattedEndDate = "";
  let formattedEndTime = "";

  if (event?.startDateTime) {
    formattedStartDate = dayjs(event.startDateTime)
      .tz("America/Vancouver")
      .format("MMMM D, YYYY");
    formattedStartTime = dayjs(event.startDateTime)
      .tz("America/Vancouver")
      .format("h:mm A");
  }

  if (event?.endDateTime) {
    formattedEndDate = dayjs(event.endDateTime)
      .tz("America/Vancouver")
      .format("MMMM D, YYYY");
    formattedEndTime = dayjs(event.endDateTime)
      .tz("America/Vancouver")
      .format("h:mm A");
  }

  return (
    <Document>
      <Page size="A4" orientation="portrait" style={styles.page}>
        {/* Top Section: Logo, Title, Date & Number */}
        <View style={styles.topSection}>
          <Image
            src={logoUrl || "../../../assets/icons/logo.png"}
            style={styles.logo}
          />
          <Text style={styles.header}>DJ RISE Final Payment Receipt</Text>
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

        {/* "Paid Receipt Issued To:" */}
        <Text style={styles.clientHeader}>Paid Receipt Issued To:</Text>
        <View style={styles.eventClientSection}>
          {/* Left side: client info */}
          <View style={styles.clientSection}>
            <View style={styles.clientField}>
              <Text style={styles.clientLabel}>Name: </Text>
              <Text style={styles.clientProp}>
                {event?.clientName || "no name"}
              </Text>
            </View>
            {event?.clientCompanyName && (
              <View style={styles.clientField}>
                <Text style={styles.clientLabel}>Company/Venue: </Text>
                <Text style={styles.clientProp}>
                  {event?.clientCompanyName || "no venue"}
                </Text>
              </View>
            )}
            <View style={styles.clientField}>
              <Text style={styles.clientLabel}>Phone Number: </Text>
              <Text style={styles.clientProp}>
                {event?.phoneNumber || "no phone"}
              </Text>
            </View>
            <View style={styles.clientField}>
              <Text style={styles.clientLabel}>Email: </Text>
              <Text style={styles.clientProp}>
                {event?.clientEmail || "no email"}
              </Text>
            </View>
            <View style={styles.clientField}>
              <Text style={styles.clientLabel}>Event Address: </Text>
              <Text style={styles.clientProp}>
                {event?.address || "no address"}
              </Text>
            </View>
          </View>

          {/* Right side: date/times */}
          <View style={styles.dateSection}>
            <View style={styles.eventDate}>
              <Text style={styles.dateLabel}>Event Start Date & Time: </Text>
              <Text style={styles.dateProp}>
                {formattedStartDate && formattedStartTime
                  ? `${formattedStartDate} ${formattedStartTime}`
                  : "no start date and time"}
              </Text>
            </View>
            <View style={styles.eventDate}>
              <Text style={styles.dateLabel}>Event End Date & Time: </Text>
              <Text style={styles.dateProp}>
                {formattedEndDate && formattedEndTime
                  ? `${formattedEndDate} ${formattedEndTime}`
                  : "no end date and time"}
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

        {/* Payment totals */}
        <View style={styles.paymentSection}>
          <View style={styles.paymentField}>
            <Text style={styles.paymentLabel}>Total: </Text>
            <Text style={styles.paymentProp}>${totalSum}</Text>
          </View>
          <View style={styles.paymentField}>
            <Text style={styles.paymentLabel}>Paid Deposit: </Text>
            <Text style={styles.paymentProp}>${depositSum}</Text>
          </View>
          <View style={styles.paymentField}>
            <Text style={styles.paymentLabel}>Paid Final Payment: </Text>
            <Text style={styles.paymentProp}>${finalSum}</Text>
          </View>
          <View style={styles.paymentField}>
            <Text style={styles.paymentLabel}>
              The Final and Total amount received:{" "}
            </Text>
            <Text style={styles.paymentProp}>${totalSum}</Text>
          </View>
        </View>

        <View>
          <View style={styles.paymentTextField}>
            <Text style={styles.paymentLabelAddText}>
              This receipt confirms that all payments have been received in
              full.
            </Text>
          </View>
          <View style={styles.paymentTextField}>
            <Text style={styles.paymentLabelAddText}>
              Thank you for your business
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default EventReceiptPDF;
