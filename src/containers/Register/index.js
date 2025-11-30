import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import "./Register.css";
import { Header } from "../../components/Header";
import { TopInfo } from "../../components/TopInfo";
import { TopHeader } from "../../components/TopHeader";
import { Footer } from "../../components/Footer";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import Typography from '@mui/material/Typography';
import axios from 'axios';

const Register = ({ props }) => {
const JWTToken = "b80e112ff544e1a8399201e6edb52393854b6e3e4903eaba176fcf52bd258c37b7b81454bdfb131181390d65727d8ca64e71e6c12112426d984513f29930d14444ca2a694bb62dd9cab3501ae120642fbb17235558ae03a1ee15a665476a80b39ddc22159169bbb71aacc90f8be07d2bfe867886ccbf2b037069a3c69635ac04"
  axios
  .post('http://localhost:1337/admin/users', {
    firstname: "jose",
    lastname: "silva",
    roles: ["2", "3"]
  }, {
  headers: {
    'Authorization': `Bearer ${JWTToken}`
  }
  })
  .then(response => {
    // Handle success.
    console.log('Well done!');
    console.log('User profile', response.data.user);
    console.log('User token', response.data.jwt);
  })
  .catch(error => {
    // Handle error.
    console.log('An error occurred:', error.response);
  });

  return (
    <React.Fragment>
      <TopInfo />
      <Header />
      <TopHeader />

      <div className="row center">
        <div className="content" style={{ minHeight: "auto",  display: "block" }}>
          <Box sx={{ width: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Teste
            </Typography>
          </Box>
          <br />
          <div className="form">
            <Box
              component="form"
              sx={{ '& > :not(style)': { m: 1, width: '100%' } }}
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
              <Button variant="contained" endIcon={<SendIcon />}>
                Enviar
              </Button>
            </Box>
          </div>
        </div>
      </div>

      <Footer />
    </React.Fragment>
  );
};

export default Register;
