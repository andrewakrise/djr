import Events from './Events';
import { Box, Typography } from '@mui/material';
import eventData from '../assets/eventsData';

function EventThumbnail({ poster, title }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 1,
        borderRadius: '4px',
        overflow: 'hidden',
      }}
    >
      <img 
        src={poster}
        alt="Event Poster" 
        style={{width: '100%', height: 'calc(150px + 15vmin)', objectFit: 'fill'}}
      />
      <Typography 
        sx={{ 
          mt: 1, 
          fontSize: 'calc(5px + 1vmin)',
          textAlign: 'center'
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}

export default function EventPreview({ onClick }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        overflowX: 'auto',
        gap: '12px',
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      {eventData.slice(0, 2).map((event, index) => (
        <EventThumbnail key={index} {...event} />
      ))}
    </Box>
  );
}

