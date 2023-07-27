import { Box, Grid, Link } from '@mui/material';

const Navbar = () => {
  return (
    <Grid container sx={{ p: 'calc(5px + 1vmin)', flexGrow: 1, minHeight: '100%', alignItems: 'center', justifyContent: 'center' }}>
      <Grid item xs={6} sm={3} md={2}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: { xs: 'center' },
            fontSize: 'calc(10px + 2vmin)',
            mb: { xs: 2 },
            mr: { xs: 2 },
          }}
        >
          <Link
            href="https://soundcloud.com/andrew_rise"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: '#282c34',
              textDecoration: 'none',
              ':hover': {
                color: '#037392',
                textDecoration: 'underline'
              }
            }}
          >
            SoundCloud
          </Link>
        </Box>
      </Grid>
      <Grid item xs={6} sm={3} md={2}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: { xs: 'center' },
            fontSize: 'calc(10px + 2vmin)',
            mb: { xs: 2 }
          }}
        >
          <Link
            href="https://www.facebook.com/andrewrisedj/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: '#282c34',
              textDecoration: 'none',
              ':hover': {
                color: '#037392',
                textDecoration: 'underline'
              }
            }}
          >
            Facebook
          </Link>
        </Box>
      </Grid>
      <Grid item xs={6} sm={3} md={2}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: { xs: 'center' },
            fontSize: 'calc(10px + 2vmin)',
            mb: { xs: 2}
          }}
        >
          <Link
            href="https://www.instagram.com/andrewrisedj/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: '#282c34',
              textDecoration: 'none',
              ':hover': {
                color: '#037392',
                textDecoration: 'underline'
              }
            }}
          >
            Instagram
          </Link>
        </Box>
      </Grid>
      <Grid item xs={6} sm={3} md={2}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: { xs: 'center' },
            fontSize: 'calc(10px + 2vmin)',
            mb: { xs: 2}
          }}
        >
          <Link
            href="https://www.youtube.com/@risedj/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: '#282c34',
              textDecoration: 'none',
              ':hover': {
                color: '#037392',
                textDecoration: 'underline'
              }
            }}
          >
            YouTube
          </Link>
        </Box>
      </Grid>
      <Grid item xs={6} sm={3} md={2}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: { xs: 'center' },
            fontSize: 'calc(10px + 2vmin)',
            mb: { xs: 2}
          }}
        >
          <Link
            href="https://vimeo.com/risedj/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: '#282c34',
              textDecoration: 'none',
              ':hover': {
                color: '#037392',
                textDecoration: 'underline'
              }
            }}
          >
            Vimeo
          </Link>
        </Box>
      </Grid>
      <Grid item xs={6} sm={3} md={2}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: { xs: 'center' },
            fontSize: 'calc(10px + 2vmin)',
            mb: { xs: 2}
          }}
        >
          <Link
            href="https://www.mixcloud.com/andrewrisedj/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: '#282c34',
              textDecoration: 'none',
              ':hover': {
                color: '#037392',
                textDecoration: 'underline'
              }
            }}
          >
            Mixcloud
          </Link>
        </Box>
      </Grid>

    </Grid>
  );
};

export default Navbar;
