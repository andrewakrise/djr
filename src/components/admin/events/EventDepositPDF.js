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
} from "../../helpers/utils";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import pioneerdjset from "../../../assets/pioneerdjset.jpg";
import logo from "../../../assets/icons/logo.png";

// Configure dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const styles = StyleSheet.create({
  page: {
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
  depositNumber: {
    textAlign: "right",
    color: "white",
  },
  depositDate: {
    textAlign: "right",
    color: "white",
    marginBottom: 7,
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
  clientHeader: {
    width: "100%",
    fontSize: 14,
    padding: 7,
    paddingLeft: 20,
    margin: 0,
    borderBottom: "1px solid #000",
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
  clientLabel: { fontWeight: 900, fontSize: 12, color: "black", width: 100 },
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

const EventDepositPDF = ({ event, showLegalInfo = true }) => {
  const logoUrl = logo;
  const wideHeaderImageUrl = pioneerdjset;

  const depositDate = formatDateToLocalAmericaPacific(new Date());
  const depositNumber = generateUniqueDepositNumber(new Date());
  const eventServices = event?.services?.split(", ").map((service) => {
    if (service === "Logistics and Setting of the above equipment") {
      return "Logistics and Setting of the above equipment at the event venue";
    }
    return service;
  });
  // console.log("event", event);

  // Format date and time using the new datetime fields
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
            src={wideHeaderImageUrl || "../../../assets/pioneerdjset.jpg"}
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
            {event?.clientCompanyName && (
              <View style={styles.clientField}>
                <Text style={styles.clientLabel}>Company/Venue: </Text>
                <Text style={styles.clientProp}>
                  {" "}
                  {event?.clientCompanyName || "no name"}
                </Text>
              </View>
            )}
            <View style={styles.clientField}>
              <Text style={styles.clientLabel}>Phone Number: </Text>
              <Text style={styles.clientProp}>
                {" "}
                {event?.phoneNumber || "no phone number"}
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
        {showLegalInfo && (
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
        )}
      </Page>
    </Document>
  );
};

export default EventDepositPDF;
