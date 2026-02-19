import React, { useState, useEffect } from "react";
import { withRouter, useHistory } from "react-router-dom";
import { connect   } from "react-redux";
import { Container } from "../../components";
import CardDetail from "../../components/CardDetail";
// import Button from '@mui/material/Button';
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
import { getAuthors, getImoveisCache } from "../../actions";
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

const CharacterDetail = ({ data, realRstate, authors, imoveisCache }) => {

  const [infoImoveis, setInfoImoveis] = useState([]);
  const [imoveis, setImoveis] = useState([]);
  const history = useHistory();
  const urlShare = window.location.href
  const idMount = parseInt(window.location.hash.substring(0, 11).replace('#/imovel/',''))

  let rows = []

  useEffect(() => {
    const imoveis = data?.length > 0 ? data : imoveisCache.data;
    if(imoveis?.length > 0){
      setImoveis(imoveis)
    }
  }, [imoveisCache, data]);
  useEffect(() => {
    // if(authors.data?.length > 0){
    //   authors.data.filter((item, index) =>  {
    //     if(infoImoveis?.autor !== null && infoImoveis?.autor.name.includes(item.name)){
    //       Object.assign(realRstate, {
    //         avatar: item.avatar.url
    //       })
    //     }
    //   })
    // }
    
      if(imoveis?.length > 0) {
        imoveis.filter((item, index) => {
          if(item.id === parseInt(idMount)){
            realRstate = item
            setInfoImoveis(item)
            setImoveis(item)
          }
        })
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

  }, [imoveis, infoImoveis]);



  function createData(
    name: string,
    info: string
  ) {
    return { name, info};
  }

  if(infoImoveis?.Valor_Venda !== null) {
    rows = [
      createData('Andar', infoImoveis?.Andar !== null ? infoImoveis.Andar + 'º' : ''),
      createData('Área terreno', infoImoveis?.Area_Terreno !== null ? infoImoveis.Area_Terreno + ' (m²)' : 'Sem Informação'),
      createData('Ano de construção', infoImoveis?.Ano_de_Construcao !== null ? infoImoveis.Ano_de_Construcao  : 'Sem Informação'),
      createData('Condomínio', infoImoveis?.Condominio !== null && Number.isFinite(infoImoveis.Condominio) ? 'R$' + infoImoveis.Condominio  : 'Sem Informação'),
      createData('IPTU (anual)', infoImoveis?.IPTU !== null ? parseInt(infoImoveis.IPTU).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'Sem Informação'),
      createData('Quartos', infoImoveis?.Quartos !== null ? infoImoveis.Quartos  : 'Sem Informação'),
      createData('Suítes', infoImoveis?.Suites !== null ? infoImoveis.Suites  : 'Sem Informação'),
      createData('Banheiros', infoImoveis?.Banheiros !== null ? infoImoveis.Banheiros  : 'Sem Informação'),
    ]
    rows = rows.filter(item => item.info !== '');
  } else {
    rows = [
      createData('Andar', infoImoveis?.Andar !== null ? infoImoveis.Andar + 'º' : ''),
      createData('Área terreno', infoImoveis?.Area_Terreno !== null ? infoImoveis.Area_Terreno + ' (m²)' : 'Sem Informação'),
      createData('Condomínio', infoImoveis?.Condominio !== null && Number.isFinite(infoImoveis.Condominio) ? 'R$' + infoImoveis?.Condominio  : ''),
      createData('IPTU (anual)', infoImoveis?.IPTU !== null ? parseInt(infoImoveis.IPTU).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : ''),
      createData('Quartos', infoImoveis?.Quartos !== null ? infoImoveis.Quartos  : ''),
      createData('Suítes', infoImoveis?.Suites !== null ? infoImoveis.Suites  : ''),
      createData('Banheiros', infoImoveis?.Banheiros !== null ? infoImoveis.Banheiros  : 'Sem Informação'),
    ]
    rows = rows.filter(item => item.info !== '');
  }

  const [openToggle, setOpenToggle] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <React.Fragment>
      <TopInfo />
      <Header />

        <div className="ThumbSLider-highligh">
          <ThumbSLider
            height="300"
            image={imoveis?.Fotos}
            detail="true"
            onClick={handleClickOpen}
          />
          <div className="ThumbSLider-info">
              <span className="imovel"> {imoveis?.imovel || ''} </span>
          </div>
        </div>

      <div className="row center">
        <Box className="back" sx={{ width: '100%' }}>
          <Button onClick={(e) => { history.push('/') } }><KeyboardBackspaceIcon />  Voltar</Button>
        </Box>

        <CardDetail data={imoveis} imovel={infoImoveis} />

        <Box className="propertyDetails" sx={{ width: '100%' }} >
          <Box sx={{ width: '100%' }} className={`caracteristicas ${(openToggle ? 'active' : '')}`} style={{height: imoveis?.descricao?.length > 0 ? '' : '0' }}>
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
					<button onClick={(e) => setOpenToggle(!openToggle) }>
            Saiba mais
            { openToggle ? 
              (<><KeyboardArrowUpIcon style={{ float: "right" }}/></>)
            :
              (<><KeyboardArrowDownIcon style={{ float: "right" }}/></>)
            }
          </button>
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
  imoveisCache: state.home.imoveisCache,
  data: state.home.character.data,
  realRstate: state.character.characterDetail[0],
  authors: state.character.authors
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      // getAuthors: dispatch(getAuthors()),
      getArticles: dispatch(getArticles()),
      getImoveisCache: dispatch(getImoveisCache())
    },
    dispatch
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CharacterDetail));