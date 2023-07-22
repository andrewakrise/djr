import { AppBar, Toolbar, Box, Link } from '@mui/material';

const Navbar = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 'calc(10px + 2vmin)',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 'calc(10px + 2vmin)',
        flexGrow: 1, minHeight:'100%', p: 2
      }}
    >
      <Link href="mailto:andrewrisedj@gmail.com" target="_blank" rel="noopener noreferrer" sx={{ color: '#00a5d3', textDecoration: 'none', ':hover': { color: '#037392', textDecoration: 'underline' } }}>
        Gmail
      </Link>
      <Link href="https://soundcloud.com/andrew_rise" target="_blank" rel="noopener noreferrer" sx={{ color: '#00a5d3', textDecoration: 'none', ':hover': { color: '#037392', textDecoration: 'underline' } }}>
        SoundCloud
      </Link>
      <Link href="https://www.facebook.com/andrewrisedj/" target="_blank" rel="noopener noreferrer" sx={{ color: '#00a5d3', textDecoration: 'none', ':hover': { color: '#037392', textDecoration: 'underline' } }}>
        Facebook
      </Link>
    </Box>
  );
};

export default Navbar;
