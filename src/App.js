import { useEffect } from 'react';
import './App.css';

function App() {
  useEffect(() => {
    // Check if the 'visited' cookie is set
    if (document.cookie.split('; ').find(row => row.startsWith('visited='))) {
        return;
    }

    // If the 'visited' cookie isn't set, show an alert
    alert('Welcome! This is your first visit to this page.');

    // Set the 'visited' cookie to true for a year
    var oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    document.cookie = 'visited=true; expires=' + oneYearFromNow.toUTCString() + '; path=/';
  }, []);  // Passing an empty array as the second argument to useEffect makes it run on mount

  return (
    <div className="app">
      <header className="app-header">
        <p>
          Gentle Harmony is Everywhere.
        </p>
        <a
          className="app-link"
          href="https://on.soundcloud.com/DU5at"
          target="_blank"
          rel="noopener noreferrer"
        >
          click here to listening
        </a>
        <div>
        <iframe width="100%" height="166" scrolling="no" frameBorder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1567746709&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>
        <div style={{fontSize: '10px', color: '#cccccc', lineBreak: 'anywhere', wordBreak: 'normal', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontFamily: 'Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif', fontWeight: '100'}}>
        <a href="https://soundcloud.com/andrew_rise" title="RISE DJ" target="_blank" style={{color: '#cccccc', textDecoration: 'none'}}>RISE DJ</a> · <a href="https://soundcloud.com/andrew_rise/dj-rise-gentle-groovy-deep-house-71723" title="DJ RISE Gentle Groovy Deep House #001 7/17/23" target="_blank" style={{color: '#cccccc', textDecoration: 'none'}}>Gentle Groovy Deep House #001 7/17/23</a></div></div>
      </header>
      <main>
      <div className="app-link">
          <a
            href="mailto:andrewrisedj@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            >Gmail</a>
        </div>
        <div className="app-link">
          <a
            href="https://soundcloud.com/andrew_rise"
            target="_blank"
            rel="noopener noreferrer"
            >SoundCloud</a>
        </div>
        <div className="app-link">
          <a
            href="https://www.facebook.com/andrewrisedj/"
            target="_blank"
            rel="noopener noreferrer"
          >Facebook</a>
        </div>
      </main>
    </div>
  );
}

export default App;
