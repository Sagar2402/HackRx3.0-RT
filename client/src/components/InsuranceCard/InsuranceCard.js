import React from "react";
import "./InsuranceCard.scss";
import { Link } from "react-router-dom";
const InsuranceCard = ({ data, index, isMyEvents, isPublic }) => {
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
            <h3 className="font-light">{data.insurance.name}</h3>
          </div>
          <div className="button-area">
            <button className="mode">{data.insurance.type}</button>
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
        <div className="description font-medium">
          {data.insurance.description}
        </div>
        <div className="data-area">
          <div className="box-wrapper">
            <div className="box">
              <p className="font-heavy">Insurance Id</p>
              <h3 className="font-light">{data.insurance.insuranceId}</h3>
            </div>
            <div className="box">
              <p className="font-heavy">Max Claims</p>
              <h3 className="font-light">{data.insurance.maxClaims}</h3>
            </div>
            <div className="box">
              <p className="font-heavy">Claims</p>
              <h3 className="font-light">{data.claims}</h3>
            </div>

            <div className="box">
              <p className="font-heavy">Active</p>
              <h3 className="font-light">
                {data.isActive == null ? "NA" : data.isActive ? "yes" : "no"}
              </h3>
            </div>
            <br />
            <br />
            {data.createdAt && (
              <div className="box">
                <p className="font-heavy">DATE Purchased</p>
                <h3 className="font-light">
                  {new Date(data.createdAt).getDate()}/
                  {new Date(data.createdAt).getMonth() + 1}/
                  {new Date(data.createdAt).getFullYear()}
                </h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceCard;
