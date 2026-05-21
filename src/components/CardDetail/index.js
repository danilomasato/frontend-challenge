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
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import BusinessIcon from '@mui/icons-material/Business';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const CardDetail = ({ data }) => {
  const baseURL = process.env.REACT_APP_BASEURL;
  const urlShare = window.location.href
  const idMount = window.location.hash.substring(0, 13).replace('#/imovel/', '')
  const [imovel, setImovel] = useState([]);
  const [card, setCard] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [openShare, setOpenShare] = React.useState(false);
  const [openVideo, setOpenVideo] = React.useState(false);
  const [video, setVideo] = useState([]);
  const [tipoAnuncio, setTipoAnuncio] = useState('');
  
  useEffect(() => {
    if( data?.length > 0){
      setImovel(data?.length > 0 && data.filter(item => item.id === parseInt(idMount))[0])
      data.filter(item => {

        if(item.id === parseInt(idMount)){
          setVideo(item.Fotos)
          setTipoAnuncio(item.Tipo_de_Anuncio)
        }
      })
    }
  }, [data, video]);
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenShare(false);
    setOpenVideo(false);
  };

  const handleClickOpenVideo = () => {
    setOpenVideo(true);
  };

  const abrirEmail = () => {
    var destinatario = 'tudosobreape@gmail.com';
    var assunto = 'TSA Contato via Site';
    const corpo = `Tenho interesse neste Imóvel, pode me enviar mais informações? ${urlShare}`;
    
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
        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth="lg"
          maxWidth="lg"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent style={{ height: "660px", overflowY: 'hidden'}}>
            <ThumbSLider
              image={imovel?.Fotos?.slice(1)}
              alt={imovel?.imovel}
              title={imovel?.imovel}
              dialog="true"
            />
          </DialogContent>
          <CloseIcon className="modal-close" onClick={handleClose} />
        </Dialog>

        <Dialog
          open={openVideo}
          onClose={handleClose}
          fullWidth="lg"
          maxWidth="lg"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent style={{ height: "660px", overflowY: 'hidden' }}>
            {video?.length > 0 && video.map((media, index) => {
                if(media?.ext === ".mp4"){
                  return <video controls width="100%" height="100%" autoplay="true">
                    <source src={media.url} type="video/mp4" />
                  </video>
                }
              })}
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

        <Box className="GroupBelowHighligh">
          <Box className="card imovel-info" key={imovel?.id}>
            <Typography className="icon-card icon-sale" variant="h6" color="text.secondary">
              {imovel?.Valor_Venda !== null ? (
                <div>
                  {parseFloat(imovel?.Valor_Venda?.replace('.',''))?.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </div>
              )
                : 
                  <div>
                  {parseFloat(imovel?.Valor_Aluguel?.replace('.',''))?.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </div>
              }
            </Typography>
            <Typography className="icon-card" variant="body2" color="text.secondary">

              {imovel?.Area_Terreno !== null ? (
                <div>
                  <FullscreenIcon />
                  {imovel?.Area_Terreno} m<span className="mcubico">2</span>
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

          </Box>

          <ButtonGroup className="ButtonGroup" variant="contained" aria-label="Basic button group">
            {video?.length > 0 && video.map((media, index) => {
                if(media?.ext === ".mp4")
                return <Button onClick={handleClickOpenVideo}><SlowMotionVideoIcon /> Vídeo </Button>
          })}
            <Button onClick={handleClickOpen}><AspectRatioIcon  className="expanded" /> Ampliar </Button>
            <Button onClick={(e) => {handleClick(urlShare) }}><ShareIcon /> Compartilhar </Button>
          </ButtonGroup>

          <Box className="ThumbSLider-author" key={card.id} sx={{ maxWidth: 345 }} style={{ overflow: "visible"}}>
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
                <a target={"_blank"} href={`https://wa.link/nxg8r6?${urlShare}`}>
                  <Button size="small"><WhatsAppIcon /> Contato</Button>
                </a>
                {/* <b style={{ fontWeight: 600 }}>Contato:</b> {card.autor.contato}*/}
              </Typography>
              <Typography className="ThumbSLider-description" gutterBottom>
                <Button size="small" onClick={(e) => {abrirEmail() }}><MailOutlineIcon /> Email</Button>
                {/* <b style={{ fontWeight: 600 }}>Email:</b> {card.autor.email} */}
              </Typography>
            </Box>
          </Box>

          <Box className="PriceDetails" key={card.id} >
            <ul>
              <li>
                <AttachMoneyIcon />
                <Typography className="ThumbSLider-description">

                  {imovel?.Valor_Venda == null ? (
                    <>
                      <strong>Alguel: </strong>
                      <span className="value"> 
                        {!isNaN(parseFloat(imovel?.Valor_Aluguel)) ? parseFloat(imovel?.Valor_Aluguel.replace('.','')).toLocaleString('pt-BR', {style: 'currency',currency: 'BRL'}) : 'Sem informação'}
                      </span>
                    </>
                  )
                    : 
                    <>
                      <strong>Venda: </strong>
                      <span className="value"> 
                        {!isNaN(parseFloat(imovel.Valor_Venda)) ?  parseFloat(imovel.Valor_Venda.replace('.','')).toLocaleString('pt-BR', {style: 'currency',currency: 'BRL'}) : 'Sem informação'}
                      </span>
                    </>
                  }
                </Typography>
              </li>
              <li>
                <PlaylistAddIcon />
                <Typography className="ThumbSLider-description">
                  {imovel?.IPTU ? (
                    <>
                      <strong>IPTU: </strong>
                      <span className="value"> 
                        {!isNaN(parseFloat(imovel.IPTU)) ? parseFloat(imovel.IPTU).toLocaleString('pt-BR', {style: 'currency',currency: 'BRL'}) : 'Sem informação'}
                      </span>
                    </>
                  )
                  : 
                    'IPTU: Sem informação'
                  }
                </Typography>
              </li>
              <li>
                <BusinessIcon  />
                <Typography className="ThumbSLider-description">
                  {imovel?.Condominio ? (
                    <>
                      <strong>Condomínio: </strong>
                      <span className="value"> 
                        {!isNaN(parseFloat(imovel.Condominio)) ? parseFloat(imovel.Condominio).toLocaleString('pt-BR', {style: 'currency',currency: 'BRL'}) : 'Sem informação'}
                      </span>
                    </>
                  )
                  : 
                    'Condomínio: Sem informação'
                  }
                </Typography>
              </li>

              <li>
                <Typography className="ThumbSLider-description">
                  {/* TOTAL */}
                    <strong>Total: </strong>
                      <span className="value" style={{ fontSize: '1rem', color: 'rgb(2 116 59)'}}> 
                  { tipoAnuncio !== 'venda e aluguel' && imovel?.Condominio !== null && imovel?.IPTU !== null  ? (
                      imovel?.Tipo_de_Anuncio == 'venda'                              
                        ?  (!isNaN(parseFloat(imovel.Condominio)) !== 'string' && imovel?.Valor_Venda !== null ? parseFloat(imovel?.Valor_Venda?.replace(".","").toLocaleString('pt-BR', {style: 'currency',currency: 'BRL'})) + parseFloat(imovel?.Condominio?.replace(".","")) + parseInt(imovel?.IPTU?.replace(".","")) : parseInt(imovel?.Valor_Venda?.replace(".","").toLocaleString('pt-BR', {style: 'currency',currency: 'BRL'})) + parseInt(imovel?.IPTU?.replace(".",""))).toLocaleString('pt-BR', {style: 'currency',currency: 'BRL'})
                        :  ( imovel?.Condominio !== null && imovel?.Valor_Aluguel !== null ? (parseFloat(imovel?.Valor_Aluguel?.replace(".","")) + (parseFloat(imovel?.Condominio?.replace(".",""))) + parseInt(imovel?.IPTU?.replace(".",""))).toLocaleString('pt-BR', {style: 'currency',currency: 'BRL'}) : parseInt(imovel?.Valor_Aluguel?.replace(".","").toLocaleString('pt-BR', {style: 'currency',currency: 'BRL'})) + parseInt(imovel?.IPTU?.replace(".",""))).toLocaleString('pt-BR', {style: 'currency',currency: 'BRL'})                                                      
                    )
                    : 
                      imovel?.IPTU == null && imovel?.Condominio == null ? (
                      (parseInt(imovel?.Valor_Venda?.replace(".",""))).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })
                      ) : ( imovel?.Condominio == null ?  parseFloat(parseInt(imovel?.Valor_Venda?.replace(".","")) + parseInt(imovel?.IPTU?.replace(".",""))).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }) : 
                      
                      //venda e aluguel 
                      (
                        imovel?.Tipo_de_Anuncio == 'venda e aluguel'                                
                        ?  (!isNaN(parseFloat(imovel.Condominio)) !== 'string' && imovel?.Valor_Venda !== null ? parseFloat(imovel?.Valor_Venda?.replace(".","").toLocaleString('pt-BR', {style: 'currency',currency: 'BRL'})) + parseFloat(imovel?.Condominio?.replace(".","")) + parseInt(imovel?.IPTU?.replace(".","")) : parseInt(imovel?.Valor_Venda?.replace(".","").toLocaleString('pt-BR', {style: 'currency',currency: 'BRL'})) + parseInt(imovel?.IPTU?.replace(".",""))).toLocaleString('pt-BR', {style: 'currency',currency: 'BRL'})
                        :  (typeof imovel?.Condominio !== 'string' && imovel?.Valor_Aluguel !== null ? parseFloat(imovel?.Valor_Aluguel?.replace(".","").toLocaleString('pt-BR', {style: 'currency',currency: 'BRL'})) + (parseInt(imovel?.Condominio?.replace(".",""))).toLocaleString('pt-BR', {style: 'currency',currency: 'BRL'}) : parseInt(imovel?.Valor_Aluguel?.replace(".","").toLocaleString('pt-BR', {style: 'currency',currency: 'BRL'})) + parseInt(imovel?.IPTU?.replace(".",""))).toLocaleString('pt-BR', {style: 'currency',currency: 'BRL'})                                                      
                      )
                      
                    )//fecha terminario
                    }

                    </span>
                </Typography>
              </li>
            </ul>
          </Box>
        </Box>
      </div>
    </>
  );
}

export default CardDetail;