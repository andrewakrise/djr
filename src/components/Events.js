import EventSlider from "./EventSlider";
import eventData from "../assets/eventsData";

export default function Events({ isPreview = false }) {
  const now = new Date();

  // Sort events by date
  const sortedEvents = [...eventData].sort((a, b) => a.date - b.date);

  // Categorize events
  const pastEvents = sortedEvents.filter((event) => event.date < now);
  const futureEvents = sortedEvents.filter((event) => event.date >= now);
  const currentEvent = futureEvents.shift() || pastEvents.pop();

  const orderedEvents = [currentEvent, ...futureEvents, ...pastEvents];

  return <EventSlider events={orderedEvents} isPreview={isPreview} />;
}
