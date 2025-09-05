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
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Header } from "../../components/Header";
import { Loading } from "../../components/Loading";
import { TopInfo } from "../../components/TopInfo";

const Home = ({ character }) => {

  const [ApiDistrict, setApiDistrict] = useState([]);
  const [realEstate, setRealEstate] = useState(character);

  const [search, setSearch] = useState([]);

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
  'Vila Sônia',
  'Vila Nova Conceição'
]

  //useEffect for not loop, and many request's
  useEffect(() => {
    setApiDistrict(data.map((item, index) => ({
      label: item, 
      id: index
    })))

    if(character.character.data?.length > 0 )
      setRealEstate(character)

    if(search.label?.length > 0 ){
      character.character.data.filter((item, index) => {
          if(item.descricao.includes(search.label)){
            //loading
            setRealEstate("")
            setTimeout(() => {
               setRealEstate({character: {
                data: [item]
              }})
            }, 2500);
          }
        }
      )
    }
    

    //Disable click right mouse
    // const handleContextMenu = (e) => {
    //   e.preventDefault(); // Prevent the default context menu
    // };

    // // Attach the event listener to the document body
    // document.body.addEventListener('contextmenu', handleContextMenu);

    // // Clean up the event listener when the component unmounts
    // return () => {
    //   document.body.removeEventListener('contextmenu', handleContextMenu);
    // };
  }, [character, search]);

  const [menu] = useState([
    {
      title: "Início",
      action: "/"
    },
    {
      title: "Contato",
      action: "/"
    }
  ]);

   const handleClick = cardID => {

   }

  return (
    <React.Fragment>
      <TopInfo />
      <Header menu={menu}/>

      <div className="row center">
        <div className="content" style={{ minHeight: "auto",  display: "block" }}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} style={{ gridColumnGap: "20px" }}>
              <Grid size={8}>
                <Autocomplete
                  disablePortal
                  options={ApiDistrict}
                  sx={{ width: 300 }}
                  onChange={(event, value) => setSearch(value)}
                  renderInput={(params) => <TextField {...params} label="Pesquise por Bairros..." />}
                />
              </Grid>
              <Grid size={4}>
                <Button variant="contained" style={{ width: "100%" }}>
                  <SearchIcon  onClick={(e) => {handleClick() }} />
                </Button>
              </Grid>
            </Grid>
          </Box>
        </div>
      </div>

      <Container>
        { realEstate === "" ? 
          <Loading /> : 
          <Card data={realEstate} 
        />}
      </Container>

      <Pagination data={realEstate}  />
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
