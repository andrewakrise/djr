import sunsetPartyPoster from "../assets/sunset-party.jpg";
import madgrill from "../assets/sep-16.jpg";
import recordworkz from "../assets/recordworkz-sep-18.jpg";
import upcomingEvent from "../assets/upcoming-event.png";

const eventData = [
  // {
  //   date: new Date("2023-09-30T19:30:00"),
  //   poster: upcomingEvent,
  //   title: "Upcoming Event Soon...",
  //   description: "The event's info will be provided soon.",
  //   mapsURL: "",
  //   ticketsURL: "",
  //   listenOn: "https://radio.recordworkz.com/",
  // },
  {
    date: new Date("2023-09-09T16:00:00"),
    poster: sunsetPartyPoster,
    title: "Sunset Electronic Party at Industrial Garden",
    description: "Step into serenity within the urban pulse.",
    mapsURL: "https://goo.gl/maps/Zim9xmhjUHFNn8zJ8",
    ticketsURL:
      "https://www.eventbrite.com/e/sunset-electronic-industrial-garden-open-air-tickets-701008604607",
    listenOn: "",
  },
  {
    date: new Date("2023-09-16T20:00:00"),
    poster: madgrill,
    title: "MED GRILE & BAR",
    description: "Come to enjoy the music on the right place",
    mapsURL: "https://goo.gl/maps/fAgL2RWj1pJ8w9iQ9",
    ticketsURL: "",
    listenOn: "",
  },
  {
    date: new Date("2023-09-18T18:00:00"),
    poster: recordworkz,
    title: "RWR Open Deck Night",
    description: "Available on Streama, Radio.net and MyTuner Radio.",
    mapsURL: "",
    ticketsURL: "",
    listenOn: "https://radio.recordworkz.com/",
  },
  {
    date: new Date("2023-09-30T19:30:00"),
    poster: upcomingEvent,
    title: "Upcoming Event Soon...",
    description: "The event's info will be provided soon.",
    mapsURL: "",
    ticketsURL: "",
    listenOn: "",
  },
];

export default eventData;
