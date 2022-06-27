import React from "react";
import "./Landing.scss";
import "./Navbar.css";
import Helmet from "react-helmet";
import vid from "./.././../assets/dir.mp4";
import tree from "./../../assets/backgrounds/tree.png";
import two from "./../../assets/backgrounds/two.png";
import sun from "./../../assets/backgrounds/sun.png";
import birds from "./../../assets/backgrounds/birds.png";
import three from "./../../assets/backgrounds/three.png";
import topCloud from "./../../assets/backgrounds/topCloud.svg";
import bottomCloud from "./../../assets/backgrounds/bottomCloud.svg";
import four from "./../../assets/backgrounds/four.svg";
import Inclaim from "./../../assets/Inclaim.png";
import Navbar from "../../components/Navbar/Navbar";

const Landing = () => {
  return (
    <div className="landing-wrapper">
      <Helmet>
        <title>InClaim</title>
        <meta name="description" content="Inclaim | Revels 2022" />
        <meta name="theme-color" content="#FFFFFF" />
        <meta
          name="keywords"
          content="revels, revelsmit, manipal, manipal institute of technology, 2022, sports, cultural, fest, national, Inclaim, beginnings"
        />
        <meta name="url" content="https://revelsmit.in" />
        <meta name="coverage" content="Worldwide" />
        <meta name="target" content="all" />
        <meta name="HandheldFriendly" content="True" />
        <link rel="canonical" href="https://revelsmit.in" />
        {/* OG meta tags */}
        <meta property="og:type" content="webpage" />
        <meta property="og:title" content="InClaim" />
        <meta property="og:description" content="Inclaim | Revels '22" />
        <meta property="og:image" content="" />
        <meta property="og:url" content="https://revelsmit.in" />
        <meta property="og:site_name" content="Inclaim | Revels '22" />
        <meta name="twitter:title" content="Inclaim | Revels '22" />
        <meta
          name="twitter:description"
          content="The official website of Inclaim | Revels '22"
        />
      </Helmet>
      <div className="content-wrapper">
        <Navbar />
        <div className="font- antiga landing-title">
          <video src={vid} autoPlay muted={false} controls />
        </div>
      </div>
    </div>
  );
};

export default Landing;
