import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import "./Contact.css";
import { Header } from "../../components/Header";
import { Loading } from "../../components/Loading";
import { TopInfo } from "../../components/TopInfo";
import { TopHeader } from "../../components/TopHeader";
import { Footer } from "../../components/Footer";

const Contact = ({ props }) => {

  return (
    <React.Fragment>
      <TopInfo />
      <Header />
      <TopHeader />

      <div className="row center">
        <div className="content" style={{ minHeight: "auto",  display: "block" }}>
          
        </div>
      </div>
    </React.Fragment>
  );
};

export default Contact;
