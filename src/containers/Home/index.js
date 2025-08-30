import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Container } from "../../components";
import { getArticles } from "../../actions";
import "./Home.css";
import Card from "../../components/Card";
import Pagination from "../../components/Pagination";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { GetApiDistrict } from '../../utils';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

const Home = ({ character }) => {

  const [ApiDistrict, setApiDistrict] = useState([]);

  const data = ['Água Rasa',
  'Alto de Pinheiros',
  'Anhanguera',
  'Aricanduva',
  'Artur Alvim',
  'Barra Funda',
  'Bela Vista',
  'Belém',
  'Bom Retir',
  'Brasilândia',
  'Butantã',
  'Cachoeirinha',
  'Cambuci',
  'Campo Belo',
  'Campo Grande',
  'Campo Limpo',
  'Cangaíba',
  'Capão Redondo',
  'Carrão',
  'Casa Verde',
  'Cidade Ademar',
  'Cidade Dutra',
  'Cidade Líder',
  'Cidade Tiradentes',
  'Consolação',
  'Cursino',
  'Ermelino Matarazzo',
  'Freguesia do Ó',
  'Grajaú',
  'Guaianases',
  'Iguatemi',
  'Ipiranga',
  'Itaim Bibi',
  'Itaim Paulista',
  'Itaquera',
  'Jabaquara',
  'Jaçanã',
  'Jaguara',
  'Jaguaré',
  'Jaraguá',
  'Jardim Ângela',
  'Jardim Helena',
  'Jardim Paulista',
  'Jardim São Luís',
  'Lapa',
  'Liberdade',
  'Limão',
  'Mandaqui',
  'Marsilac',
  'Moema',
  'Mooca',
  'Morumbi',
  'Parelheiros',
  'Pari',
  'Parque do Carmo',
  'Penha',
  'Perdizes',
  'Pinheiros',
  'Ponte Rasa',
  'Raposo Tavares',
  'República',
  'Rio Pequeno',
  'Sacomã',
  'Santa Cecília',
  'Santana',
  'Santo Amaro',
  'São Domingos',
  'São Lucas',
  'São Mateus',
  'São Miguel Paulista',
  'São Rafael',
  'Sapopemba',
  'Saúde',
  'Sé',
  'Tatuapé',
  'Tremembé',
  'Tucuruvi',
  'Vila Andrade',
  'Vila Curuçá',
  'Vila Formosa',
  'Vila Guilherme',
  'Vila Jacuí',
  'Vila Leopoldina',
  'Vila Maria',
  'Vila Mariana',
  'Vila Matilde',
  'Vila Medeiros',
  'Vila Prudente',
  'Vila Sônia']

  //useEffect for not loop, and many request's
  useEffect(() => {
    setApiDistrict(data.map((item, index) => ({
      label: item, 
      id: index
    })))
  }, []);

  return (
    <React.Fragment>
      <Container>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid size={8}>
              <Autocomplete
                disablePortal
                options={ApiDistrict}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Pesquise por Bairros..." />}
              />
            </Grid>
            <Grid size={4}>
              <Button variant="contained" style={{ width: "100%" }}>
                <SearchIcon />
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Card data={character}  />
      </Container>

      <Pagination data={character}  />
    </React.Fragment>
  );
};

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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
