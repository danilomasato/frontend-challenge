import React, { useState, useEffect } from "react";
import { withRouter, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { Container } from "../../components";
import CardDetail from "../../components/CardDetail";
import Button from '@mui/material/Button';
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



const CharacterDetail = ({ characterDetail }) => {

  function createData(
    name: string,
    calories: string,
    fat: string,
    carbs: string,
    protein: string,
  ) {
    return { name, calories, fat, carbs, protein };
  }

const rows = [
  createData('Área útil', '108,00m²'),
  createData('Área total', '108,00m²'),
  createData('Área terreno', '108,00m²'),
  createData('Ano de construção', '2022 (3 anos)'),
  createData('Condomínio', 'R$ 1.639'),
  createData('IPTU (anual)', 'R$ 4.605'),
  createData('Quartos', '2'),
  createData('Suítes', '1'),
  createData('Banheiros', '2'),
];

  const history = useHistory();

  return (
    <React.Fragment>
      <TopInfo />
        <Header />
        <TopHeader />
      <div className="row center">
        <Stack className="center" direction="row" spacing={10}>
          <Button onClick={(e) => { history.push('/') } }>Voltar</Button>
        </Stack>

        <CardDetail data={characterDetail} />

        <TableContainer component={Paper} style={{ boxShadow: 'none' }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
                  <TableCell component="th" scope="row" ></TableCell>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.calories}</TableCell>
                  {/* <TableCell align="right">{row.fat}</TableCell>
                  <TableCell align="right">{row.carbs}</TableCell> */}
                  <TableCell align="right">{row.protein}</TableCell>
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
  characterDetail: state.character
});

export default withRouter(connect(mapStateToProps)(CharacterDetail));