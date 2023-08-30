import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Event from './Event';

function EventSlider({ events, isPreview = false }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: isPreview ? 2 : 1,
    slidesToScroll: 1
  };

  return (
    <Slider {...settings}>
      {events.map((event, index) => (
        <Event key={index} {...event} />
      ))}
    </Slider>
  );
}

export default EventSlider;
