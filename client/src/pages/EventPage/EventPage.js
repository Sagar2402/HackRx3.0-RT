import React, { useEffect, useState } from "react";
import axios from "axios";
import Helmet from "react-helmet";
import EventCard from "../../components/EventCard/EventCard";
import Lottie from "lottie-react";
import noEvents from "../../assets/noEvents.json";
import Loader from "../Loader/Loader";
import "./TabSwitch.css";
import "./search.scss";
import { TOKEN_ID } from "../../utils/constants";
import InsuranceCard from "../../components/InsuranceCard/InsuranceCard";
const Events = ({ isPublic }) => {
  const [events, setEvents] = useState([]);
  const [tab, settab] = useState(0);
  const [isShuffle, setIsShuffle] = useState(true);
  // method to fetch all the events
  const getAllEvents = async () => {
    try {
      let authorization = localStorage.getItem(TOKEN_ID);
      console.log(authorization);
      const res = await axios.get("/insurance/user", {
        headers: { Authorization: "Bearer " + authorization },
      });
      console.log("1", res.data);
      setEvents(res.data.data);
      console.log(2, events);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllEvents();
  }, []);
  // method to filter the array
  const filterEvents = async (e) => {
    setIsShuffle(false);
    if (e.target.value === "") {
      getAllEvents();
      let filteredEventsByType = events.filter((event) =>
        tab === 0
          ? event.insurance.type.toLowerCase().includes("health")
          : event.insurance.type.toLowerCase().includes("motor")
      );
      setEvents(filteredEventsByType);
      setIsShuffle(true);
    }
    // let filteredEventsByCategory = events.filter(
    //   (event) => event.category.category.toLowerCase().includes(e.target.value.toLowerCase())
    // )
    let filteredEventsByName = events.filter((event) =>
      event.insurance.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    // if(filteredEventsByCategory.length !== 0){
    //   setEvents(filteredEventsByCategory)
    // }
    console.log("hereeee", filteredEventsByName);
    setEvents(filteredEventsByName);
  };
  // method to shuffle the events array
  const shuffleArray = (array) => {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)
      .filter((event) => {
        return tab === 0
          ? event.insurance.type === "Health"
          : event.insurance.type === "Motor";
      });
  };
  return (
    <>
      <div className="d-flex flex-md-row flex-column align-items-center">
        <Helmet>
          <title>Events | InClaim</title>
          <meta name="description" content="Events | Inclaim" />
          <meta name="theme-color" content="#FFFFFF" />
          <meta
            name="keywords"
            content="events, revels, revelsmit, manipal, manipal institute of technology, 2022, sports, cultural, fest, national, Inclaim, beginnings"
          />
          <meta name="url" content="https://revelsmit.in/events" />
          <meta name="coverage" content="Worldwide" />
          <meta name="target" content="all" />
          <meta name="HandheldFriendly" content="True" />
          <link rel="canonical" href="https://revelsmit.in/events" />
          {/* OG meta tags */}
          <meta property="og:type" content="webpage" />
          <meta property="og:title" content="Inclaim | Revels '22" />
          <meta property="og:description" content="Inclaim | Revels '22" />
          <meta property="og:image" content="" />
          <meta property="og:url" content="https://revelsmit.in/events" />
          <meta property="og:site_name" content="Inclaim | Revels '22" />
          <meta name="twitter:title" content="Inclaim | Revels '22" />
          <meta
            name="twitter:description"
            content="The official website of Inclaim | Revels '22"
          />
        </Helmet>
        <div class="search-box font-medium">
          <button class="btn-search">
            <i class="fa fa-search text-white"></i>
          </button>
          <input
            type="text"
            class="input-search"
            onChange={(e) => filterEvents(e)}
            placeholder="Type to Search..."
          />
        </div>
        <div className="tabs-wrapper font-medium">
          <div
            className={
              tab === 0
                ? "taeb-switch left text-center"
                : "taeb-switch right text-center"
            }
          >
            <div
              className={tab === 0 ? "taeb active font-heavy" : "taeb"}
              taeb-direction="left"
              onClick={() => settab(0)}
            >
              Health
            </div>
            <div
              className={tab === 1 ? "taeb active font-heavy" : "taeb"}
              taeb-direction="right"
              onClick={() => settab(1)}
            >
              Motor
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "start",
          flexWrap: "wrap",
          gap: "10px",
          height: "fit-content",
        }}
      >
        {events ? (
          isShuffle ? (
            shuffleArray(events).map((eventData, index) => {
              return (
                <InsuranceCard
                  key={index}
                  index={index}
                  data={eventData}
                  isMyEvents={false}
                  isPublic={isPublic}
                />
              );
            })
          ) : (
            events
              .filter((event) => {
                return tab === 0
                  ? event.type === "Health"
                  : event.type === "Motor";
              })
              .map((eventData, index) => {
                return (
                  <InsuranceCard
                    key={index}
                    index={index}
                    data={eventData}
                    isMyEvents={false}
                    isPublic={isPublic}
                  />
                );
              })
          )
        ) : (
          <Loader />
        )}
        {events.filter((event) => {
          console.log(event);
          return tab === 0
            ? event.insurance.type === "Health"
            : event.insurance.type === "Motor";
        }).length === 0 && (
          <div className="py-5 w-md-100 w-50 mx-auto text-center d-flex flex-column justify-content-center align-items-center">
            <Lottie animationData={noEvents} loop />
            <h3
              className="font-heavy"
              style={{ color: "#c4515c", fontSize: "2rem" }}
            >
              NO Insurance Purchased!
            </h3>
          </div>
        )}
      </div>
    </>
  );
};

export default Events;
