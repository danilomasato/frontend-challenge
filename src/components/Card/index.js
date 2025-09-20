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

    history.push('/imovel')
  };

  return (
    <>
      <div className="row center"><h2> venda </h2></div>
      <Container>
        {articles.map(
          (card, index) => (
            <>
              {card.valor_venda !== null ? (
                  <div>
                    
                    <Card className="card" key={card.id} sx={{ maxWidth: 345 }} onClick={(e) => {handleClick(card.id) } }>
                      <CardActionArea>
                        <ThumbSLider 
                          height="140"
                          image={card.fotos}
                          alt={card.imovel}
                          title={card.imovel}
                        />
                        <CardContent>
                          <Typography className="title-imovel" gutterBottom variant="h5">
                            {card.descricao}
                          </Typography>

                          <Typography variant="body2" color="text.secondary" component="div">
                            {card.imovel} 
                          </Typography>
                          <br />
              
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
                            <FullscreenIcon /> {card.Area_Total} 
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
                        <Button className="see-more" variant="contained" style={{ width: "100%" }}>
                          Ver Mais
                        </Button>
                      </CardActions>
                    </Card>
                  </div>
                )
                : ''
            }
          </>
        ))}
    </Container>
      <div className="row center"><h2> aluguel </h2></div>
    <Container>
      {articles.map(
      (card, index) => (
        <>
        {card.valor_aluguel !== null ? (
            <div>
              
               <Card className="card" key={card.id} sx={{ maxWidth: 345 }} onClick={(e) => {handleClick(card.id) } }>
                  <CardActionArea>
                    <ThumbSLider 
                      height="140"
                      image={card.fotos}
                      alt={card.imovel}
                      title={card.imovel}
                    />
                    <CardContent>
                      <Typography className="title-imovel" gutterBottom variant="h5">
                        {card.descricao}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" component="div">
                        {card.imovel} 
                      </Typography>
                      <br />
          
                      <Typography className="icon-card icon-sale" variant="body2" color="text.secondary">
                        {card.valor_venda !== null ? (
                          <div>
                            R$ {card.valor_aluguel}
                          </div>
                        )
                          : ''
                        }
                      </Typography>
                      <Typography className="icon-card" variant="body2" color="text.secondary">
                        <FullscreenIcon /> {card.Area_Total} 
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
                    <Button className="see-more" variant="contained" style={{ width: "100%" }}>
                      Ver Mais
                    </Button>
                  </CardActions>
                </Card>
            </div>
          )
            : ''
          }
        </>
      ))}
    </Container>
    </>
  );
}