import { useState } from 'react';
import { Container, Typography, Link, Box, Grid, Button } from '@mui/material';
import Form from './components/Form';
import Navbar from './components/Navbar';

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
                variant="h4">Gentle Harmony is Everywhere.</Typography>
              <Link href="https://on.soundcloud.com/DU5at" target="_blank" mt={10} mr={10} rel="noopener noreferrer" sx={{ color: '#00a5d3' }}>
                Click here to listen
              </Link>
              <Link href="https://www.youtube.com/@DJRISE-arisedj" target="_blank" mt={10} rel="noopener noreferrer" sx={{ color: '#00a5d3' }}>
                Click here to watch more
              </Link>
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
                style={{width:'calc(100px + 55vmin)', height: 'calc(5px + 25vmin)'}}
                src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1567746709&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"
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
                src="https://www.youtube.com/embed/_r3PjLWbThA" 
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
