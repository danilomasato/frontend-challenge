import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { getArticles, getImoveisCache } from "../../actions";
import "./Home.css";
import Card from "../../components/Card";
import Pagination from "../../components/Pagination";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Header } from "../../components/Header";
import { Loading } from "../../components/Loading";
import { TopInfo } from "../../components/TopInfo";
import { Footer } from "../../components/Footer";
import { GetAPI } from "../../utils";
import { CustomerTestimonials } from "../../components/CustomerTestimonials";
import CloseIcon from '@mui/icons-material/Close';
import { NumericFormat } from 'react-number-format';

const Home = ({ character, imoveisCache }) => {

  const [realEstate, setRealEstate] = useState([]);
  const [search, setSearch] = useState();
  const [loading, setLoading] = useState(false);
  const [imoveis, setImoveis] = useState([]);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState([]);
  const [optionsValue, setOptionsValue] = useState({
    min: 0,
    max: 0
  });
  const payload = character.character?.data

  useEffect(() => {
    payload?.length > 0 ? setImoveis(payload) : setImoveis(imoveisCache.data)
  }, [character]);

  useEffect(() => {
    payload?.length > 0 ? setRealEstate({character: { data: payload }}) : setRealEstate(imoveisCache.data)
  }, [character]);
  
  let research= [];

  //useEffect for not loop, and many request's
  useEffect(() => {

    //data for card
    if(imoveis?.length > 0 ){

      const mapa = new Map();
      imoveis.forEach(obj => {
        if(obj.Bairro !== null)
          mapa.set(obj.Bairro, obj); // Define o ID como chave e o objeto como valor
      });

      let objetosUnicosPorId = Array.from(mapa.values());

      //monta array options bairros e ordena por ordem alfabetica
      setOptions(objetosUnicosPorId.map(((item, index) => (
              {
                "label": item.Bairro, 
                "id": index
              }
            ))).sort(function(a,b) {
          if(a.label < b.label) return -1;
          if(a.label > b.label) return 1;
          return 0;
      }))
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

  }, [imoveis, search]);
  
  const clearSearch = () => {
    window.location = 'https://tudosobreap.com.br'
  }


const handleClick = () => {
  if(!("neighborhood" in localStorage) && search?.label?.length === undefined) {
    alert("Selecione um Bairro para fazer a Busca...")
  } else {

    imoveis.filter((item, index) => {
        if(item.Bairro.includes(search.label) || localStorage.length > 0 && item.Bairro.includes(localStorage.getItem("neighborhood"))){
          //loading
          setLoading(true)
          
          if(search?.label?.length > 0 && item.Bairro.includes(search.label)){
            setRealEstate("")
            
          } 

          let valueMin= optionsValue?.min
          let valueMax = optionsValue?.max

          if(valueMax?.length > 0){
            valueMax = parseInt(valueMax?.replace(',','')?.replace('R$',''))
          }

          if(valueMin?.length > 0){
            valueMin = parseInt(valueMin?.replace(',','')?.replace('R$',''))
          }

          const itemValueAluguel = parseFloat(item?.Valor_Aluguel?.replace(".",""))
          const itemValueVenda = parseFloat(item?.Valor_Venda?.replace(".",""))

          if(valueMin  > 0 && itemValueVenda !== NaN && itemValueVenda <= valueMin){
            research = research.concat(item)
          }
          if(valueMax > 0 && itemValueAluguel !== NaN && itemValueAluguel <= valueMax ){
            research = research.concat(item)
          }

          setTimeout(() => {
            setRealEstate({character: {
              data: research
            }})

            setLoading(false)
            setSearch(false)
          }, 2500);

        }
      }
    )
  }
}
  

  return (
    <React.Fragment>
      <TopInfo />
      <Header  />

      <div className="row center home">
        <div className="content" style={{ minHeight: "auto",  display: "block" }}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} style={{ 
              gridColumnGap: "20px",
              display: "grid",
              gridTemplateColumns: "320px 360px  200px"
             }}>
              <Grid size={8}>
                { imoveis?.length > 0 ? (<>
                  <label style={{ 
                    fontFamily: 'quicksand-regular', 
                    fontSize: '0.6rem', 
                    color: 'rgba(0, 0, 0, 0.6)',
                    margin: '-3px 0 10px 20px',
                    display: 'block'
                    }}> 
                    Selecione o Bairro
                  </label>
                  <Autocomplete
                    className="search-neighborhoods"
                    disablePortal
                    options={options}
                    InputProps={{
                      className: 'search-neighborhoods',
                      style: { backgroundColor: 'lightgray' }, // Estilo inline para o input
                    }}
                    onChange={(event, value) => { setSearch(value) }}
                    renderInput={(params) => <TextField {...params} label="Selecione o Bairro" />}
                    
                  />
                  <CloseIcon className="search-clear" onClick={() => { clearSearch() }} />
                </>)
                : 
                ""
                }
                
              </Grid>
               <Grid
                component="form"
                sx={{ '& > :not(style)': { width: '15ch' } }}
                noValidate
                autoComplete="off"
                className="minMax"
              >
                  <NumericFormat
                  value={optionsValue.min}
                  onFocus={(e) => setOptionsValue({...optionsValue, min: '' })}
                  onChange={(e) => {
                    setOptionsValue({...optionsValue, min: '' })
                    setOptionsValue({...optionsValue, min: e.target.value })
                  }}
                  customInput={TextField}
                  thousandSeparator
                  valueIsNumericString
                  prefix="R$"
                  variant="standard"
                  label="Valor Min"
                />
               <NumericFormat
                  value={optionsValue.max}
                  onFocus={(e) => setOptionsValue({...optionsValue, max: '' })}
                  onChange={(e) => {setOptionsValue({...optionsValue, max: e.target.value }) }}
                  customInput={TextField}
                  thousandSeparator
                  valueIsNumericString
                  prefix="R$"
                  variant="standard"
                  label="Valor Max"
                style={{ marginLeft: "15px"}}/>
              </Grid>
              <Grid size={4}>
                <Button className="search-button" variant="contained" style={{ width: "100%" }} onClick={(e) => {handleClick(e) }}>
                  Buscar Imóveis
                  <SearchIcon   />
                </Button>
              </Grid>
            </Grid>
          </Box>
        </div>
      </div>

      { realEstate?.character?.data?.length > 0 ? 
          <Card data={realEstate} /> : 
          <Loading />
      }

      { loading ? 
          <Loading /> : 
          ""
      }

      <Pagination data={realEstate} />

      {/* <CustomerTestimonials /> */}
      <Footer />
    </React.Fragment>
  );
};

const mapStateToProps = state => ({
  character: state.home,
  imoveisCache: state.home.imoveisCache
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getArticles: dispatch(getArticles()),
      getImoveisCache: dispatch(getImoveisCache())
    },
    dispatch
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
