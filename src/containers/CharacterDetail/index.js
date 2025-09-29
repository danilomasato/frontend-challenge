import React, { useState, useEffect } from "react";
import { withRouter, useHistory } from "react-router-dom";
import { connect   } from "react-redux";
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
import { bindActionCreators } from "redux";
import { getAuthors } from "../../actions";

const CharacterDetail = ({ characterDetail, authors }) => {

  function createData(
    name: string,
    calories: string,
    fat: string,
    carbs: string,
    protein: string,
  ) {
    return { name, calories, fat, carbs, protein };
  }

  const imovel = characterDetail.characterDetail[0]
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

  const history = useHistory();
    useEffect(() => {
      authors.data.filter((item, index) =>  {
        if(imovel.autor.name.includes(item.name)){
          Object.assign(characterDetail, {
            avatar: item.avatar.url
          })
        }
      })
    }, [authors]);

  return (
    <React.Fragment>
      <TopInfo />
      <Header />

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