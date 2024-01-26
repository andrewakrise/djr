import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/Home";
import VideoLinkList from "./components/video/VideoLinkList";
import AdminPage from "./components/AdminPage";
import EventList from "./components/events/admin/EventList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/rdj-api" element={<AdminPage />} />
        <Route path="/rdj-api/video-links" element={<VideoLinkList />} />
        <Route path="/rdj-api/events" element={<EventList />} />
      </Routes>
    </Router>
  );
}

export default App;
