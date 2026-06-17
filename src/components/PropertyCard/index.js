import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import * as types from "../../constants/ActionTypes";
import ThumbSLider from "../ThumbSlider";
import BedIcon from '@mui/icons-material/Bed';
import ShowerIcon from '@mui/icons-material/Shower';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import SellIcon from '@mui/icons-material/Sell';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocationPinIcon from '@mui/icons-material/LocationOn';

const PropertyCard = ({ key, card, count }) => {

  const history = useHistory();
  const dispatch = useDispatch();
  const handleClick = (card) => {
    // console.log('click card', card)
    dispatch({
      type: types.RECEIVE_CHARACTER,
      payload: card
    })
    history.push(`/imovel/${card.id}/${card.titulo.replace(/[\s,]/g,"-").replace("/","-")}`)
  };

  return (
    <>
      <Card className="card" sx={{ maxWidth: 345 }}>
        <ThumbSLider
          height="180"
          image={card.Fotos?.slice(1)}
          alt={card.imovel}
          title={card.imovel}
          home="true"
        />

        {(count <= 2 && (
          <span className="badge-destaque">Destaque</span>
        ))}

        <CardActionArea
          sx={{
            '&:hover .MuiCardActionArea-focusHighlight': {
              opacity: 0,
            },
          }}
          onClick={() => handleClick(card)}
        >
          <CardContent className="CardContent">
            <Typography
              className="title-imovel"
              gutterBottom
              variant="h5"
            >
              {card.titulo}
            </Typography>

            <Typography
              className="descripition"
              gutterBottom
              variant="h5"
            >
              <LocationPinIcon className="LocationPinIcon" />
              {card.Bairro}
            </Typography>

            <Typography
              className="icon-card icon-sale"
              variant="body2"
              color="text.secondary"
            >
              {
                parseFloat((card.Tipo_de_Anuncio !== 'aluguel' ? card.Valor_Venda : card.Valor_Aluguel).replace('.', '')).toLocaleString(
                  'pt-BR',
                  {
                    style: 'currency',
                    currency: 'BRL',
                  }
                )
              }
            </Typography>

            {card?.Area_Terreno && parseInt(card.Area_Terreno) > 0 && (
              <Typography className="icon-card" variant="body2" color="text.secondary">
                <FullscreenIcon />
                {card.Area_Terreno} m<span className="mcubico" style={{ display: 'inline-block'}}>2</span>
              </Typography>
            )}

            {card?.Quartos && card.Quartos > 0 && (
              <Typography className="icon-card" variant="body2" color="text.secondary">
                <BedIcon /> 
                {card.Quartos}
              </Typography>
            )}
            
            
            {card?.Banheiros && card.Banheiros > 0 && (
              <Typography className="icon-card" variant="body2" color="text.secondary">
                <ShowerIcon /> 
                {card.Banheiros}
              </Typography>
            )}

            {card?.Vagas && card.Vagas > 0 &&  (
              <Typography className="icon-card" variant="body2" color="text.secondary">
                <DirectionsCarIcon /> 
                {card.Vagas}
              </Typography>
            )}

            <CardActions className="wrap-see-more">
              <Button
                className="see-more"
                variant="contained"
                onClick={() => handleClick(card)}
              >
                Ver Mais
              </Button>
            </CardActions>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
}

export default PropertyCard;
