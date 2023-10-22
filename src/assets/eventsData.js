import sunsetPartyPoster from "../assets/sunset-party.jpg";
import madgrill from "../assets/sep-16.jpg";
import recordworkz from "../assets/recordworkz-sep-18.jpg";
import vanCruise from "../assets/vcyp-sep-30.jpg";
import bsideRadio from "../assets/bside-radio-fri-oct-27th.jpeg";

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
    poster: vanCruise,
    title: "VANCOUVERS BIGGEST YACHT PARTY",
    description:
      "Vancouver's Biggest Yacht Party on September 30th! Get ready for an unforgettable night of excitement aboard the abitibi yacht.",
    mapsURL: "https://maps.app.goo.gl/WuvfRSMLp2ryNdWv5",
    ticketsURL:
      "https://www.eventbrite.com/e/glowwave-a-radiant-yacht-party-experience-tickets-703778720097?aff=oddtdtcreator",
    listenOn: "",
  },
  {
    date: new Date("2023-10-27T17:00:00"),
    poster: bsideRadio,
    title: "BSIDE RADIO RISE DJ POP-UP",
    description: `Bside Radio is the online community radio station of The 
    Beaumont Studios Artist Society, broadcasting gratefully on the traditional, 
    ancestral lands and unceded territories of the xʷməθkʷəy̓əm (Musqueam), 
    Sḵwx̱wú7mesh (Squamish), and Sel̓íl̓witulh (Tsleil-Waututh) Nations. Vancouver, BC.`,
    mapsURL: "",
    ticketsURL: "",
    listenOn: "https://thebeaumontstudios.com/bside-radio/",
  },
];

export default eventData;
