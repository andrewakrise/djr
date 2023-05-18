import './App.css';

function App() {
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
          <iframe width="100%" height="166" allow="autoplay"
            src="https://soundcloud.com/andrew_rise/podcast-247-dj-rise-2904?si=e47af6d3abd0496dbaa385a4f8071fdf&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing"
          />
        </div>
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
