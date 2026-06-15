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
import BedIcon from '@mui/icons-material/Bed';
import ShowerIcon from '@mui/icons-material/Shower';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import SellIcon from '@mui/icons-material/Sell';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { Container } from "../../components";
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import LocationPinIcon from '@mui/icons-material/LocationOn';
import PropertyCarousel from "../PropertyCarousel";

export default function MultiActionAreaCard(props) {
  const [articles, setArticles] = useState([]);
  const baseURL = process.env.REACT_APP_URL;

  //first load
  useEffect(() => {
    const data = props.data?.character?.data || [];

    setArticles(data);
  }, [props.data]);

  let sales = articles.filter(
    item => item.Tipo_de_Anuncio === "venda"
  );

  let rents = articles.filter(
    item => item.Tipo_de_Anuncio?.includes("aluguel")
  );

  let launches = articles.filter(
    item => item.Tipo_de_Anuncio?.includes("Lançamentos")
  );

  const chunkArray = (array, size = 6) => {
    const chunks = [];

    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }

    return chunks;
  };

return (
    <> 
      <PropertyCarousel
        title="Imóveis à Venda"
        items={sales}
      />

      <PropertyCarousel
        title="Imóveis para Alugar"
        items={rents}
      />

      <PropertyCarousel
        title="Lançamentos"
        items={launches}
      />
    </>
  )
}