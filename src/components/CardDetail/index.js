import React, { useState, useEffect } from "react";
import {useHistory} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import * as types from "../../constants/ActionTypes";
import ThumbSLider from "../ThumbSlider";
import "./Card.css";
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';

export default function MultiActionAreaCard(props) {
  const baseURL = process.env.REACT_APP_URL;
  const card = props.data.characterDetail[0]
console.log(props.avatar)
  return (
    <>
        <ThumbSLider 
          height="300"
          image={card.fotos}
          alt={card.imovel}
          title={card.imovel}
        />

        <div className="ThumbSLider-info">
          <Stack direction="row" spacing={2} className="avatar">
            <Avatar
              alt="Remy Sharp"
              src={baseURL + props.data.avatar}
              sx={{ width: 56, height: 56 }}
            />
          </Stack>
          <span className="imovel"> {card.imovel} </span>
          <span className="descricao"> {card.descricao} <b style={{ fontWeight: 600 }}>{card.id} </b> </span>
          <b style={{ fontWeight: 600 }}>Representante:</b> {card.autor.name} 
        </div>
                

    </>
  );
}