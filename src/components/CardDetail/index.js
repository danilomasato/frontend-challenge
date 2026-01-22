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
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { getArticles } from "../../actions";

const CardDetail = ({ data, character }) => {
  const baseURL = process.env.REACT_APP_BASEURL;
  const urlShare = window.location.href
  const idMount = window.location.hash.substring(0, 11).replace('#/imovel/', '')
  const [imovel, setImovel] = useState([]);
  const [card, setCard] = useState([]);
  const [dataImovel, setDataImovel] = useState(character);
  const [open, setOpen] = React.useState(false);
  const [openShare, setOpenShare] = React.useState(false);
  
  const property = data?.length > 0 ? data : character.imoveisCache.data

  useEffect(() => {
    setImovel(property?.length > 0 && property.filter(item => item.id === parseInt(idMount))[0])
  }, [property]);
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenShare(false);
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
    try {
      navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
        if (result.state === "granted" || result.state === "prompt") {
            navigator.clipboard.writeText(url);
            // alert("Link copiado para a área de transferência!");
        }
      });
      await navigator.permissions.query({ name: "clipboard" });
        if(navigator.clipboard){
          await navigator.clipboard.writeText(url);
          // alert("Link copiado para a área de transferência!");
        }
      } catch (e) {
          console.log(e);
      }
  }

  const handleClick = url => {
    setOpenShare(true)
    copiarParaAreaDeTransferencia(url);
    setTimeout(() => {
    setOpenShare(false)
    }, 3500)
  };

  return (
    <>  
      <div className="ThumbSLider-highligh">

        <AspectRatioIcon onClick={handleClickOpen} className="expanded" />

        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth="lg"
          maxWidth="lg"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent style={{ height: "660px" }}>
            <ThumbSLider
              image={imovel?.fotos}
              alt={imovel?.imovel}
              title={imovel?.imovel}
            />
          </DialogContent>
          <CloseIcon className="modal-close" onClick={handleClose} />
        </Dialog>

        <Dialog
          open={openShare}
          onClose={handleClose}
          fullWidth="lg"
          maxWidth="lg"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
              <div className="row center">
              <div className="content" style={{ minHeight: "auto",  display: "block", width: "340px" }}>
                 <img src="https://tudosobreap.com.br/assets/images/animated-checked.gif" width="200" />
                  Link Copiado
              </div>
            </div>
          </DialogContent>
          <CloseIcon className="modal-close" onClick={handleClose} />
        </Dialog>

        <box className="GroupBelowHighligh">
          <Card className="card imovel-info" key={imovel?.id} sx={{ maxWidth: 300,  background: 'transparent',
            border: '0', boxShadow: 'none', marginBottom: '40px' }}>
            <CardActionArea>
              <CardContent>
                <Typography className="icon-card icon-sale" variant="h6" color="text.secondary">
                  {imovel?.valor_venda !== null ? (
                    <div>
                      R$ {imovel?.valor_venda}
                    </div>
                  )
                    : <div>R$ {imovel?.valor_aluguel}</div>
                  }
                </Typography>
                <Typography className="icon-card" variant="body2" color="text.secondary">

                  {imovel?.Area_Total !== null ? (
                    <div>
                      <FullscreenIcon />
                      {imovel?.Area_Total} m<span className="mcubico">2</span>
                    </div>
                    )
                    : ''
                  }
                </Typography>
                <Typography className="icon-card" variant="body2" color="text.secondary">
                  <BedIcon /> {imovel?.Quartos || ''} 
                </Typography>
                <Typography className="icon-card" variant="body2" color="text.secondary">
                  <ShowerIcon /> {imovel?.Banheiros || ''} 
                </Typography>
                <Typography className="icon-card" variant="body2" color="text.secondary">
                  <DirectionsCarIcon /> {imovel?.Vagas || ''} 
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
                  {/* <Typography className="ThumbSLider-description" gutterBottom>
                    <b style={{ fontWeight: 600 }}>Corretor:</b> TSA Imóveis
                    {card.autor.name}
                  </Typography> */}

                  <Box className="contact">
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
                  </Box>
                </CardContent>
              </CardActionArea>
          </Card>
        </box>
      </div>
    </>
  );
}

const mapStateToProps = state => ({
  character: state.home
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getArticles: dispatch(getArticles())
    },
    dispatch
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CardDetail));