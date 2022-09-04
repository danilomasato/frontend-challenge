import React, { useState } from "react";
import logo from "../../assets/icon/logo.svg";
import "../../css/libs/hamburgers.min.css";
import { NavLink } from "react-router-dom";
import "./Header.css";

export const Header = data => {
  const [btStatus, setBtStatus] = useState(true);

  return (
    <header id="header" className={`${btStatus ? "" : "header-expanded"} `}>
      <div className="row">
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
