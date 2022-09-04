import React from "react";
import PropTypes from "prop-types";
import { Header } from "../Header";
import "./Container.css";

const Container = props => {
  return (
    <>
      <Header menu={props.menu}/>
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
