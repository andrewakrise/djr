import React, { useMemo, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  IconButton,
  Avatar,
  Divider,
} from "@mui/material";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { useGetAllConfEventsQuery } from "../../services/event";
import EventModal from "./EventModal";
import { enUS } from "date-fns/locale";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "./CalendarView.css";
import privateParty2 from "../../assets/private-party-2.png";
import privateParty3 from "../../assets/private-party-3.png";

dayjs.extend(utc);
dayjs.extend(timezone);

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

// Custom event renderer for smaller font
const EventComponent = ({ event }) => (
  <span
    style={{
      fontSize: "0.65rem",
      fontWeight: 500,
      textAlign: "center",
      whiteSpace: "normal",
      lineHeight: "0.75",
      margin: 0,
      padding: "0.15rem 0.5rem",
      background: "transparent",
    }}
  >
    {event.isSingleEvent ? "• " : ""}
    {event?.title}
  </span>
);

// Custom toolbar with MUI icons and buttons
const CustomToolbar = (toolbar) => (
  <div
    className="rbc-toolbar"
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 0,
    }}
  >
    <div>
      <IconButton
        aria-label="Back"
        onClick={() => toolbar.onNavigate("PREV")}
        size="small"
        sx={{ color: "#fff", p: 0, m: 0, verticalAlign: "middle" }}
        className="calendar-view-back-button"
      >
        <ArrowBackIosNewIcon fontSize="small" color="white" />
      </IconButton>
      <Button
        onClick={() => toolbar.onNavigate("TODAY")}
        size="small"
        sx={{
          color: "#fff",
          fontWeight: 600,
          textTransform: "none",
          mx: 1,
          minHeight: 0,
          minWidth: 0,
        }}
        className="calendar-view-today-button"
      >
        Today
      </Button>
      <IconButton
        aria-label="Next"
        onClick={() => toolbar.onNavigate("NEXT")}
        size="small"
        sx={{ color: "#fff", p: 0, m: 0, verticalAlign: "middle" }}
        className="calendar-view-next-button"
      >
        <ArrowForwardIosIcon fontSize="small" color="white" />
      </IconButton>
    </div>
    <span
      className="rbc-toolbar-label"
      style={{ fontWeight: 600, color: "#fff" }}
    >
      {toolbar.label}
    </span>
    <div>
      {toolbar.views.map((view) => (
        <Button
          key={view}
          onClick={() => toolbar.onView(view)}
          size="small"
          sx={{
            color: toolbar.view === view ? "#222" : "#fff",
            background: toolbar.view === view ? "#fff" : "transparent",
            border: "1px solid var(--calendar-border-grey)",
            fontWeight: 500,
            textTransform: "none",
            mx: 0.5,
            minHeight: 0,
            minWidth: 0,
            p: "2px 8px",
          }}
          className="calendar-view-view-button"
        >
          {view.charAt(0).toUpperCase() + view.slice(1)}
        </Button>
      ))}
    </div>
  </div>
);

const CustomAgendaEvent = ({ event }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "0.5rem 0",
      position: "relative",
    }}
  >
    <Avatar
      src={event?.image}
      alt={event?.title}
      sx={{
        width: 40,
        height: 40,
        border: "1px solid #093637",
        borderRadius: 0,
        mr: 2,
        flexShrink: 0,
      }}
    />
    <span style={{ fontWeight: 600, color: "#fff", fontSize: "1rem" }}>
      {event?.title}
    </span>
    <Divider
      sx={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: "var(--calendar-border-grey)",
      }}
    />
  </div>
);

const CalendarView = ({
  viewMode = "month",
  allowedViews = ["month", "agenda"],
}) => {
  const {
    data: events,
    isLoading,
    isError,
    error,
  } = useGetAllConfEventsQuery();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const agendaImages = [privateParty2, privateParty3];

  // Map events to react-big-calendar format
  const calendarEvents = useMemo(() => {
    if (!events) return [];
    // Group events by date string
    const eventsByDate = {};
    events?.forEach((event) => {
      let dateKey;
      if (event.startDateTime) {
        dateKey = new Date(event.startDateTime).toDateString();
      } else if (event.date) {
        dateKey = new Date(event.date).toDateString();
      } else {
        dateKey = new Date().toDateString();
      }
      if (!eventsByDate[dateKey]) eventsByDate[dateKey] = [];
      eventsByDate[dateKey].push(event);
    });

    // Map and mark single events, assign random agenda image (no repeat)
    let lastImage = null;
    return events?.map((event, idx, arr) => {
      let start, end, dateKey;
      if (event.startDateTime) {
        start = new Date(event.startDateTime);
        end = event.endDateTime
          ? new Date(event.endDateTime)
          : new Date(event.startDateTime);
        dateKey = start.toDateString();
      } else if (event.date) {
        start = new Date(event.date);
        end = event.endTime
          ? new Date(event.date + "T" + event.endTime)
          : new Date(event.date);
        dateKey = start.toDateString();
      } else {
        start = new Date();
        end = new Date();
        dateKey = start.toDateString();
      }
      // Pick a random image, but not the same as the previous event
      let availableImages = agendaImages.filter((img) => img !== lastImage);
      let randomImage =
        availableImages[Math.floor(Math.random() * availableImages.length)];
      lastImage = randomImage;
      return {
        ...event,
        title: event.title,
        start,
        end,
        allDay: !event.startDateTime && !event.startTime,
        isSingleEvent: eventsByDate[dateKey]?.length === 1,
        image: randomImage,
      };
    });
  }, [events]);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedEvent(null);
  };

  const dayPropGetter = (date) => {
    const today = dayjs().startOf("day");
    const cell = dayjs(date).startOf("day");
    if (cell.isSame(today)) {
      return {
        style: {
          backgroundColor: "rgba(86, 199, 176, 0.5)",
        },
        className: "rbc-today-greenish",
      };
    }
    return {};
  };

  const eventPropGetter = () => ({
    style: {
      background: "transparent",
      border: "none",
      boxShadow: "none",
      padding: 0,
      margin: 0,
      minHeight: 0,
      minWidth: 0,
    },
  });

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography color="error" sx={{ mt: 4 }}>
        Error: {error?.data?.msg || "Failed to load events."}
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "rgba(9, 54, 55, 0.5)",
        borderRadius: "0.5rem",
        boxShadow: 3,
        p: 1,
      }}
    >
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 700, background: "transparent", borderRadius: 8 }}
        onSelectEvent={handleSelectEvent}
        popup
        components={{
          event: EventComponent,
          toolbar: CustomToolbar,
          agenda: { event: CustomAgendaEvent },
        }}
        dayPropGetter={dayPropGetter}
        eventPropGetter={eventPropGetter}
        views={allowedViews.reduce((acc, v) => ({ ...acc, [v]: true }), {})}
        defaultView={viewMode}
      />
      <EventModal
        open={openModal}
        onClose={handleCloseModal}
        event={selectedEvent}
      />
    </Box>
  );
};

export default CalendarView;
