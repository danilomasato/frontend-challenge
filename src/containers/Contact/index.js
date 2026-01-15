import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import "./Contact.css";
import { Header } from "../../components/Header";
import { TopInfo } from "../../components/TopInfo";
import { TopHeader } from "../../components/TopHeader";
import { Footer } from "../../components/Footer";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import Typography from '@mui/material/Typography';

const Contact = ({ props }) => {
  const [contact, SetContact] = useState({ 
    name: "", 
    email: "", 
    message: "" 
  })

  const handleSubmit = (event) => {

    event.preventDefault();

    // 3. Convert the plain object to a JSON string
    const payload = JSON.stringify(contact)
console.log("formData=====================>", payload)


    // fetch('/api/endpoint', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: payload,
    // }).then(() => console.log('Posted data successfully!'));
  };

  return (
    <React.Fragment>
      <TopInfo />
      <Header />

      <div className="row center">
        <div className="content" style={{ minHeight: "auto",  display: "block" }}>
          
            <Box sx={{ width: '100%' }}>
              <Typography variant="h5" gutterBottom>
                Fale Conosco
              </Typography>
            </Box>
            <br />
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3653.9601015474373!2d-46.71441682392875!3d-23.677384778720306!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce51cc54634aaf%3A0x1b38a6c93014816c!2sR.%20Cassino%2C%2013%20-%20Jardim%20dos%20Lagos%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2004768-200!5e0!3m2!1spt-BR!2sbr!4v1763751155851!5m2!1spt-BR!2sbr" width="450" height="450" style={{ border: "0" }} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            <div className="form">
              <Box
                component="form"
                sx={{ '& > :not(style)': { m: 1, width: '100%' } }}
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit}
              >
                <TextField onChange={(e) => SetContact({...contact, name: e.target.value})} id="outlined-basic" label="Digite seu Nome..." variant="outlined" />
                <TextField onChange={(e) => SetContact({...contact, email: e.target.value})} id="outlined-basic" label="Digite seu Email..." variant="outlined" />
                <TextField
                  onChange={(e) => SetContact({...contact, message: e.target.value})}
                  id="outlined-multiline-static"
                  label="Como podemos Ajudar?"
                  multiline
                  rows={4}
                  defaultValue=""
                />
                <Button onClick={(e) => handleSubmit(e)}type="submit" variant="contained" endIcon={<SendIcon />}>
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

export default Contact;
