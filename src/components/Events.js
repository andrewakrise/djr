import EventSlider from './EventSlider';
import eventData from '../assets/eventsData';

export default function Events({ isPreview = false }) {

  return <EventSlider events={eventData} isPreview={isPreview} />;

}
