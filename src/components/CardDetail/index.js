import React, { useState, useEffect } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import * as types from "../../constants/ActionTypes";

export default function MultiActionAreaCard(props) {

  const [character, setCharacter] = React.useState([]);

  //first load
  useEffect(() => {
    if (props.data.characterDetail?.length > 0) {
      setCharacter(props.data.characterDetail[0]);
    }
  }, [props.data.characterDetail]);

  return (
    <>
        <Card sx={{ maxWidth: 345 }} >
          <CardActionArea>
            <CardMedia
              component="img"
              height="140"
              image={character.image}
              alt="green iguana"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                <b style={{ fontWeight: 600 }}>Nome: </b> {character.name} 
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <b style={{ fontWeight: 600 }}>Genero: </b> {character.gender} 
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <b style={{ fontWeight: 600 }}>Especie: </b> {character.species} 
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <b style={{ fontWeight: 600 }}>Tipo: </b> {character.type} 
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
    </>
  );
}