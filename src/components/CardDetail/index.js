import React, { useState, useEffect } from "react";
import {useHistory} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as types from "../../constants/ActionTypes";
import ThumbSLider from "../ThumbSlider";
import "./Card.css";
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import PhoneEnabledIcon from '@mui/icons-material/PhoneEnabled';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

export default function MultiActionAreaCard(props) {
  const baseURL = process.env.REACT_APP_URL;
  const card = props.data.characterDetail[0]

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>  
      <div className="ThumbSLider-highligh">
      <ThumbSLider 
        height="300"
        image={card.fotos}
        alt={card.imovel}
        title={card.imovel}
        onClick={handleClickOpen}
      />

      <AspectRatioIcon onClick={handleClickOpen} className="expanded" />

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth="lg"
         maxWidth="lg"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <ThumbSLider
            image={card.fotos}
            alt={card.imovel}
            title={card.imovel}
          />
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleClose} autoFocus>
            Agree
          </Button>
        </DialogActions> */}
      </Dialog>
        
        <div className="ThumbSLider-info">
            <span className="imovel"> {card.imovel} </span>
            <span className="descricao"> {card.descricao} <b style={{ fontWeight: 600 }}>{card.id} </b> </span>
        </div>

        <Card className="ThumbSLider-author" key={card.id} sx={{ maxWidth: 345 }} style={{ overflow: "visible"}}>
            <CardActionArea>
              <CardContent>
                <Stack direction="row" spacing={2} className="avatar">
                  <Avatar
                    alt="Remy Sharp"
                    src='/static/media/logo_tsa.065f0e6987b69aca20e9.png'
                    sx={{ width: 66, height: 66, objectFit: 'contain' }}
                  />
                </Stack>
                <Typography className="ThumbSLider-description" gutterBottom>
                  <b style={{ fontWeight: 600 }}>Corretor:</b> TSA Imóveis
                  {/* {card.autor.name} */}
                </Typography>
                <Typography className="ThumbSLider-description" gutterBottom>
                  <Button size="small"><PhoneEnabledIcon /> Contato</Button>
                  {/* <b style={{ fontWeight: 600 }}>Contato:</b> {card.autor.contato}*/}
                </Typography>
                <Typography className="ThumbSLider-description" gutterBottom>
                  <Button size="small"><MailOutlineIcon /> Email</Button>

                  {/* <b style={{ fontWeight: 600 }}>Email:</b> {card.autor.email} */}
                </Typography>

              </CardContent>
            </CardActionArea>
        </Card>
      </div>
    </>
  );
}