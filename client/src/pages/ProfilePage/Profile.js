import React, { useEffect, useState } from "react";
import logoWhite from "./.././../assets/logos/logo_white.png";
import "./Profile.scss";
import aagaz from "./.././../assets/logos/inn.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import QRCode from "react-qr-code";
import toast from "react-hot-toast";
import axios from "axios";
import Loader from "../Loader/Loader";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { Link } from "react-router-dom";
import { TOKEN_ID } from "../../utils/constants";
function Profile() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [ref, setReferral] = useState({});
  const getRefferalDeets = async () => {
    try {
      let authorization = localStorage.getItem(TOKEN_ID);
      console.log(authorization);
      const res = await axios.get("/insurance/ref-info", {
        headers: { Authorization: "Bearer " + authorization },
      });
      setReferral(res.data.ref);
      console.log(res.data.ref);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (!auth.loading) {
      getRefferalDeets();
      if (!auth.user) {
        console.log(auth.user);
        navigate("/");
      }
    }
  }, [auth.loading, auth.user, navigate]);

  return auth.loading ? (
    <Loader />
  ) : (
    <div className="layout-wrapper">
      <nav className="profile-nav">
        <div className="brand">
          <img alt="Revels Logo" src={logoWhite}></img>
          <div>
            <h4 className="font-medium">InClaim</h4>
            <p className="font-light">Welcome back {auth.user.name}</p>
          </div>
        </div>
        <i className="fa fa-bell "></i>
      </nav>
      <div className="dash-wrapper">
        <div className="profile-sidebar p-3"></div>

        <div
          className={
            auth.user.isMahe === 0 && auth.user.documents === undefined
              ? "profile-content-area extended-two"
              : auth.user.isMahe === 0 &&
                auth.user.documents !== undefined &&
                (auth.user.status === "REJECTED" ||
                  auth.user.status === "UNVERIFIED")
              ? "profile-content-area extended"
              : "profile-content-area "
          }
        >
          <Link
            to="/dashboard/events"
            style={{ textDecoration: "none" }}
            className="back-btn w-100"
          >
            <i className="fa fa-angle-left fa-2x"></i>
            <p>Dashboard</p>
          </Link>
          <div className="text-details-user">
            <div className="name-user font-medium">
              <h1>{auth.user.name}</h1>
              <p>{auth.user.email}</p>
              <span className="border-box">User ID: {auth.user.userID}</span>
            </div>
            <div className="grid font-medium">
              <div className="">
                <h1>Customer Score</h1>
                <p>{auth.user.score ?? 100}</p>
              </div>
              <div>
                <h1>Total Referrals</h1>
                <p>{ref.totalUses ?? 0}</p>
              </div>
            </div>
            <div className="grid font-medium">
              {ref.usedBy?.map((user) => (
                <>
                  <div className="">
                    <h1>UsedBy</h1>
                    <p>{user.name ?? 100}</p>
                  </div>
                </>
              ))}
            </div>
          </div>

          <div className="aagaz">
            <img src={aagaz} alt="InClaim" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
