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

const CharacterDetail = ({ data, realRstate, authors, imoveisCache }) => {

  const [infoImoveis, setInfoImoveis] = useState(realRstate);
  const [imoveis, setImoveis] = useState([]);
  const history = useHistory();
  const urlShare = window.location.href
  const idMount = window.location.hash.substring(0, 11).replace('#/imovel/', '')


  // if (characterDetail.characterDetail.length === 0) {
  //   history.push('/')
  // }

  let rows = []

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
    const imoveis = data?.length > 0 ? data : imoveisCache.data;

    setImoveis(imoveis)
      if(imoveis?.length > 0) {
        imoveis.filter((item, index) => {
          if(item.id === parseInt(idMount)){
            realRstate = item
            setInfoImoveis(item)
            setImoveis(item)
          }
        })
      }
  }, [imoveisCache]);

  function createData(
    name: string,
    info: string
  ) {
    return { name, info};
  }

  if(infoImoveis?.valor_venda !== null) {
    rows = [
      infoImoveis?.Andar !== null ? createData('Andar', infoImoveis?.Andar || '') : '',
      infoImoveis?.Area_util !== null ? createData('Área útil', infoImoveis?.Area_util + ' (m²)' || '') : '',
      createData('Área total', infoImoveis?.Area_Total + ' (m²)' || ''),
      infoImoveis?.Area_Terreno !== null ? createData('Área terreno', infoImoveis?.Area_Terreno  || '') : '',
      createData('Ano de construção', infoImoveis?.Ano_Construcao || ''),
      createData('Condomínio', 'R$' + infoImoveis?.Condominio || ''),
      createData('IPTU (anual)', 'R$' + infoImoveis?.IPTU || ''),
      infoImoveis?.Quartos !== null ? createData('Quartos', infoImoveis?.Quartos || '') : '',
      infoImoveis?.Suites !== null ? createData('Suítes', infoImoveis?.Suites || '') : '',
      infoImoveis?.Banheiros !== null ? createData('Banheiros', infoImoveis?.Banheiros || '') : '',
    ]
  } else {
    rows = [
      createData('Andar', infoImoveis?.Andar),
      createData('Área útil', infoImoveis?.Area_util + ' (m²)'),
      createData('Condomínio', 'R$' + infoImoveis?.Condominio),
      createData('IPTU (anual)', 'R$' + infoImoveis?.IPTU),
      createData('Quartos', infoImoveis?.Quartos),
      createData('Suítes', infoImoveis?.Suites),
      createData('Banheiros', infoImoveis?.Banheiros),
    ]
  }
  useEffect(() => {
    // rows.map((row, i) => {
    //   if(row.info !== '' && row.info !== "R$undefined" && row.info !== "undefined (m²)")
    //   console.log("rowss===================================>", row)
    // })

    
  }, []);

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
            image={imoveis?.fotos}
            alt={imoveis?.descricao }
            title={imoveis?.descricao}
            onClick={handleClickOpen}
          />
        </div>

      <div className="row center">
        <Box className="back" sx={{ width: '100%' }}>
          <Button onClick={(e) => { history.push('/') } }><KeyboardBackspaceIcon />  Voltar</Button>
        </Box>

        <CardDetail data={imoveis} imovel={infoImoveis} />

        <Box className="caracteristicas" sx={{ width: '100%' }}>
          <h2>
            Características do Imóvel
          </h2>

          <span className={(openToggle ? 'active' : '')}>{infoImoveis?.descricao}</span>
          <button onClick={(e) => setOpenToggle(!openToggle) }>Saiba mais <KeyboardArrowDownIcon style={{ float: "right" }}/></button>
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
      getAuthors: dispatch(getAuthors()),
      getArticles: dispatch(getArticles()),
      getImoveisCache: dispatch(getImoveisCache())
    },
    dispatch
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CharacterDetail));