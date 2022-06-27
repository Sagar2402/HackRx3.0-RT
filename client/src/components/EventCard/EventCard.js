import React from "react";
import "./EventCard.scss";
import { Link } from "react-router-dom";
const EventCard = ({ data, index, isMyEvents, isPublic }) => {
  console.log("here", data);
  const eventPath = isMyEvents
    ? `/dashboard/myevents/${data._id}`
    : isPublic
    ? `/events/${data._id}`
    : `/dashboard/event/${data._id}`;
  const eventCardColours = ["event-back-1", "event-back-2"];
  return (
    <div
      className={`event-card-wrapper card-up ${eventCardColours[index % 2]}`}
    >
      <div className="event-content">
        <div className="event-header">
          <div className="event-area">
            {/* <p className="font-heavy">{data.category.category}</p> */}
            <h3 className="font-light">{data.title}</h3>
          </div>
          <div className="button-area">
            <button className="mode">{data.insurance.type}</button>
            <Link to={eventPath}>
              <button className="det">{data.insurance.name}</button>
            </Link>
          </div>
        </div>
        <div className="tags-line flex-wrap mt-1">
          {data.tags != undefined
            ? data.tags.map((val, index) => {
                return (
                  <p key={index} className="font-light">
                    {val}
                    {index !== data.tags.length - 1 ? " ◦" : ""}
                  </p>
                );
              })
            : null}
        </div>
        <div className="description font-medium">{data.description}</div>
        <div className="data-area">
          <div className="box-wrapper">
            <div className="box">
              <p className="font-heavy">Claim Number</p>
              <h3 className="font-light">{data.number}</h3>
            </div>
            <div className="box">
              <p className="font-heavy">Status</p>
              <h3 className="font-light">{data.status}</h3>
            </div>
            <div className="box">
              <p className="font-heavy">Valid</p>
              <h3 className="font-light">
                {data.isVlaid == null ? "NA" : data.isVlaid ? "yes" : "no"}
              </h3>
            </div>
            {data.createdAt && (
              <div className="box">
                <p className="font-heavy">DATE</p>
                <h3 className="font-light">
                  {new Date(data.createdAt).getDate()}/
                  {new Date(data.createdAt).getMonth() + 1}/
                  {new Date(data.createdAt).getFullYear()}
                </h3>
              </div>
            )}
            {data.createdAt && (
              <div className="box">
                <p className="font-heavy">TIME</p>
                <h3 className="font-light">
                  {new Date(data.createdAt).getHours()}:{" "}
                  {new Date(data.createdAt).getMinutes()}
                </h3>
              </div>
            )}
            {data.insurance.price && (
              <div className="box">
                <p className="font-heavy">Files</p>
                {data.files &&
                  data.files.map((file) => (
                    <h3 className="font-light">{file.name}</h3>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
