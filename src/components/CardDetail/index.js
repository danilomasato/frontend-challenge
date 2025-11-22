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
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';
import ButtonGroup from '@mui/material/ButtonGroup';
import ShareIcon from '@mui/icons-material/Share';
import SlowMotionVideoIcon from '@mui/icons-material/SlowMotionVideo';
import Box from '@mui/material/Box';
import BedIcon from '@mui/icons-material/Bed';
import ShowerIcon from '@mui/icons-material/Shower';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import FullscreenIcon from '@mui/icons-material/Fullscreen';

export default function MultiActionAreaCard(props) {
  const baseURL = process.env.REACT_APP_BASEURL;
  //  const params = new URLSearchParams(window.location.hash.substring(8))

//   // You can access specific parameters:
//   console.log(params.get('teste'))

  const urlShare = window.location.href

  const [card, setCard] = useState([]);

  //useEffect for not loop, and many request's
  useEffect(() => {
    props.data.characterDetail[0].descricao = props.data.characterDetail[0].descricao?.substring(0,50);
    setCard(props.data.characterDetail[0])
  }, [props.data.characterDetail[0]]);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const abrirEmail = () => {
    var destinatario = 'tudosobreape@gmail.com';
    var assunto = 'TSA Contato via Site';
    var corpo = 'Olá,\n\nEste Gostaria de saber mais Sobre este Imóvel';
    
    // Codifica o assunto e o corpo para garantir que caracteres especiais sejam tratados corretamente
    var assuntoCodificado = encodeURIComponent(assunto);
    var corpoCodificado = encodeURIComponent(corpo);
    
    // Cria o link mailto completo
    var mailtoLink = 'mailto:' + destinatario + 
                    '?subject=' + assuntoCodificado + 
                    '&body=' + corpoCodificado;
    
    // Abre o cliente de e-mail do usuário
    // Usar window.location.href redireciona a janela atual, o que é o mais comum para mailto
    window.location.href = mailtoLink;
    
    // Alternativamente, para tentar abrir em uma nova janela/tab (o comportamento exato depende do navegador/configurações do usuário)
    window.open(mailtoLink, '_blank'); 
  }

  async function copiarParaAreaDeTransferencia(url) {
    const textoParaCopiar = url;
    await navigator.clipboard.writeText(textoParaCopiar);
    alert("Texto copiado para a área de transferência!");
  }

  const handleClick = url => {
      copiarParaAreaDeTransferencia(url);
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
          <CloseIcon className="modal-close" onClick={handleClose} />
        </Dialog>
        
        <div className="ThumbSLider-info">
            <span className="imovel"> {card.imovel} </span>
            <span className="descricao"> {card.descricao} <b style={{ fontWeight: 600 }}>{card.id} </b> </span>
        </div>

        <box className="GroupBelowHighligh">
          <Card className="card imovel-info" key={props.imovel.id} sx={{ maxWidth: 300,  background: 'transparent',
            border: '0', boxShadow: 'none', marginBottom: '40px' }}>
            <CardActionArea>
              <CardContent>
                <Typography className="icon-card icon-sale" variant="body2" color="text.secondary">
                  {props.imovel.valor_venda !== null ? (
                    <div>
                      R$ {props.imovel.valor_venda}
                    </div>
                  )
                    : ''
                  }
                </Typography>
                <Typography className="icon-card" variant="body2" color="text.secondary">
                  <FullscreenIcon /> {props.imovel.Area_Total} 
                </Typography>
                <Typography className="icon-card" variant="body2" color="text.secondary">
                  <BedIcon /> {props.imovel.Quartos} 
                </Typography>
                <Typography className="icon-card" variant="body2" color="text.secondary">
                  <ShowerIcon /> {props.imovel.Banheiros} 
                </Typography>
                <Typography className="icon-card" variant="body2" color="text.secondary">
                  <DirectionsCarIcon /> {props.imovel.Vagas} 
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>

          <ButtonGroup className="ButtonGroup" variant="contained" aria-label="Basic button group">
            <Button><SlowMotionVideoIcon /> Vídeo </Button>
            <Button onClick={(e) => {handleClick(urlShare) }}><ShareIcon /> Compartilhar Imóvel </Button>
          </ButtonGroup>

          <Card className="ThumbSLider-author" key={card.id} sx={{ maxWidth: 345 }} style={{ overflow: "visible"}}>
              <CardActionArea>
                <CardContent>
                  <Stack direction="row" spacing={2} className="avatar">
                    <Avatar
                      alt="Remy Sharp"
                      src={`${baseURL}/static/media/logo_tsa.065f0e6987b69aca20e9.png`}
                      sx={{ width: 75, height: 75 }}
                    />
                  </Stack>
                  <Typography className="ThumbSLider-description" gutterBottom>
                    <b style={{ fontWeight: 600 }}>Corretor:</b> TSA Imóveis
                    {/* {card.autor.name} */}
                  </Typography>
                  <Typography className="ThumbSLider-description" gutterBottom>
                    <a target={"_blank"} href="https://wa.me/11961803698?text=Bem Vindo A TSA Imóveis, em que podemos Ajudar?">
                      <Button size="small"><WhatsAppIcon /> Contato</Button>
                    </a>
                    {/* <b style={{ fontWeight: 600 }}>Contato:</b> {card.autor.contato}*/}
                  </Typography>
                  <Typography className="ThumbSLider-description" gutterBottom>
                    <Button size="small" onClick={(e) => {abrirEmail() }}><MailOutlineIcon /> Email</Button>
                    {/* <b style={{ fontWeight: 600 }}>Email:</b> {card.autor.email} */}
                  </Typography>

                </CardContent>
              </CardActionArea>
          </Card>
        </box>
      </div>
    </>
  );
}