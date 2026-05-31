import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { getArticles, getImoveisCache, getCharacterData } from "../../actions";
import "./Home.css";
import Card from "../../components/Card";
import Pagination from "../../components/Pagination";
import { TextField, MenuItem } from '@mui/material';
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
import Typography from '@mui/material/Typography';
import { Container } from "../../components";

const Home = ({ character, imoveisCache, pagination}) => {

  const [realEstate, setRealEstate] = useState([]);
  const [search, setSearch] = useState();
  const [loading, setLoading] = useState(true);
  const [imoveis, setImoveis] = useState([]);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState([]);
  const [category, setCategory] = useState('');
  const [optionsValue, setOptionsValue] = useState({
    min: 0,
    max: 0
  });

   const closeLoad = () => {
      setTimeout(() => {
      setLoading(false)
      // setSearch('')
      }, 2000);
    }

  useEffect(() => {
    const payload = pagination?.length > 0 ? pagination : character.character?.data

    payload?.length > 0 ? setImoveis(payload) : setImoveis(imoveisCache.data)
  
    payload?.length > 0 ? setRealEstate({character: { data: payload }}) : setRealEstate(imoveisCache.data)

    if(research?.length <= 0) {
      closeLoad()
    }
  }, [character, pagination]);
  
  let research= [];

  //useEffect for not loop, and many request's
  useEffect(() => {

    //data for card
    if(imoveis?.length > 0 ){

      const mapa = new Map();
      imoveis.forEach((obj, index) => {
        if(obj.Bairro !== null)
          mapa.set(obj.Bairro?.toLowerCase(), obj); // Define o ID como chave e o objeto como valor
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
    setRealEstate({character: {
      data: []
    }})
  }

  const handleClick = () => {
      if(!("neighborhood" in localStorage) && search?.label?.length === undefined) {
        alert("Selecione um Bairro para fazer a Busca...")
      } else {
        //loading
        setLoading(true)

        //limpa array imóveis
        clearSearch()

        const setResearch = imovel => {
          if(imovel !== 'undefined' && imovel !== undefined){
            research = research.concat(imovel)

            setTimeout(() => {
              setRealEstate({character: {
                data: research
              }})
            }, 1500);
          }
        }

      let valueMin, valueMax
      let roleSale, roleRental
      let itemValueAluguel, itemValueVenda 
          console.log('local', optionsValue)

      valueMin = parseInt(optionsValue?.min > 0 && optionsValue?.min?.replace(',','')?.replace('R$',''))
      valueMax = parseInt(optionsValue?.max?.replace(',','')?.replace('R$',''))

      imoveis.filter((item, index) => {

        const minMax = imovel => {

          if(imovel?.Valor_Aluguel !== 'undefined' && imovel?.Valor_Aluguel !== undefined && imovel?.Valor_Aluguel !== null)
            itemValueAluguel = parseInt(imovel?.Valor_Aluguel?.replace(".",""))

          if(imovel?.Valor_Venda !== 'undefined' && imovel?.Valor_Venda !== undefined && imovel?.Valor_Venda !== null)
            itemValueVenda = parseInt(imovel?.Valor_Venda?.replace(".",""))

          roleSale = valueMin > 0 && itemValueVenda !== NaN && itemValueVenda <= valueMin || valueMax > 0 && itemValueVenda !== NaN && itemValueVenda <= valueMax
          roleRental = valueMax > 0 && itemValueAluguel !== NaN && itemValueAluguel <= valueMax || valueMin > 0 && itemValueAluguel !== NaN && itemValueAluguel <= valueMin

          if(roleSale && imovel.Tipo_de_Anuncio == 'venda')
            return imovel

          if(roleRental && imovel.Tipo_de_Anuncio == 'aluguel')
            return imovel

          //se não encontrar resultados limpa a busca
          if(!roleSale && !roleRental)
            clearSearch()
        }

          // if(!search?.label.includes(localStorage.getItem("neighborhood"))){
          //   localStorage.setItem("neighborhood", search.label)
          // }

          //busca por localstorage (mantem o bairro)
          // if(localStorage.length > 0 && item?.Bairro.includes(localStorage.getItem("neighborhood")) && category == ''){
          //   setResearch(minMax(item))
          // }

          //busca por bairro valor min e max
          if(item.Bairro.includes(search?.label) && category == ''){
            console.log('tayf')
            setResearch(minMax(item))
          }

          //busca por tipo de anuncio e bairro
          // if(category !== '' && item.Tipo_de_Anuncio.includes(category) && item.Bairro.includes(search?.label)){
          //   setResearch(minMax(item))
          // }
      })

      //se não houver setado localstorage registra o bairro
      if(localStorage.length <= 0 ){
        localStorage.setItem("neighborhood", search.label)
      }

      closeLoad()
    }
  }
  // Limpa o localStorage quando o usuário fecha a aba ou o navegador
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.clear(); // Clears all items
      // Or use localStorage.removeItem('your_key_name'); for specific keys
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleChangeCategory = (evento) => {
    setCategory(evento.target.value);
  };
  

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
              gridTemplateColumns: "320px 359px 210px 220px"
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
              <Grid size={12} className="minMax">
                <TextField
                  select
                  label="Tipo de Anúncio"
                  value={category}
                  onChange={handleChangeCategory}
                  helperText="Selecione o tipo de Anúncio"
                  style={{ m: 1, minWidth: '100%' }}
                >
                  <MenuItem value="">
                    <em>Todos</em>
                  </MenuItem>
                  <MenuItem value={'venda'}>venda</MenuItem>
                  <MenuItem value={'aluguel'}>aluguel</MenuItem>
                  <MenuItem value={'Lançamentos'}>Lançamentos</MenuItem>
                </TextField>
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
  
      { realEstate?.character?.data?.length > 0 &&
        <Card data={realEstate} /> 
      }

      {!loading && realEstate?.character?.data?.length <= 0 &&
            <Container>
              <img style={{ float: 'left', marginLeft: '180px' }}src="https://static.vecteezy.com/ti/vetor-gratis/p1/26391345-busca-sem-resultados-nao-encontrado-ilustracao-de-conceito-design-plano-eps10-elemento-grafico-moderno-para-pagina-de-destino-ui-de-estado-vazio-infografico-icone-vetor.jpg" width="300"/>
              <Typography style={{ float: 'left', textAlign: 'center', fontWeight: 'bold', fontSize: '2rem', alignSelf: 'center'}}>
                Nenhum Resultado Encontrado...
              </Typography>
            </Container>
          }

      { loading ? <Loading /> : ""}

      <Pagination data={realEstate} />

      {/* <CustomerTestimonials /> */}
      <Footer />
    </React.Fragment>
  );
};

const mapStateToProps = state => ({
  character: state.home,
  imoveisCache: state.home.imoveisCache,
  pagination: state.home.pagination?.data
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getArticles: dispatch(getArticles()),
      getImoveisCache: dispatch(getImoveisCache()),
      getCharacterData: dispatch(getCharacterData())
    },
    dispatch
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
