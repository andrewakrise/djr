import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import BookingPage from "./components/Booking";
import CalendarPage from "./components/Calendar";
import AudioVideoPage from "./components/AudioVideoPage";
import VideoLinkList from "./components/video/VideoLinkList";
import AdminPage from "./components/AdminPage";
import EventList from "./components/events/admin/EventList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/audio-video-previews" element={<AudioVideoPage />} />
        <Route path="/rdj-api" element={<AdminPage />} />
        <Route path="/rdj-api/video-links" element={<VideoLinkList />} />
        <Route path="/rdj-api/events" element={<EventList />} />
      </Routes>
    </Router>
  );
}

export default App;
