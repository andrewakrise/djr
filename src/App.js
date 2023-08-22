import { useState } from 'react';
import { Container, Typography, Link, Box, Grid, Button } from '@mui/material';
import Form from './components/Form';
import Navbar from './components/Navbar';
import sunsetPartyPoster from './assets/sunset-party.jpg';

function EventPoster() {
  const mapsURL = "https://goo.gl/maps/Zim9xmhjUHFNn8zJ8";
  const ticketsURL = "https://www.eventbrite.com/e/sunset-electronic-industrial-garden-open-air-tickets-701008604607";

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 2,
        padding: 3,
        mb: 4,
      }}
    >
      <img 
        src={sunsetPartyPoster}
        alt="Event Poster" 
        style={{width: '100%', height: 'auto', borderRadius: '8px'}}
      />
      
      <Typography variant="h5" component="div" sx={{ mt: 2, color: 'black', fontSize: 'calc(8px + 1.2vmin)' }}>
        Sunset Electronic Party at Industrial Garden
      </Typography>
      
      <Typography sx={{ mt: 1, mb: 2, color: 'black', fontSize: 'calc(5px + 1.2vmin)' }}>
        Step into serenity within the urban pulse. 
        Unearth enchanting musical gardens woven into 
        industrial echoes, where the rhythm of electronic 
        music sets your soul free. Immerse in melody, 
        witness industrial spaces transform through tunes. 
      </Typography>
      
      <Link href={mapsURL} target="_blank" rel="noopener noreferrer">
        <Button variant="contained" color="primary">
          View on Google Maps
        </Button>
      </Link>

      <Link href={ticketsURL} target="_blank" rel="noopener noreferrer" sx={{ mt: 2 }}>
        <Button variant="contained" color="secondary">
          Get Tickets
        </Button>
      </Link>
    </Box>
  );
}

function App() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <Navbar/>
      <Container 
        maxWidth={false}
        sx={{
          textAlign: 'center', 
          backgroundColor: '#282c34',
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '2rem 0 2rem 0',
          fontSize: 'calc(10px + 2vmin)',
        }}
      >
        <Box 
          spacing={2}
          sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Box sx={{ mb: 4, fontSize: 'calc(8px + 1.2vmin)' }}>
              <Typography 
                mb={2}
                sx={{
                  fontSize: 'calc(10px + 2vmin)',
                }}
                variant="h4">
                  DJ & Mood Creator
                </Typography>
            </Box>
            <Box sx={{ mb: 4, fontSize: 'calc(8px + 1.2vmin)' }}>
              <Typography 
                mb={2}
                sx={{
                  fontSize: 'calc(10px + 2vmin)',
                }}
                variant="h4">
                  Elevating Moods with Music.
                </Typography>
            </Box>
            <Box sx={{ mb: 4, fontSize: 'calc(8px + 1.2vmin)' }}>
              <Typography 
                mb={2}
                sx={{
                  fontSize: 'calc(10px + 2vmin)',
                }}
                variant="h4">
                  Bringing Harmony to Your Event
                </Typography>
            </Box>
            <Box
              sx={{
                width: 'calc(100px + 55vmin)',
                height:'calc(100px + 55vmin)%'
              }}
            >
              <EventPoster />
            </Box>
            <Box 
              sx={{
                position:'relative',
                overflow: 'hidden', 
                width: '100%',
                height:'100%'
              }}
            >
              <iframe 
                scrolling="no" 
                frameBorder="no" 
                allow="autoplay" 
                style={{width:'calc(100px + 55vmin)', height: 'calc(5px + 15vmin)', minHeight: '100px', maxHeight: '200px'}}
                src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1589920903&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"
              />
            </Box>
            <Box 
              sx={{
                position:'relative',
                overflow: 'hidden', 
                width: '100%',
                height:'100%',
                paddingTop: '6.25%',
              }}
            >
              <iframe 
                src="https://www.youtube.com/embed/oN9OIOZGkCo"
                scrolling="no" 
                frameBorder="no" 
                style={{width:'calc(100px + 55vmin)', height: 'calc(10px + 40vmin)'}}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen 
                title="YouTube video player"
              />
            </Box>
            <Box 
              sx={{
                direction:"column", alignItems:"center", width: '100%', mt:3
              }}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => setShowForm(!showForm)}
                sx={{ backgroundColor: '#9c490e', '&:hover': { backgroundColor: '#cc6f2d' }}}
              >
                {showForm ? "Close Form" : "Book Party or Event"}
              </Button>
              {showForm && (
                <Box sx={{ mt: 3 }}>
                  <Form />
                </Box>
              )}
            </Box>
        </Box>
      </Container>
    </>
  );
}

export default App;
