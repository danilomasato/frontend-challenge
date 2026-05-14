import React, { useState } from "react";
import logo from "../../assets/icon/logo_tsa.png";
import "../../css/libs/hamburgers.min.css";
import { NavLink } from "react-router-dom";
import "./Header.css";

const baseURL = process.env.REACT_APP_BASEURL;

export const Header = props => {
  const [btStatus, setBtStatus] = useState(true);

  const menu = [
    {
      title: "Início",
      action: "/"
    },
    {
      title: "Sobre Nós",
      action: "/sobre-nos"
    },
    {
      title: "Contato",
      action: "/contato"
    }
  ];

  const page = window.location.hash.replace('#','')

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
          <img src={`${baseURL}${logo}`} alt="logo" />
        </a>

        <ul id="nav">
          {menu.map((item, index) => (
            <>
              <li key={index} className={item.action === page ? 'active' : ''}>
                <NavLink to={item.action}>{item.title}</NavLink>
              </li>
          </>
        ))}
        </ul>
      </div>
    </header>
  );
};

export default Header;
