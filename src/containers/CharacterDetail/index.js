import React, { useState, useEffect } from "react";
import { withRouter, useHistory } from "react-router-dom";
import { connect   } from "react-redux";
import { Container } from "../../components";
import CardDetail from "../../components/CardDetail";
// import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Header } from "../../components/Header";
import { TopInfo } from "../../components/TopInfo";
import { TopHeader } from "../../components/TopHeader";
import { Footer } from "../../components/Footer";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { bindActionCreators } from "redux";
import { getAuthors } from "../../actions";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import BedIcon from '@mui/icons-material/Bed';
import ShowerIcon from '@mui/icons-material/Shower';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import SellIcon from '@mui/icons-material/Sell';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Box from '@mui/material/Box';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import "./DetailImovel.css";

const CharacterDetail = ({ characterDetail, authors }) => {

  function createData(
    name: string,
    info: string
  ) {
    return { name, info};
  }

  const imovel = characterDetail.characterDetail[0]
  const history = useHistory();

  if (characterDetail.characterDetail.length === 0) {
    history.push('/')
  }
  // const [avatar, setAvatar] = useState([]);

  const rows = [
    createData('Andar', imovel?.Andar),
    createData('Área útil', imovel?.Area_util),
    createData('Área total', imovel?.Area_Total),
    createData('Área terreno', imovel?.Area_Terreno),
    createData('Ano de construção', imovel?.Ano_Construcao),
    createData('Condomínio', imovel?.Condominio),
    createData('IPTU (anual)', imovel?.IPTU),
    createData('Quartos', imovel?.Quartos),
    createData('Suítes', imovel?.Suites),
    createData('Banheiros', imovel?.Banheiros),
  ];

    useEffect(() => {
      if(authors.data?.length > 0){
        authors.data.filter((item, index) =>  {
          if(imovel.autor.name.includes(item.name)){
            Object.assign(characterDetail, {
              avatar: item.avatar.url
            })
          }
        })
      }
    }, [authors, imovel]);

  return (
    <React.Fragment>
      <TopInfo />
      <Header />

      <div className="row center">
        <Box className="back" sx={{ width: '100%' }}>
          <Button onClick={(e) => { history.push('/') } }><KeyboardBackspaceIcon />  Voltar</Button>
        </Box>

        <CardDetail data={characterDetail} />

        <Card className="card imovel-info" key={imovel.id} sx={{ maxWidth: 345,  background: 'transparent',
          border: '0', boxShadow: 'none', marginBottom: '40px' }}>
          <CardActionArea>
            <CardContent>
              <Typography className="icon-card icon-sale" variant="body2" color="text.secondary">
                {imovel.valor_venda !== null ? (
                  <div>
                    R$ {imovel.valor_venda}
                  </div>
                )
                  : ''
                }
              </Typography>
              <Typography className="icon-card" variant="body2" color="text.secondary">
                <FullscreenIcon /> {imovel.Area_Total} 
              </Typography>
              <Typography className="icon-card" variant="body2" color="text.secondary">
                <BedIcon /> {imovel.Quartos} 
              </Typography>
              <Typography className="icon-card" variant="body2" color="text.secondary">
                <ShowerIcon /> {imovel.Banheiros} 
              </Typography>
              <Typography className="icon-card" variant="body2" color="text.secondary">
                <DirectionsCarIcon /> {imovel.Vagas} 
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        
         {imovel.valor_venda !== null ? (
                  <>
                    <TableContainer style={{ boxShadow: 'none' }}>
                      <Table className="TableInfo-imovel" sx={{ fontSize: "0.5rem" }} aria-label="simple table">
                        {/* <TableHead>
                          <TableRow>
                            <TableCell>Dessert (100g serving)</TableCell>
                            <TableCell align="right">Calories</TableCell>
                            <TableCell align="right">Fat&nbsp;(g)</TableCell>
                            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                            <TableCell align="right">Protein&nbsp;(g)</TableCell>
                          </TableRow>
                        </TableHead> */}
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
                  </>
                )
                  : (
                    <>
                     <Box sx={{ width: '100%' }}>
                        <Typography variant="h5" gutterBottom>
                          Características do Imóvel
                        </Typography>

                        {imovel.descricao}
                      </Box>
                    </>
                  )
                }
        
      </div>

      <Footer />
    </React.Fragment>
  );
};

const mapStateToProps = state => ({
  characterDetail: state.character,
  authors: state.character.authors
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getAuthors: dispatch(getAuthors())
    },
    dispatch
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CharacterDetail));