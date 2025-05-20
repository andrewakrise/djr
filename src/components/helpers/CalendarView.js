import React, { useMemo, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { useGetAllConfEventsQuery } from "../../services/event";
import EventModal from "./EventModal";
import { enUS } from "date-fns/locale";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "./CalendarView.css";

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
      fontSize: "0.85rem",
      fontWeight: 500,
      textAlign: "center",
      whiteSpace: "normal",
      lineHeight: "0.75",
      margin: 0,
      padding: 0,
      background: "transparent",
    }}
  >
    {event?.title}
  </span>
);

const CalendarView = () => {
  const {
    data: events,
    isLoading,
    isError,
    error,
  } = useGetAllConfEventsQuery();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  // Map events to react-big-calendar format
  const calendarEvents = useMemo(() => {
    if (!events) return [];
    return events.map((event) => {
      let start, end;
      if (event.startDateTime) {
        start = new Date(event.startDateTime);
        end = event.endDateTime
          ? new Date(event.endDateTime)
          : new Date(event.startDateTime);
      } else if (event.date) {
        start = new Date(event.date);
        end = event.endTime
          ? new Date(event.date + "T" + event.endTime)
          : new Date(event.date);
      } else {
        start = new Date();
        end = new Date();
      }
      return {
        ...event,
        title: event.title,
        start,
        end,
        allDay: !event.startDateTime && !event.startTime,
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

  // Highlight today with greenish background
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

  // Make event background transparent and remove border/padding
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
        // maxWidth: "60rem",
        backgroundColor: "rgba(9, 54, 55, 0.5)",
        borderRadius: "0.5rem",
        boxShadow: 3,
        p: 2,
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
        components={{ event: EventComponent }}
        dayPropGetter={dayPropGetter}
        eventPropGetter={eventPropGetter}
        views={{ month: true, agenda: true }}
        defaultView="month"
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
