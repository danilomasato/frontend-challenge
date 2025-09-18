import React, { useState, useEffect } from "react";
import {useHistory} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import * as types from "../../constants/ActionTypes";
import ThumbSLider from "../ThumbSlider";
import "./Card.css";


export default function MultiActionAreaCard(props) {

  const baseURL = process.env.REACT_APP_URL;
  const card = props.data.characterDetail[0]

  return (
    <>

        <Card className="card" key={card.id} sx={{ maxWidth: 345 }}>
          <CardActionArea>
            <ThumbSLider 
              height="140"
              image={card.fotos}
              alt={card.imovel}
              title={card.imovel}
            />
            <CardContent>
              <Typography className="title-imovel" gutterBottom variant="h5" component="div">
                {card.imovel} 
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {card.descricao} <b style={{ fontWeight: 600 }}>{card.id} </b>
              </Typography><br />
              <Typography variant="body2" color="text.secondary">
                <b style={{ fontWeight: 600 }}>Representante:</b> {card.autor.name} 
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button className="see-more" variant="contained" style={{ width: "100%" }}>
              Ver Mais
            </Button>
          </CardActions>
        </Card>
    </>
  );
}