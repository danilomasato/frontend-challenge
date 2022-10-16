import React, { useState, useEffect } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';

export default function MultiActionAreaCard(props) {

  const [characters, setCharacters] = React.useState([]);

  //first load
  useEffect(() => {
    if (props.data.results?.length > 0) {
      setCharacters(props.data.results);
    }
  }, [props.data]);

  return (
    <>
    {characters.map(
      card =>
        <Card key={card.id} sx={{ maxWidth: 345 }}>
          <CardActionArea>
            <CardMedia
              component="img"
              height="140"
              image={card.image}
              alt="green iguana"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {card.name} 
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Quantidade de Episódios: <b style={{ fontWeight: 600 }}>{card.episode.length} </b>
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button size="small" color="primary">
              Ver Mais
            </Button>
          </CardActions>
        </Card>
      )}
    </>
  );
}