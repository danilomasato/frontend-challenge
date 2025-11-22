import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import "./About.css";
import { Header } from "../../components/Header";
import { TopInfo } from "../../components/TopInfo";
import { TopHeader } from "../../components/TopHeader";
import { Footer } from "../../components/Footer";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import vania from '../../assets/images/vania.jpg';
import kleber from '../../assets/images/kleber.jpg';

const baseURL = process.env.REACT_APP_BASEURL;

const About = ({ props }) => {

  return (
    <React.Fragment>
      <TopInfo />
      <Header />
      <TopHeader />

      <div className="row center">
        <div className="content" style={{ minHeight: "auto",  display: "block" }}>
          <Box sx={{ width: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Nossos Especialistas
            </Typography>
          </Box>
          <br />

          <Card className="agents" sx={{ maxWidth: 345 }}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="140"
                image={`${baseURL}${vania}`}
                alt="green iguana"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Vania Albuquerque
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  <b>E-mail:</b> tudosobreape@gmail.com <br />
                  <b>Telefone:</b> (11) 961803698 <br />
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>

          <Card className="agents" sx={{ maxWidth: 345 }}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="140"
                image={`${baseURL}${kleber}`}
                alt="green iguana"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Cleber Dantas
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  <b>E-mail:</b> tudosobreape@gmail.com <br />
                  <b>Telefone:</b> (11) 949288228 <br />
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>

        </div>
      </div>

      <Footer />
    </React.Fragment>
  );
};

export default About;
