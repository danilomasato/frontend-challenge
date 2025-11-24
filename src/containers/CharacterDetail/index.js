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
import SellIcon from '@mui/icons-material/Sell';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Box from '@mui/material/Box';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import "./DetailImovel.css";
import { getArticles } from "../../actions";

const CharacterDetail = ({ data, realRstate, authors }) => {
// console.log("data==============>", data)
  function createData(
    name: string,
    info: string
  ) {
    return { name, info};
  }

  let imovel = realRstate
  const history = useHistory();
  const urlShare = window.location.href
  const idMount = window.location.hash.substring(0,11).replace('#/imovel/', '')

  // if (characterDetail.characterDetail.length === 0) {
  //   history.push('/')
  // }
  
  if(data?.length > 0) {
    data.filter(card => {
      if(card.id === parseInt(idMount)){
        realRstate = card
        imovel = card
      }
    })
  }

  let rows = []

  if(imovel?.valor_venda !== null) {
    rows = [
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
    ]
  } else {
    rows = [
      createData('Andar', imovel?.Andar),
      createData('Área útil', imovel?.Area_util),
      createData('Condomínio', imovel?.Condominio),
      createData('IPTU (anual)', imovel?.IPTU),
      createData('Quartos', imovel?.Quartos),
      createData('Suítes', imovel?.Suites),
      createData('Banheiros', imovel?.Banheiros),
    ]
  }

    useEffect(() => {
      if(authors.data?.length > 0){
        authors.data.filter((item, index) =>  {
          if(imovel?.autor !== null && imovel?.autor.name.includes(item.name)){
            Object.assign(realRstate, {
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

        <CardDetail data={realRstate} imovel={imovel} />

         {imovel?.valor_venda !== null ? (
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
                     <Box style={{ float: "left", width: "100%", marginBottom: "20px" }} sx={{ width: '100%' }}>
                        <Typography variant="h5" gutterBottom>
                          Características do Imóvel
                        </Typography>

                        {imovel.descricao}
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
                    </>
                  )
                }
        
      </div>

      <Footer />
    </React.Fragment>
  );
};

const mapStateToProps = state => ({
  data: state.home.character.data,
  realRstate: state.character.characterDetail[0],
  authors: state.character.authors
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getAuthors: dispatch(getAuthors()),
      getArticles: dispatch(getArticles())
    },
    dispatch
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CharacterDetail));