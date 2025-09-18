import React, { useState, useEffect } from "react";
import {useHistory} from 'react-router-dom';
import { useDispatch } from 'react-redux';
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
        <ThumbSLider 
          height="300"
          image={card.fotos}
          alt={card.imovel}
          title={card.imovel}
        />

        <div className="ThumbSLider-info">
          <span className="imovel"> {card.imovel} </span>
          <span className="descricao"> {card.descricao} <b style={{ fontWeight: 600 }}>{card.id} </b> </span>
          <b style={{ fontWeight: 600 }}>Representante:</b> {card.autor.name} 
        </div>
                

    </>
  );
}