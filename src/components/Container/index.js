import React, { useState } from "react";
import PropTypes from "prop-types";
import "./Container.css";

const Container = props => {
  
  return (
    <>
      <div className={`row center ${props.className}`}>
        <div className="content">{props.children}</div>
      </div>
    </>
  );
};

Container.propTypes = {
  children: PropTypes.node
};

export default Container;
