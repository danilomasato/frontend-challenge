import React, { useState } from "react";
import logo from "../../assets/icon/logo.jpg";
import "../../css/libs/hamburgers.min.css";
import { NavLink } from "react-router-dom";
import "./Header.css";

export const Header = data => {
  const [btStatus, setBtStatus] = useState(true);

  return (
    <header id="header" className={`${btStatus ? "" : "header-expanded"} `}>
      <div className="row" style={{ width: "980px", margin: "0 auto" }}>
        <div
          className={`hamburger hamburger--spin ${
            btStatus ? "" : "is-active"
          } `}
          onClick={() => {
            setBtStatus(!btStatus);
          }}
        >
          <div className="hamburger-box">
            <div className="hamburger-inner"></div>
          </div>
        </div>

        <a className="header-logo" href="/">
          <img src={logo} alt="logo" />
        </a>

        <ul id="nav">
          {data.menu.map((movie, index) => (
        	<li key={index}>
            	<NavLink to={movie.action}>{movie.title}</NavLink>
          	</li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Header;
