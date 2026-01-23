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

export default function MultiActionAreaCard(props) {
  const [articles, setArticles] = useState([]);
  const history = useHistory();
  const dispatch = useDispatch();
  const baseURL = process.env.REACT_APP_URL;
  const [rentalValue, setRentalValue] = useState(null);
  const [salePrice, setSalePrice] = useState(null);

  const Root = styled('div')(({ theme }) => ({
    width: '100%',
    ...theme.typography.body2,
    color: (theme.vars || theme).palette.text.secondary,
    '& > :not(style) ~ :not(style)': {
      marginTop: theme.spacing(2),
    },
  }));
  
  let character
//first load
  useEffect(() => {
    if(props.data.character?.data?.length > 0) {
      setArticles(props.data.character.data)

    } else {
      setArticles(props.data.imoveisCache?.data)
    }
 }, [articles, props]);

  //first load
  useEffect(() => {
    if (articles?.length > 0) {
        articles.filter(item => { item.valor_venda !== null ? setSalePrice(true) : setRentalValue(true)
      })
    }
  }, [props, articles]);

  const handleClick = (cardID, card) => {
    dispatch({
      type: types.RECEIVE_CHARACTER,
      payload: articles.filter(item => item.id === cardID)
    })
    history.push(`/imovel/${card.id}/${card.descricao.replace(/[\s,]/g,"-")}`)
  };

  return (
    <>
    
      {rentalValue ? ( 
        <Root>
          <Divider style={{ marginTop: "40px"}}>
            <Chip label="Imóveis á Venda" size="small" style={{ background: "rgb(11, 44, 61)", color: "#fff",  fontSize: "1.1rem", padding: "1rem" }} />
          </Divider>
        </Root> 
      ) : '' }
 
      <Container className="home">
        {articles?.length > 0 && articles.map(
          (card, index) => (
            <>
              {card.valor_venda !== null ? (
                  <Card className="card" key={card.id} sx={{ maxWidth: 345 }}>
                    <CardActionArea>
                      <ThumbSLider 
                        height="180"
                        image={card.fotos}
                        alt={card.imovel}
                        title={card.imovel}
                        home="true"
                      />
                      <CardContent onClick={(e) => {handleClick(card.id, card) }}>
                        <Typography className="title-imovel" gutterBottom variant="h5">
                          {card.regiao}
                        </Typography>

                         {card.imovel !== null ? (
                          <Typography className="descripition" variant="body2" color="text.secondary" component="div">
                            {card.descricao}  
                          </Typography>
                          )
                            : ''
                          }

                        <Typography className="icon-card icon-sale" variant="body2" color="text.secondary">
                          {card.valor_venda !== null ? (
                            <div>
                              R$ {card.valor_venda}
                            </div>
                          )
                            : ''
                          }
                        </Typography>
                        <Typography className="icon-card" variant="body2" color="text.secondary">
                          {card.Area_Total !== null ? (
                            <div>
                              <FullscreenIcon />
                              {card.Area_Total} m<span className="mcubico">2</span>
                            </div>
                          )
                            : ''
                          }
                        </Typography>
                        <Typography className="icon-card" variant="body2" color="text.secondary">
                          
                          {card.Quartos !== null ? (
                            <div>
                              <BedIcon /> {card.Quartos}
                            </div>
                          )
                            : ''
                          }
                        </Typography>
                        <Typography className="icon-card" variant="body2" color="text.secondary">
                          <ShowerIcon /> {card.Banheiros} 
                        </Typography>
                        <Typography className="icon-card" variant="body2" color="text.secondary">
                          <DirectionsCarIcon /> {card.Vagas} 
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                    <CardActions>
                      <Button className="see-more" variant="contained" style={{ width: "100%" }} onClick={(e) => {handleClick(card.id, card) }}>
                        Ver Mais
                      </Button>
                    </CardActions>
                  </Card>
                )
                : ''
            }
          </>
        ))}
    </Container>

    {salePrice ? (
      <Root>
          <Divider style={{ marginTop: "40px"}}>
            <Chip label="Imóveis para Alugar" size="small" style={{ background: "rgb(11, 44, 61)", color: "#fff", fontSize: "1.1rem", padding: "1rem" }} />
          </Divider>
        </Root> 
    ) : '' }

    <Container className="home">
      {articles?.length > 0 && articles.map(
      (card, index) => (
        <>
        {card.valor_aluguel !== null ? (
              <Card className="card" key={card.id} sx={{ maxWidth: 345 }} >
                <CardActionArea>
                  <ThumbSLider 
                    height="200"
                    image={card.fotos}
                    alt={card.imovel}
                    title={card.imovel}
                  />
                  <CardContent onClick={(e) => {handleClick(card.id, card) }}>
                    <Typography className="title-imovel" gutterBottom variant="h5">
                      {card.regiao}
                    </Typography>

                    {card.imovel !== null ? (
                      <Typography className="descripition" variant="body2" color="text.secondary" component="div">
                        {card.descricao}  
                      </Typography>
                      )
                        : ''
                      }

                    <Typography className="icon-card icon-sale" variant="body2" color="text.secondary">
                      {card.valor_aluguel !== null ? (
                        <div>
                          R$ {card.valor_aluguel}
                        </div>
                      )
                        : ''
                      }
                    </Typography>
                    <Typography className="icon-card" variant="body2" color="text.secondary">
                       {card.Area_Total !== null ? (
                            <div>
                              <FullscreenIcon />
                              {card.Area_Total} m<span className="mcubico">2</span>
                            </div>
                          )
                            : ''
                          }
                    </Typography>
                    <Typography className="icon-card" variant="body2" color="text.secondary">
                      <BedIcon /> {card.Quartos} 
                    </Typography>
                    <Typography className="icon-card" variant="body2" color="text.secondary">
                      <ShowerIcon /> {card.Banheiros} 
                    </Typography>
                    <Typography className="icon-card" variant="body2" color="text.secondary">
                      <DirectionsCarIcon /> {card.Vagas} 
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Button className="see-more" variant="contained" style={{ width: "100%" }} onClick={(e) => {handleClick(card.id, card) }}>
                    Ver Mais
                  </Button>
                </CardActions>
              </Card>
          )
            : ''
          }
        </>
      ))}
    </Container>
    </>
  );
}