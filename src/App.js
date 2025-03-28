import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import BookingPage from "./components/Booking";
import CalendarPage from "./components/Calendar";
import AudioVideoPage from "./components/AudioVideoPage";
import VideoLinkList from "./components/admin/VideoLinkList";
import AdminPage from "./components/admin/AdminPage";
import EventList from "./components/admin/EventList";
import ReviewList from "./components/admin/ReviewList";
import PrivateRoute from "./services/routes/PrivateRoute";
import LoginPage from "./components/auth/LoginPage";
import SignupPage from "./components/auth/SignupPage";
import ReviewsPage from "./components/ReviewsPage";
import { NotificationProvider } from "./context/NotificationContext";

function App() {
  return (
    <NotificationProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/audio-video-previews" element={<AudioVideoPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />

          <Route
            path="/rdj-api"
            element={
              <PrivateRoute>
                <AdminPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/rdj-api/video-links"
            element={
              <PrivateRoute>
                <VideoLinkList />
              </PrivateRoute>
            }
          />
          <Route
            path="/rdj-api/events"
            element={
              <PrivateRoute>
                <EventList />
              </PrivateRoute>
            }
          />
          <Route
            path="/rdj-api/reviews"
            element={
              <PrivateRoute>
                <ReviewList />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </NotificationProvider>
  );
}

export default App;
