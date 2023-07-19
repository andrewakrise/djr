import { useState } from 'react';
import { Container, Typography, Link, Box, Grid, Button } from '@mui/material';
import Form from './components/Form';

function App() {
  const [showForm, setShowForm] = useState(false);

  return (
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
    }}>
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Box sx={{ mb: 3 }}>
          <Typography sx={{
            fontSize: 'calc(10px + 2vmin)',
          }} variant="h4">Gentle Harmony is Everywhere.</Typography>
          <Link href="https://on.soundcloud.com/DU5at" target="_blank" rel="noopener noreferrer" sx={{ color: '#00a5d3' }}>
            Click here to listening
          </Link>
        </Box>
        <Grid item xs={12}>
          <Box>
            <iframe 
              width="100%" 
              height="166" 
              scrolling="no" 
              frameBorder="no" 
              allow="autoplay" 
              src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1567746709&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"
            />
          </Box>
          <Box sx={{
            padding: '5.25% 0 0 0',
          }}>
            <iframe 
              src="https://player.vimeo.com/video/846386343?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" 
              frameBorder="0" 
              style={{width:'100%', height: '100%',}}
              allow="autoplay; fullscreen; picture-in-picture" 
              allowFullScreen 
              title="DJ RISE Gentle Groovy Deep House #001"
              sx={{
                width: '100%',
                height: '100%',
              }} 
            />
          </Box>
        </Grid>
        <Grid container spacing={3} direction="column" alignItems="center">
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* <Link href="mailto:andrewrisedj@gmail.com" target="_blank" rel="noopener noreferrer" sx={{ color: '#00a5d3', textDecoration: 'none', ':hover': { color: '#037392', textDecoration: 'underline' } }}>Gmail</Link> */}
              <Link href="https://soundcloud.com/andrew_rise" target="_blank" rel="noopener noreferrer" sx={{ color: '#00a5d3', textDecoration: 'none', ':hover': { color: '#037392', textDecoration: 'underline' } }}>SoundCloud</Link>
              <Link href="https://www.facebook.com/andrewrisedj/" target="_blank" rel="noopener noreferrer" sx={{ color: '#00a5d3', textDecoration: 'none', ':hover': { color: '#037392', textDecoration: 'underline' } }}>Facebook</Link>
            </Box>
          </Grid>
          <Grid item xs={12}>
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
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default App;
