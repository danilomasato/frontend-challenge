import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button, CardActions } from '@mui/material';

import * as types from "../../constants/ActionTypes";

import ThumbSLider from "../ThumbSlider";

import BedIcon from '@mui/icons-material/Bed';
import ShowerIcon from '@mui/icons-material/Shower';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import LocationPinIcon from '@mui/icons-material/LocationOn';


const PropertyCard = ({ card, count }) => {

  const history = useHistory();
  const dispatch = useDispatch();


  /*
   * =====================================================
   * TÍTULO
   * =====================================================
   *
   * Alguns imóveis podem chegar com titulo = null.
   * Nunca devemos chamar .replace() diretamente nesse
   * caso.
   */

  const title =
    typeof card?.titulo === "string" &&
    card.titulo.trim()
      ? card.titulo.trim()
      : "Imóvel";


  /*
   * =====================================================
   * SLUG
   * =====================================================
   */

  const slug = title
    .replace(/[\s,]/g, "-")
    .replace(/\//g, "-");


  /*
   * =====================================================
   * VALOR
   * =====================================================
   */

  const rawValue =
    card?.Tipo_de_Anuncio !== "aluguel"
      ? card?.Valor_Venda
      : card?.Valor_Aluguel;


  const numericValue =
    rawValue !== null &&
    rawValue !== undefined &&
    rawValue !== ""
      ? parseFloat(
          String(rawValue)
            .replace(/\./g, "")
            .replace(",", ".")
        )
      : 0;


  const formattedValue =
    numericValue > 0
      ? numericValue.toLocaleString(
          "pt-BR",
          {
            style: "currency",
            currency: "BRL"
          }
        )
      : "Consultar";


  /*
   * =====================================================
   * ABRIR IMÓVEL
   * =====================================================
   */

  const handleClick = (property) => {

    if (!property) {
      return;
    }


    dispatch({
      type: types.RECEIVE_CHARACTER,
      payload: property
    });


    history.push(
      `/imovel/${property.id}/${slug}`,
      {
        fromCard: true
      }
    );


    sessionStorage.clear();

  };


  return (

    <Card
      className="card"
      sx={{
        maxWidth: 345
      }}
    >

      <ThumbSLider
        height="180"
        image={
          Array.isArray(card?.Fotos)
            ? card.Fotos.slice(1)
            : []
        }
        alt={title}
        title={title}
        home="true"
      />


      {count <= 2 && (
        <span className="badge-destaque">
          Destaque
        </span>
      )}


      <div
        className="card-action-area"
        onClick={() => handleClick(card)}
      >

        <CardContent className="CardContent">

          <Typography
            className="title-imovel"
            gutterBottom
            variant="h5"
          >
            {title}
          </Typography>


          <Typography
            className="descripition"
            gutterBottom
            variant="h5"
          >

            <LocationPinIcon className="LocationPinIcon" />

            {card?.Bairro || "São Paulo"}

          </Typography>


          <Typography
            className="icon-card icon-sale"
            variant="body2"
            color="text.secondary"
          >

            {formattedValue}

          </Typography>


          {card?.Area_Terreno &&
            parseInt(card.Area_Terreno) > 0 && (

              <Typography
                className="icon-card"
                variant="body2"
                color="text.secondary"
              >

                <FullscreenIcon />

                {card.Area_Terreno} m

                <span
                  className="mcubico"
                  style={{
                    display: "inline-block"
                  }}
                >
                  2
                </span>

              </Typography>

          )}


          {card?.Quartos ? (

            <Typography
              className="icon-card"
              variant="body2"
              color="text.secondary"
            >

              <BedIcon />

              {card.Quartos}

            </Typography>

          ) : null}


          {card?.Banheiros ? (

            <Typography
              className="icon-card"
              variant="body2"
              color="text.secondary"
            >

              <ShowerIcon />

              {card.Banheiros}

            </Typography>

          ) : null}


          {card?.Vagas ? (

            <Typography
              className="icon-card"
              variant="body2"
              color="text.secondary"
            >

              <DirectionsCarIcon />

              {card.Vagas}

            </Typography>

          ) : null}


          <CardActions className="wrap-see-more">

            <Button
              className="see-more"
              variant="contained"
              onClick={(event) => {

                event.stopPropagation();

                handleClick(card);

              }}
            >
              Ver Mais
            </Button>

          </CardActions>

        </CardContent>

      </div>

    </Card>

  );

};


export default PropertyCard;