import React, { useState, useEffect } from "react";
import {useHistory} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import * as types from "../../constants/ActionTypes";

export default function MultiActionAreaCard(props) {

  const [articles, setArticles] = useState([]);
  const history = useHistory();
  const dispatch = useDispatch();
  const baseURL = process.env.REACT_APP_URL;

  //first load
  useEffect(() => {
    let character = props.data.character.data

    if (character?.length > 0) {
      setArticles(character);
    }
  }, [props]);

  const handleClick = cardID => {
    dispatch({
      type: types.RECEIVE_CHARACTER,
      payload: articles.filter(item => item.id === cardID)
    })

    history.push('/character')
  };

  return (
    <>
    {articles.map(
      card =>
        <Card key={card.id} sx={{ maxWidth: 345 }} onClick={(e) => {handleClick(card.id) } }>
          <CardActionArea>
            <CardMedia
              component="img"
              height="140"
              image={`${baseURL}${card.cover.url}`}
              alt={card.slug}
              title={card.slug}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {card.title} 
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {card.description} <b style={{ fontWeight: 600 }}>{card.id} </b>
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