import React from "react";
import { Link } from "react-router-dom";
import logo from "./../../assets/logos/logo_landing.png";
import { useAuth } from "../../context/AuthContext";

import logoWhite from "./.././../assets/logos/inn.png";

const Navbar = ({ isBackground }) => {
  const auth = useAuth();
  // handles hamburger click on mobiles
  const mobileNav = () => {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  };
  const closeNav = () => {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  };
  return (
    <nav className={`navbar ${isBackground ? "colour-back" : ""}`}>
      <div className="nav-logo">
        <Link to="/">
          <img alt="Revels Logo" src={logoWhite}></img>
        </Link>
      </div>
      <ul className="nav-menu">
        {auth.user && (
          <li className="nav-item" onClick={closeNav}>
            <a href="/dashboard/profile" className="nav-link">
              Dashboard
            </a>
          </li>
        )}
        {/* <li className="nav-item" onClick={closeNav}>
          <a href="/rulebook" className="nav-link">
            Rulebook
          </a>
        </li> */}
        {/* <li className="nav-item" onClick={closeNav}>
                  <a href="/proshow" className="nav-link">Proshow</a>
              </li> */}

        <li className="nav-item" onClick={closeNav}>
          <a href="/Policies" className="nav-link"></a>
        </li>
        <li className="nav-item" onClick={closeNav}>
          <a href="/tshirts" className="nav-link">
            Insurances
          </a>
        </li>

        <li className="nav-item" onClick={closeNav}>
          {auth.user ? (
            <a onClick={auth.userLogout} className="nav-link">
              Logout
            </a>
          ) : (
            <a href="/login" className="nav-link">
              Login
            </a>
          )}
        </li>
      </ul>
      <div className="hamburger" onClick={mobileNav}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
    </nav>
  );
};

export default Navbar;
