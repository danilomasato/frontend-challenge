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
// import { CustomerTestimonials } from "../../components/CustomerTestimonials";
import CloseIcon from '@mui/icons-material/Close';
import { NumericFormat } from 'react-number-format';
import Typography from '@mui/material/Typography';
import { Container } from "../../components";
import LocationPinIcon from '@mui/icons-material/LocationOn';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PreloadCard from "../../components/PreloadCard";
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';

const Home = ({ realstate, pagination}) => {

  const [realEstate, setRealEstate] = useState([]);
  const [search, setSearch] = useState({label: ''});
  const [loading, setLoading] = useState(true);
  const [imoveis, setImoveis] = useState([]);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState([]);
  const [category, setCategory] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [optionsValue, setOptionsValue] = useState({
    min: 0,
    max: 0
  });


  const configPreload = 6;

  const closeLoad = () => {
    setTimeout(() => {
    setLoading(false)
    }, 3500);
  }

  useEffect(() => {
    const payload = pagination?.length > 0 ? pagination : realstate
    if(payload?.length > 0){
      setRealEstate({character: { data: payload }})
      setImoveis(payload)
    }
 
    if(research?.length <= 0) {
      closeLoad();

      if (isMobile) {
        setMobileSearchOpen(false);
      }
    }
  }, [realstate, pagination]);
  
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
  }, [imoveis]);
  
  const clearSearch = (clear) => {
    //loading
    setLoading(true)

    setRealEstate({character: {
      data: clear ? imoveis : []
    }})

    //close loading
    closeLoad()
  }

  useEffect(() => {
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

  }, []);

  const handleClick = () => {
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

      const isString = value => {
        return typeof value == 'string'
      }

      valueMin = parseInt(isString(optionsValue?.min) && optionsValue?.min?.replace(',','')?.replace('R$',''))
      valueMax = parseInt(isString(optionsValue?.max) && optionsValue?.max?.replace(',','')?.replace('R$',''))

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

          //busca por localstorage (mantem o bairro)
          if(localStorage.length > 0 && item?.Bairro.includes(localStorage.getItem("neighborhood")) && category == ''){
            setResearch(minMax(item))
          }

          //busca por bairro valor min e max
          if(search.label !== '' && item.Bairro.includes(search?.label) && category == ''){
            isString(optionsValue?.min) || isString(optionsValue?.max) ? setResearch(minMax(item)) : setResearch(item)
          }

          //busca por tipo de anuncio e bairro
          if(search !== '' && category !== '' && item.Tipo_de_Anuncio.includes(category) && item.Bairro.includes(search.label)){
            isString(optionsValue?.min) || isString(optionsValue?.max) ? setResearch(minMax(item)) : setResearch(item)
          }

          //Busca somente por categoria
          if(category !== '' && item.Tipo_de_Anuncio.includes(category)){
            isString(optionsValue?.min) || isString(optionsValue?.max) ? setResearch(minMax(item)) : setResearch(item)
          }

          if(optionsValue.max > 0 ) {
            setResearch(minMax(item))
          }

           if(optionsValue.min > 0 ) {
            setResearch(minMax(item))
          }
      })

      //seta um novo bairro no localStorage quando Onchange Options
      if(!search?.label.includes(localStorage.getItem("neighborhood"))){
        localStorage.setItem("neighborhood", search.label)
      }

      //se não houver setado localstorage registra o bairro
      if(localStorage.length <= 0 ){
        localStorage.setItem("neighborhood", search.label)
      }

      closeLoad();

      if (window.innerWidth <= 1024) {
        setMobileSearchOpen(false);
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
  }, []);

  const handleChangeCategory = (evento) => {
    setCategory(evento.target.value);
  };

  const Root = styled('div')(({ theme }) => ({
    width: '100%',
    ...theme.typography.body2,
    color: (theme.vars || theme).palette.text.secondary,
    '& > :not(style) ~ :not(style)': {
      marginTop: theme.spacing(2),
    },
  }));

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const resetFilters = () => {
    setSearch({label: null});

    setCategory('');

    setOptionsValue({
      min: 0,
      max: 0
    });

    localStorage.removeItem("neighborhood");

    clearSearch("clear");

    if (window.innerWidth <= 1024) {
      setMobileSearchOpen(false);
    }
  };

  return (
    <React.Fragment>
      <TopInfo />
      <Header  />

      <div className="row center home">
        <div className="content" style={{ minHeight: "auto",  display: "block" }}>
          <Box sx={{ flexGrow: 1 }}>
            {isMobile && (
              <>
                {mobileSearchOpen && (
                  <div
                    className="mobile-search-overlay"
                    onClick={() => setMobileSearchOpen(false)}
                  />
                )}

                <div className="mobile-search-trigger">
                  <Button
                    fullWidth
                    className="mobile-search-button"
                    onClick={() => setMobileSearchOpen(true)}
                  >
                    <SearchIcon />
                    Buscar Imóveis
                  </Button>
                </div>

                <div
                  className={`mobile-search-panel ${
                    mobileSearchOpen ? "mobile-open" : ""
                  }`}
                >
                  <div className="mobile-search-header">
                    <h2>Buscar Imóveis</h2>

                    <CloseIcon
                      className="mobile-search-close-icon"
                      onClick={() => setMobileSearchOpen(false)}
                    />
                  </div>

                  <div className="mobile-search-content">

                    {imoveis?.length > 0 && (
                      <Box className="wrap-input neighborhood-mobile">
                      <Autocomplete
                        value={search || null}
                        className="search-neighborhoods"
                        disablePortal
                        options={options}
                        onChange={(event, value) => {
                          setSearch({label: value});
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Selecione o Bairro"
                          />
                        )}
                      />

                      <LocationPinIcon className="LocationPinIcon mobile-location-icon" />

                      {search && (
                        <CloseIcon
                        className="search-clear mobile-search-clear"
                        onClick={resetFilters}
                      />
                      )}
                    </Box>
                    )}

                    <Box className="wrap-input">
                      <NumericFormat
                        value={optionsValue.min}
                        onChange={(e) =>
                          setOptionsValue({
                            ...optionsValue,
                            min: e.target.value
                          })
                        }
                        customInput={TextField}
                        thousandSeparator
                        valueIsNumericString
                        prefix="R$ "
                        variant="outlined"
                        label="Valor Mínimo"
                        fullWidth
                      />
                    </Box>

                    <Box className="wrap-input">
                      <NumericFormat
                        value={optionsValue.max}
                        onChange={(e) =>
                          setOptionsValue({
                            ...optionsValue,
                            max: e.target.value
                          })
                        }
                        customInput={TextField}
                        thousandSeparator
                        valueIsNumericString
                        prefix="R$ "
                        variant="outlined"
                        label="Valor Máximo"
                        fullWidth
                      />
                    </Box>

                    <TextField
                      select
                      fullWidth
                      label="Tipo de Anúncio"
                      value={category}
                      onChange={handleChangeCategory}
                      SelectProps={{
                        MenuProps: {
                          disableScrollLock: true
                        }
                      }}
                    >
                      <MenuItem value="todos">Todos</MenuItem>
                      <MenuItem value="venda">Venda</MenuItem>
                      <MenuItem value="aluguel">Aluguel</MenuItem>
                      <MenuItem value="Lançamentos">
                        Lançamentos
                      </MenuItem>
                    </TextField>

                    <Button
                      className="search-button"
                      variant="contained"
                      onClick={handleClick}
                    >
                      Buscar Imóveis
                      <SearchIcon />
                    </Button>
                    <Button
                    className="clear-filters-button"
                    variant="outlined"
                    onClick={resetFilters}
                  >
                    Limpar filtros
                  </Button>

                  </div>
                </div>
              </>
            )}

            {!isMobile && (
              <Grid className="wrap-search" container>

                <Grid size={8}>
                  {imoveis?.length > 0 && (
                    <>
                      <Box className="wrap-input">
                        <label
                          style={{
                            fontFamily: "quicksand-regular",
                            fontSize: "0.6rem",
                            color: "rgba(0,0,0,.6)",
                            margifn: "-3px 0 10px 0",
                            display: "block"
                          }}
                        >
                          Selecione o Bairro
                        </label>

                        <Autocomplete
                          value={search || null}
                          className="search-neighborhoods"
                          disablePortal
                          options={options}
                          onChange={(event, value) => {
                            setSearch({label: value});
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Selecione o Bairro"
                            />
                          )}
                        />

                        <LocationPinIcon className="LocationPinIcon" />

                        <CloseIcon
                          className="search-clear"
                          onClick={resetFilters}
                        />
                      </Box>
                    </>
                  )}
                </Grid>

                <Grid
                  component="form"
                  sx={{ "& > :not(style)": { width: "15ch" } }}
                  noValidate
                  autoComplete="off"
                  className="minMax"
                >
                  <Box className="wrap-input">
                    <MonetizationOnIcon className="MonetizationOnIcon" />

                    <NumericFormat
                      value={optionsValue.min}
                      onFocus={() =>
                        setOptionsValue({
                          ...optionsValue,
                          min: ""
                        })
                      }
                      onChange={(e) =>
                        setOptionsValue({
                          ...optionsValue,
                          min: e.target.value
                        })
                      }
                      customInput={TextField}
                      thousandSeparator
                      valueIsNumericString
                      prefix="R$"
                      variant="standard"
                      label="Valor Min"
                    />
                  </Box>

                  <Box className="wrap-input">
                    <MonetizationOnIcon className="MonetizationOnIcon" />

                    <NumericFormat
                      value={optionsValue.max}
                      onFocus={() =>
                        setOptionsValue({
                          ...optionsValue,
                          max: ""
                        })
                      }
                      onChange={(e) =>
                        setOptionsValue({
                          ...optionsValue,
                          max: e.target.value
                        })
                      }
                      customInput={TextField}
                      thousandSeparator
                      valueIsNumericString
                      prefix="R$"
                      variant="standard"
                      label="Valor Max"
                      style={{ marginLeft: "15px" }}
                    />
                  </Box>
                </Grid>

                <Grid size={12} className="minMax">
                  <TextField
                    select
                    label="Tipo de Anúncio"
                    value={category}
                    onChange={handleChangeCategory}
                    style={{ minWidth: '100%' }}
                    className="selectType"
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="venda">Venda</MenuItem>
                    <MenuItem value="aluguel">Aluguel</MenuItem>
                    <MenuItem value="Lançamentos">Lançamentos</MenuItem>
                  </TextField>
                </Grid>

                <Grid size={4}>
                  <Button
                    className="search-button"
                    variant="contained"
                    style={{ width: "100%" }}
                    onClick={handleClick}
                  >
                    Buscar Imóveis
                    <SearchIcon />
                  </Button>
                </Grid>
              </Grid>
            )}

          </Box>
        </div>
      </div>

      { realEstate?.character?.data?.length > 0 ?
        <Card data={realEstate} /> 
        :
        (
          <>
          {loading && (
            <>
              <Root>
                <Divider className="divider">
                  <Chip className="divider-chip" label="Imóveis à Venda" size="small"/>
                </Divider>
              </Root> 
              <Box id="preload" className="preload" style={{
                  display: 'grid',
                  gap: '30px',
                  width: '1230px',
                  marginInline: 'auto',
                  marginTop: '40px',
                  gridTemplateColumns: 'repeat(3, 1fr)'
              }}>
              {Array.from({ length: configPreload }).map((_, index) => (
                <PreloadCard />
              ))}
            </Box>
            </>
          )} 
          </>
        )
      }

      {!loading && realEstate?.character?.data?.length <= 0 &&
            <Container className="empty-state">
              <div class="empty-state__illustration">
                  <div class="empty-state__decor">
                      <span>✦</span>
                      <span>+</span>
                      <span>✦</span>
                  </div>

                  <div class="empty-state__icon"></div>
              </div>

              <div class="empty-state__content">
                  <div class="empty-state__tag">
                      Ops, nada por aqui
                  </div>
                  <h2 class="empty-state__title">
                      Nenhum resultado encontrado.
                  </h2>
                  <p class="empty-state__description">
                      Tente ajustar os filtros de busca ou explorar
                      outras regiões e oportunidades incríveis.
                  </p>
                  <button class="empty-state__button" onClick={() => { clearSearch('clear') }}>
                    🧹 Limpar filtros
                  </button>
              </div>
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
  realstate: state.home.realestate.data,
  pagination: state.home.pagination?.data
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      realstate: dispatch(getArticles())
      // pagination: dispatch(getCharacterData())
    },
    dispatch
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
