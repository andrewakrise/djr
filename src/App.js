import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/Home";
import VideoLinkList from "./components/video/VideoLinkList";

// import VideoLinkAdd from "./components/video/VideoLinkAdd";
// import VideoLinkUpdate from "./components/video/VideoLinkUpdate";
// import VideoLinkDelete from "./components/video/VideoLinkDelete";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/video-links" element={<VideoLinkList />} />
      </Routes>
    </Router>
  );
}

export default App;
