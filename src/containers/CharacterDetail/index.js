import React, { useState, useEffect, useRef } from "react";
import { withRouter, useHistory } from "react-router-dom";
import { connect   } from "react-redux";
import { Container } from "../../components";
import CardDetail from "../../components/CardDetail";
import Stack from '@mui/material/Stack';
import { Header } from "../../components/Header";
import { TopInfo } from "../../components/TopInfo";
import { Footer } from "../../components/Footer";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { bindActionCreators } from "redux";
import { getAuthors, getImoveisCache, getCharacterData } from "../../actions";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import SellIcon from '@mui/icons-material/Sell';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Box from '@mui/material/Box';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import "./DetailImovel.css";
import { getArticles } from "../../actions";
import ThumbSLider from "../../components/ThumbSlider";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LocationPinIcon from '@mui/icons-material/LocationOn';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import axios from 'axios';

function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

const CharacterDetail = ({ realestate }) => {

  const history = useHistory();
  const contentRef = useRef(null);
  const [imoveis, setImoveis] = useState();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  
  let rows = []

  const paramID  = getParameterByName('dcID')

  //busca dados
  useEffect(() => {
    if(realestate?.length > 0)
      setImoveis (realestate[0])
  }, [realestate]);

  useEffect(() => {

    
    //busca api por documentID
    if(paramID !== null){

      axios.get(`https://sublime-bat-ad2fca1255.strapiapp.com/api/Anuncios/${paramID}?status=published&populate[0]=Fotos`)
      .then(response => {
        // Handle success.
        setImoveis(response.data.data)
      })
      .catch(error => {
        // Handle error.
        console.log('An error occurred:', error.response);
      });
    }

    //Disable click right mouse
    const handleContextMenu = (e) => {
      e.preventDefault(); // Prevent the default context menu
    };

    //Attach the event listener to the document body
    document.body.addEventListener('contextmenu', handleContextMenu);

    //Clean up the event listener when the component unmounts
    return () => {
      document.body.removeEventListener('contextmenu', handleContextMenu);
    };

  }, []);

  function createData(
    name: string,
    info: string
  ) {
    return { name, info};
  }

  if(imoveis && Object.keys(imoveis).length > 0){
    if(imoveis.Tipo_de_Anuncio == 'venda') {
      rows = [
        createData('Andar', imoveis?.Andar !== null ? imoveis.Andar + 'º' : ''),
        createData('Área terreno', imoveis?.Area_Terreno !== null ? imoveis.Area_Terreno + ' (m²)' : 'Sem Informação'),
        createData('Ano de construção', imoveis?.Ano_de_Construcao !== null ? imoveis.Ano_de_Construcao  : 'Sem Informação'),
        createData('Condomínio', imoveis?.Condominio !== null && imoveis.Condominio ? 'R$' + imoveis.Condominio  : 'Sem Informação'),
        createData('IPTU (anual)', imoveis?.IPTU !== null ? parseInt(imoveis.IPTU).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'Sem Informação'),
        createData('Quartos', imoveis?.Quartos !== null ? imoveis.Quartos  : 'Sem Informação'),
        createData('Suítes', imoveis?.Suites !== null ? imoveis.Suites  : 'Sem Informação'),
        createData('Banheiros', imoveis?.Banheiros !== null ? imoveis.Banheiros  : 'Sem Informação'),
      ]
      rows = rows.filter(item => item.info !== '');
    } else {
      rows = [
        createData('Andar', imoveis?.Andar !== null ? imoveis.Andar + 'º' : ''),
        createData('Área terreno', imoveis?.Area_Terreno !== null ? imoveis.Area_Terreno + ' (m²)' : 'Sem Informação'),
        createData('Condomínio', imoveis?.Condominio !== null && imoveis.Condominio ? 'R$' + imoveis?.Condominio  : 'Sem Informação'),
        createData('IPTU (anual)', imoveis?.IPTU !== null ? parseInt(imoveis.IPTU).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : ''),
        createData('Quartos', imoveis?.Quartos !== null ? imoveis.Quartos  : ''),
        createData('Suítes', imoveis?.Suites !== null ? imoveis.Suites  : ''),
        createData('Banheiros', imoveis?.Banheiros !== null ? imoveis.Banheiros  : 'Sem Informação'),
      ]
      rows = rows.filter(item => item.info !== '');
    }
  }
  const [openToggle, setOpenToggle] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (contentRef.current) {
      setShowToggle(contentRef.current.scrollHeight > 110);
    }
  }, [imoveis]);

  return (
    <React.Fragment>
      {!isMobile && (
        <TopInfo />
      )}

      <Header />

        <div className="ThumbSLider-highligh slick-slider center slick-initialized">
          <ThumbSLider
            height="300"
            image={imoveis?.Fotos?.slice(1)}
            detail="true"
            onClick={handleClickOpen}
          />
        </div>

      <div className="row center">
        <Box className="back" sx={{ width: '100%' }}>
          <Button onClick={(e) => { history.push('/') } }><KeyboardBackspaceIcon />  Voltar</Button>
        </Box>

        <div className="ThumbSLider-info">
          <Box className="wrapper-property">
            <span className="imovel"> {imoveis?.titulo || ''} </span>
            <div className="property-header">
              <div className="property-location">
                <span className="location-chip">
                  <LocationPinIcon fontSize="small" />
                  {imoveis?.Bairro || ''}
                </span>

                <span className="location-chip">
                  <LocationCityIcon fontSize="small" />
                  São Paulo - SP
                </span>
              </div>
            </div>
          </Box>

          <Box className="card">
            <Typography className="icon-card icon-sale" variant="h6" color="text.secondary">
              {imoveis?.Valor_Venda !== null ? (
                <div>
                  {parseFloat(imoveis?.Valor_Venda?.replace('.',''))?.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </div>
              )
                : 
                  <div>
                  {parseFloat(imoveis?.Valor_Aluguel?.replace('.',''))?.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </div>
              }
            </Typography>
          </Box>
        </div>

        <CardDetail data={imoveis} />

        <Box className="propertyDetails" sx={{ width: '100%' }}>
          <Box
            ref={contentRef}
            className="caracteristicas"
            style={{
              maxHeight: openToggle
                ? `${contentRef.current?.scrollHeight || 9999}px`
                : '160px',
              overflow: 'hidden',
              transition: 'max-height .4s ease'
            }}
          >
            <h2>
							Descrição
						</h2>

						{imoveis?.descricao?.length > 0 && imoveis.descricao.map(
							(desc, index) => (
								<>
									{desc.type == "paragraph" ? (
										<>
											<Typography gutterBottom variant="h5">{desc.children[0].text}</Typography>
										</>
									)
										: ''
									}
								</>
							))}

							{imoveis?.descricao?.length > 0 && imoveis.descricao.map(
							(desc, index) => (
								<>
									{desc.type == "list" ? (
										<>
											<ol className="list">
											{desc?.children?.length > 0 && desc.children.map(
												(listItem, index) => (
													<li key={index} gutterBottom variant="h5" style={{  }}>
														{listItem.children[0].text}
													</li>
											))}
											</ol>
										</>
									)
										: ''
									}
								</>
							))}
        	</Box>
          {showToggle && (
            <button
              type="button"
              onClick={() => setOpenToggle(prev => !prev)}
              className="toggle-description"
            >
              {openToggle ? 'Mostrar menos' : 'Saiba mais'}

              {openToggle ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </button>
          )}
					
        </Box>
        <br />

        <TableContainer style={{ boxShadow: 'none' }}>
          <Table className="TableInfo-imovel" sx={{ fontSize: "0.5rem" }} aria-label="simple table">
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row" style={{ paddingLeft: "30px" }}>
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.info}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Footer />
    </React.Fragment>
  );
};

const mapStateToProps = state => ({
  realestate: state.character.realestate.data
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      realestate: !getParameterByName('dcID') && dispatch(getCharacterData(parseInt(window.location.hash.substring(9, 12).replace('#/imovel/','').replace(/\D/g, "")))),
    },
    dispatch
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CharacterDetail));