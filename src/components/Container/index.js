import React, { useState } from "react";
import PropTypes from "prop-types";
import { Header } from "../Header";
import "./Container.css";

const Container = props => {
  const [menu] = useState([
    {
      title: "Home",
      action: "/"
    }
  ]);
  
  return (
    <>
      <Header menu={menu}/>
      <div className="row center">
        <div className="content">{props.children}</div>
      </div>
    </>
  );
};

Container.propTypes = {
  children: PropTypes.node
};

export default Container;
