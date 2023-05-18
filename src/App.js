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
        <iframe width="100%" height="166" scrolling="no" frameBorder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1495867741&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>
        <div style={{fontSize: '10px', color: '#cccccc', lineBreak: 'anywhere', wordBreak: 'normal', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontFamily: 'Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif', fontWeight: '100'}}>
        <a href="https://soundcloud.com/andrew_rise" title="RISE DJ" target="_blank" style={{color: '#cccccc', textDecoration: 'none'}}>RISE DJ</a> · <a href="https://soundcloud.com/andrew_rise/podcast-247-dj-rise-2904" title="Podcast 247 29/04" target="_blank" style={{color: '#cccccc', textDecoration: 'none'}}>Podcast 247 29/04</a></div></div>
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
