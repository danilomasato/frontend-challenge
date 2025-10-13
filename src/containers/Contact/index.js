import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import "./Contact.css";
import { Header } from "../../components/Header";
import { TopInfo } from "../../components/TopInfo";
import { TopHeader } from "../../components/TopHeader";
import { Footer } from "../../components/Footer";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

const Contact = ({ props }) => {

  return (
    <React.Fragment>
      <TopInfo />
      <Header />
      <TopHeader />

      <div className="row center">
        <div className="content" style={{ minHeight: "auto",  display: "block" }}>

          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3653.974055769659!2d-46.71446422392879!3d-23.676885778720624!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce51cc5a3127fb%3A0x4815a5b3d2fbe069!2sAv.%20do%20Rio%20Bonito%2C%20162%20-%20Socorro%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2004776-000!5e0!3m2!1spt-BR!2sbr!4v1760388420153!5m2!1spt-BR!2sbr" width="600" height="450" style={{ border: "0" }} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>

          <Box
            component="form"
            sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
            noValidate
            autoComplete="off"
          >
            <TextField id="outlined-basic" label="Digite seu Nome..." variant="outlined" />
            <TextField id="outlined-basic" label="Digite seu Email..." variant="outlined" />
            <TextField
              id="outlined-multiline-static"
              label="Como podemos Ajudar?"
              multiline
              rows={4}
              defaultValue=""
            />

          </Box>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Contact;
