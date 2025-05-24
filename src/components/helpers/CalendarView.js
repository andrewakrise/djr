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
        sx={{ color: "#fff", p: 0, m: 0, verticalAlign: "end" }}
        className="calendar-view-back-button"
      >
        <ArrowBackIosNewIcon fontSize="1rem" color="white" />
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
        sx={{ color: "#fff", p: 0, m: 0, verticalAlign: "end" }}
        className="calendar-view-next-button"
      >
        <ArrowForwardIosIcon fontSize="1rem" color="white" />
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

const CustomAgendaEvent = ({ event }) => {
  const today = dayjs().startOf("day");
  const eventDate = dayjs(event.start).startOf("day");

  // Check if this is today's event
  const isToday = eventDate.isSame(today);

  // Check if this is the next upcoming event (future event closest to today)
  const isUpcoming = eventDate.isAfter(today);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "0.5rem 0",
        position: "relative",
        backgroundColor: isToday
          ? "rgba(86, 199, 176, 0.2)"
          : isUpcoming
          ? "rgba(68, 160, 141, 0.15)"
          : "transparent",
        borderRadius: isToday || isUpcoming ? "4px" : "0",
        borderLeft: isToday
          ? "4px solid rgba(86, 199, 176, 0.9)"
          : isUpcoming
          ? "3px solid rgba(68, 160, 141, 0.7)"
          : "none",
        transition: "all 0.2s ease",
      }}
    >
      <Avatar
        src={event?.image}
        alt={event?.title}
        sx={{
          width: 40,
          height: 40,
          border: isToday
            ? "2px solid rgba(86, 199, 176, 0.8)"
            : "1px solid #093637",
          borderRadius: 0,
          mr: 2,
          flexShrink: 0,
          boxShadow: isToday ? "0 0 8px rgba(86, 199, 176, 0.4)" : "none",
        }}
      />
      <span
        style={{
          fontWeight: isToday ? 700 : 600,
          color: isToday ? "rgba(86, 199, 176, 1)" : "#fff",
          fontSize: "1rem",
          textShadow: isToday ? "0 1px 3px rgba(0, 0, 0, 0.3)" : "none",
        }}
      >
        {isToday && "🎵 "}
        {event?.title}
      </span>
      <Divider
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: isToday
            ? "rgba(86, 199, 176, 0.3)"
            : "var(--calendar-border-grey)",
        }}
      />
    </div>
  );
};

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

  // Find the next upcoming event
  const nextUpcomingEvent = useMemo(() => {
    if (!calendarEvents) return null;
    const today = dayjs().startOf("day");
    const futureEvents = calendarEvents
      .filter((event) => dayjs(event.start).startOf("day").isAfter(today))
      .sort((a, b) => new Date(a.start) - new Date(b.start));
    return futureEvents.length > 0 ? futureEvents[0] : null;
  }, [calendarEvents]);

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

    // Check if this date has events
    const dateString = date.toDateString();
    const hasEvents = calendarEvents.some(
      (event) => event.start.toDateString() === dateString
    );

    // Count events for this date
    const eventCount = calendarEvents.filter(
      (event) => event.start.toDateString() === dateString
    ).length;

    if (cell.isSame(today)) {
      return {
        style: {
          backgroundColor: hasEvents
            ? "rgba(86, 199, 176, 0.8)"
            : "rgba(86, 199, 176, 0.6)",
          boxShadow: "inset 0 0 0 2px rgba(86, 199, 176, 0.9)",
        },
        className: "rbc-today-enhanced",
      };
    }

    if (hasEvents) {
      return {
        style: {
          backgroundColor:
            eventCount > 1
              ? "rgba(68, 160, 141, 0.5)"
              : "rgba(68, 160, 141, 0.3)",
          borderLeft: "1px solid rgba(86, 199, 176, 0.8)",
        },
        className:
          eventCount > 1 ? "rbc-has-multiple-events" : "rbc-has-events",
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

  // Create enhanced agenda event component with access to next upcoming event
  const EnhancedAgendaEvent = useMemo(() => {
    return ({ event }) => {
      const today = dayjs().startOf("day");
      const eventDate = dayjs(event.start).startOf("day");

      // Check if this is today's event
      const isToday = eventDate.isSame(today);

      // Check if this is the next upcoming event specifically
      const isNextUpcoming =
        nextUpcomingEvent &&
        event.start.getTime() === nextUpcomingEvent.start.getTime() &&
        event.title === nextUpcomingEvent.title;

      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "0.5rem 0",
            position: "relative",
            backgroundColor: isToday
              ? "rgba(86, 199, 176, 0.25)"
              : isNextUpcoming
              ? "rgba(68, 160, 141, 0.2)"
              : "transparent",
            borderRadius: isToday || isNextUpcoming ? "6px" : "0",
            borderLeft: isToday
              ? "4px solid rgba(86, 199, 176, 0.9)"
              : isNextUpcoming
              ? "3px solid rgba(68, 160, 141, 0.8)"
              : "none",
            transition: "all 0.2s ease",
            transform: isToday || isNextUpcoming ? "translateX(2px)" : "none",
          }}
        >
          <Avatar
            src={event?.image}
            alt={event?.title}
            sx={{
              width: 40,
              height: 40,
              border: isToday
                ? "2px solid rgba(86, 199, 176, 0.9)"
                : isNextUpcoming
                ? "2px solid rgba(68, 160, 141, 0.8)"
                : "1px solid #093637",
              borderRadius: 0,
              mr: 2,
              flexShrink: 0,
              boxShadow: isToday
                ? "0 0 12px rgba(86, 199, 176, 0.5)"
                : isNextUpcoming
                ? "0 0 8px rgba(68, 160, 141, 0.4)"
                : "none",
            }}
          />
          <span
            style={{
              fontWeight: isToday ? 700 : isNextUpcoming ? 650 : 600,
              color: isToday
                ? "rgba(86, 199, 176, 1)"
                : isNextUpcoming
                ? "rgba(68, 160, 141, 1)"
                : "#fff",
              fontSize: isToday || isNextUpcoming ? "1.05rem" : "1rem",
              textShadow:
                isToday || isNextUpcoming
                  ? "0 1px 3px rgba(0, 0, 0, 0.3)"
                  : "none",
            }}
          >
            {isToday && "🎵 "}
            {isNextUpcoming && "⭐ "}
            {event?.title}
          </span>
          <Divider
            sx={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: isToday
                ? "rgba(86, 199, 176, 0.4)"
                : isNextUpcoming
                ? "rgba(68, 160, 141, 0.3)"
                : "var(--calendar-border-grey)",
            }}
          />
        </div>
      );
    };
  }, [nextUpcomingEvent]);

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
          agenda: { event: EnhancedAgendaEvent },
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
