// EventInvoicePDF.js
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
  generateUniqueDepositNumber,
} from "../helpers/utils";

const styles = StyleSheet.create({
  page: {
    padding: 4,
    fontWeight: 400,
    fontSize: 10,
    flexDirection: "column",
  },
  topSection: {
    padding: 10,
    color: "white",
    backgroundColor: "#282c34",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 75,
    height: 75,
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
  invoiceNumber: {
    textAlign: "right",
    color: "white",
  },
  invoiceDate: {
    textAlign: "right",
    color: "white",
    marginBottom: 15,
  },
  eventClientSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
    padding: 10,
    marginBottom: 5,
  },
  clientHeader: {
    width: "100%",
    fontSize: 14,
    padding: 7,
    paddingLeft: 20,
    marginBottom: 5,
    borderBottom: "1px solid #000",
  },
  clientSection: {
    textAlign: "left",
    padding: 10,
  },
  dateSection: {
    textAlign: "right",
    padding: 10,
  },
  eventDate: {
    flexDirection: "column",
    marginBottom: 10,
  },
  dateLabel: { fontWeight: 900, marginBottom: 7 },
  dateProp: { fontWeight: 500, fontSize: 12, color: "#585858" },
  clientField: { flexDirection: "row", marginBottom: 10 },
  clientLabel: { fontWeight: 900, fontSize: 12, color: "black" },
  clientProp: {
    marginLeft: 4,
    fontWeight: 500,
    fontSize: 12,
    color: "#585858",
  },
  serviceSection: {
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
  section: {
    padding: 10,
    marginBottom: 5,
  },
  field: {
    marginBottom: 5,
    color: "#404040",
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
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    width: "95%",
    marginBottom: 5,
  },
  paymentLabel: { fontWeight: 900, fontSize: 14, color: "#585858" },
  paymentLabelAddText: {
    marginTop: 10,
    fontWeight: 900,
    fontSize: 14,
    fontStyle: "italic",
    color: "#000000",
  },
  paymentProp: { marginLeft: 10, fontSize: 14 },
  footer: {
    // marginTop: 10,
    borderTop: "1px solid #000",
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
});

const EventDepositPDF = ({ event }) => {
  const logoUrl =
    "https://res.cloudinary.com/vandjscloud/image/upload/v1733183729/djr-be/v88cmm9ewl3wprln5ztq.png";
  const wideHeaderImageUrl =
    "https://res.cloudinary.com/vandjscloud/image/upload/v1733184485/djr-be/xyrsbbhakq2xsu0dyhcc.jpg";

  const depositDate = formatDateToLocalAmericaPacific(new Date());
  const depositNumber = generateUniqueDepositNumber(new Date());
  const eventServices = event?.services?.split(", ");
  // console.log("event", event);

  return (
    <Document>
      <Page size="A4" orientation="portrait" style={styles.page}>
        {/* Header Section */}
        <View style={styles.topSection}>
          <Image
            src={logoUrl || "../../assets/icons/logo.png"}
            style={styles.logo}
          />
          <Text style={styles.header}>DJ RISE Service Deposit Bill</Text>
          <View>
            <Text style={styles.depositDate}>
              Date: {depositDate || "no deposit date"}
            </Text>
            <Text style={styles.depositNumber}>No. {depositNumber}</Text>
          </View>
        </View>
        <View>
          <Image
            src={wideHeaderImageUrl || "../../assets/pioneerdjset.jpg"}
            style={styles.wideHeaderImageUrl}
          />
        </View>

        <Text style={styles.clientHeader}>Bill To: </Text>
        <View style={styles.eventClientSection}>
          {/* Client Information Section */}
          <View style={styles.clientSection}>
            <View style={styles.clientField}>
              <Text style={styles.clientLabel}>Client Name: </Text>
              <Text style={styles.clientProp}>
                {" "}
                {event?.clientName || "no name"}
              </Text>
            </View>
            <View style={styles.clientField}>
              <Text style={styles.clientLabel}>Client Email: </Text>
              <Text style={styles.clientProp}>
                {" "}
                {event?.clientEmail || "no email"}
              </Text>
            </View>
            <View style={styles.clientField}>
              <Text style={styles.clientLabel}>Phone Number: </Text>
              <Text style={styles.clientProp}>
                {" "}
                {event?.phoneNumber || "no phone number"}
              </Text>
            </View>
            <View style={styles.clientField}>
              <Text style={styles.clientLabel}>Event Address: </Text>
              <Text style={styles.clientProp}>
                {" "}
                {event?.address || "no address"}
              </Text>
            </View>
          </View>

          {/* Event Details Section */}
          <View style={styles.dateSection}>
            <View style={styles.eventDate}>
              <Text style={styles.dateLabel}>Event Start Date & Time: </Text>
              <Text style={styles.dateProp}>
                {`${event?.date} ${event?.startTime || ""}` ||
                  "no start date and time"}
              </Text>
            </View>
            <View style={styles.eventDate}>
              <Text style={styles.dateLabel}>Event End Date & Time: </Text>
              <Text style={styles.dateProp}>
                {`${event?.date} ${event?.endTime || ""}` ||
                  "no start date and time"}
              </Text>
            </View>
          </View>
        </View>
        {/* Services Section */}
        <View style={styles.serviceSection}>
          <Text style={styles.label}>DJ Services:</Text>
          <View style={styles.serviceTable}>
            {eventServices &&
            eventServices?.length > 0 &&
            Array.isArray(eventServices) ? (
              <>
                <View style={styles.serviceHeader}>
                  <Text>Description</Text>
                  <Text>Amount</Text>
                </View>

                {eventServices?.map((service, index) => (
                  <View key={index} style={styles.serviceRow}>
                    <Text style={styles.serviceRowText}>{service}</Text>
                  </View>
                ))}
              </>
            ) : (
              <View style={styles.serviceRow}>
                <Text>NO SERVICES CHOSEN</Text>
              </View>
            )}
          </View>
        </View>

        {/* Payment Section */}
        <View style={styles.paymentSection}>
          <View style={styles.paymentField}>
            <Text style={styles.paymentLabel}>
              Deposit Required to Confirm Booking:{" "}
            </Text>
            <Text style={styles.paymentProp}>
              ${event?.depositSum || "No Sum"}
            </Text>
          </View>
          <View style={styles.paymentField}>
            <Text style={styles.paymentLabelAddText}>
              After the deposit is made, the confirmation will be sent to your
              email
            </Text>
          </View>
        </View>

        {/* Footer Section */}
        <View style={styles.footer}>
          <Text style={styles.field}>DJ Rise Legal Information:</Text>
          <Text style={styles.field}>
            Full Name: Andrew Kukhar || Business legal name: Andrii Kukhar
          </Text>
          <Text style={styles.field}>
            Address: 3410-128 West Cordova Street
          </Text>
          <Text style={styles.field}>Phone: +1 (236) 995 - 1120</Text>
          <Text style={styles.field}>
            Contact Email: andrewrisedj@gmail.com
          </Text>
          <Text style={styles.field}>
            E-Transfer Email: andriikukharv@gmail.com
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default EventDepositPDF;
