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
import DialogContentText from '@mui/material/DialogContentText';
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
import axios from 'axios';

const CardDetail = ({ data }) => {
  const baseURL = process.env.REACT_APP_BASEURL;
  const [urlShare, setUrlShare] = useState();
  const idMount = window.location.hash.substring(0, 13).replace('#/imovel/', '')
  const [imovel, setImovel] = useState([]);
  const [card, setCard] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [openShare, setOpenShare] = React.useState(false);
  const [openVideo, setOpenVideo] = React.useState(false);
  const [video, setVideo] = useState([]);
  const [tipoAnuncio, setTipoAnuncio] = useState('');
  
  function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
 
  useEffect(() => {
    const paramID  = getParameterByName('dcID')
    setImovel(data)
    setVideo(imovel?.Fotos)
    setTipoAnuncio(imovel?.Tipo_de_Anuncio)
		if(data?.documentId)
		setUrlShare("https://tudosobreap.com.br/#/imovel/tsa/dcID="+ data?.documentId)
  }, [data]);
  
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

  const handleClick = documentId => {
    setOpenShare(true)
    copiarParaAreaDeTransferencia(urlShare);
    setTimeout(() => {
    // setOpenShare(false)
    }, 3500)
  };

	const toNumber = (value) => {
  if (value == null || value === '') return 0;

  const number = Number(
    String(value)
      .replace(/\./g, '')
      .replace(',', '.')
  );

  return isNaN(number) ? 0 : number;
};

const valorVenda = toNumber(imovel?.Valor_Venda);
const valorAluguel = toNumber(imovel?.Valor_Aluguel);
const condominio = toNumber(imovel?.Condominio);
const iptu = toNumber(imovel?.IPTU);

const valorBase =
  toNumber(imovel?.Valor_Venda) ||
  toNumber(imovel?.Valor_Aluguel);

const total =
  valorBase +
  toNumber(imovel?.Condominio) +
  toNumber(imovel?.IPTU);
               
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
          id="detail-imovel"
        >
          <DialogContent>
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
          sx={{
          // Width is 100% on extra-small screens, and 50% on medium screens and up
            width: {
              xs: '100%',
              lg: '540px'
            },
            margin: '0 auto',
            overflowX: 'hidden',
            textAlign: 'center'
          }} 
        >
          <DialogContent sx={{
            // Width is 100% on extra-small screens, and 50% on medium screens and up
              display: {
                xs: '100%',
                lg: 'grid'
              },
              gridTemplateRows: {
                xs: '2fr',
                lg: 'inherit'
              },
              gridTemplateColumns: {
                lg: '1fr 1fr'
              },
              alignItems: {  
                lg: 'center'
              }
          }}>
              <img src="https://tudosobreap.com.br/assets/images/animated-checked.gif" width="200" />
              <DialogContentText sx={{ 
                textAlign: {  
                  lg: 'left'
                }
              }}>
                Link Copiado
              </DialogContentText>
          </DialogContent>
          <CloseIcon className="modal-close" onClick={handleClose} />
        </Dialog>

        <Box className="GroupBelowHighligh">
          <Box className="card imovel-info" key={imovel?.id}>
            {imovel?.Area_Terreno !== null && (
              <Typography className="icon-card" variant="body2" color="text.secondary">
                <FullscreenIcon />
                <Box className="icon-info">
                  <strong>{imovel?.Area_Terreno} m<span className="mcubico" style={{ display: 'inline-block'}}>2</span></strong> 
                  <span>Área terreno</span>
                </Box>
              </Typography>
            )}
            {imovel?.Quartos ? (
              <Typography className="icon-card" variant="body2" color="text.secondary">
                <BedIcon /> 
                <Box className="icon-info">
                  <strong>{imovel?.Quartos + ' '}{imovel?.Quartos > 1 ? 'Quartos' : 'Quarto'} </strong> 
                  <span>Privativo</span>
                </Box>
              </Typography>
            ) : ''}

            {imovel?.Suites ? (
              <Typography className="icon-card" variant="body2" color="text.secondary">
                <BedIcon /> 
                <Box className="icon-info">
                  <strong>{imovel?.Suites + ' '}{imovel?.Suites > 1 ? 'Suites' : 'Suite'} </strong> 
                  <span>Privativo</span>
                </Box>
              </Typography>
            ) : ''}
            
            {imovel?.Banheiros ? (
              <Typography className="icon-card" variant="body2" color="text.secondary">
                <ShowerIcon /> 
                <Box className="icon-info">
                  <strong>{imovel?.Banheiros + ' '}{imovel?.Banheiros > 1 ? 'Banheiros' : 'Banheiro'} </strong> 
                  <span>Privativo</span>
                </Box>
              </Typography>
            ) : ''}

            {imovel?.Vagas ? (
              <Typography className="icon-card" variant="body2" color="text.secondary">
                <DirectionsCarIcon /> 
                <Box className="icon-info">
                  <strong>{imovel?.Vagas + ' '}{imovel?.Vagas > 1 ? 'Vagas' : 'Vaga'} </strong> 
                  <span>Garagem Exclusiva</span>
                </Box>
              </Typography>
            ) : ''}
          </Box>

          <ButtonGroup className="ButtonGroup" variant="contained" aria-label="Basic button group">
            {video?.length > 0 && video.map((media, index) => {
							if(media?.ext === ".mp4")
							return <Button onClick={handleClickOpenVideo}><SlowMotionVideoIcon /> Vídeo </Button>
          	})}
            <Button onClick={handleClickOpen}><AspectRatioIcon  className="expanded" /> Ampliar </Button>
            <Button onClick={(e) => {handleClick(imovel?.documentId) }}><ShareIcon /> Compartilhar </Button>
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
                <a target={"_blank"} href={`https://wa.me/+5511961803698?text=Tenho interesse neste imóvel. Está disponível? ${encodeURIComponent(urlShare)}`}>
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
                      <strong>Alguel: </strong><br />
                      <span className="value"> 
                        { valorAluguel > 0
                        ? valorAluguel.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          })
                        : 'Sem informação'}
                      </span>
                    </>
                  )
                    : 
                    <>
                      <strong>Venda: </strong><br />
                      <span className="value"> 
                        { valorVenda > 0
                        ? valorVenda.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          })
                        : 'Sem informação'}
                      </span>
                    </>
                  }
                </Typography>
              </li>
              <li>
                <PlaylistAddIcon />
                <Typography className="ThumbSLider-description">
									<strong>IPTU: </strong><br />
									<span className="value"> 
										{ iptu > 0
										? iptu.toLocaleString('pt-BR', {
												style: 'currency',
												currency: 'BRL'
											})
										: 'Sem informação'}
									</span>
                </Typography>
              </li>
              <li>
                <BusinessIcon  />
                <Typography className="ThumbSLider-description">
									<strong>Condomínio: </strong><br />
									<span className="value">
										{ condominio > 0
										? condominio.toLocaleString('pt-BR', {
												style: 'currency',
												currency: 'BRL'
											})
										: 'Sem informação'}
									</span>
                </Typography>
              </li>

              <li>
                <Typography className="ThumbSLider-description">
                  {/* TOTAL */}
                    <strong>Total: </strong>
                    <span className="value" style={{
													fontSize: '1rem',
													color: 'rgb(2 116 59)'
												}}>
										{valorBase
											? total.toLocaleString('pt-BR', {
													style: 'currency',
													currency: 'BRL',
												})
											: 'Sem informação'}
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