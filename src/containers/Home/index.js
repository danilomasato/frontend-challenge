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

const Home = ({ character, imoveisCache }) => {

  const [realEstate, setRealEstate] = useState([]);
  const [search, setSearch] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imoveis, setImoveis] = useState(false);
  const [error, setError] = useState(null);

  //atualiza o json cache dos imoveis
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Await the fetch call
        const response = await fetch(process.env.REACT_APP_API_URL + "Articles?pagination[page]=1&pagination[pageSize]=10&populate=fotos&populate=autor");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Await the response.json() call, which also returns a promise
        const result = await response.json();
        setTimeout(() => {
          // setRealEstate(result)
          setRealEstate({character: {
            data: result.data
          }})
        }, 60000)
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [realEstate]); // Empty dependency array ensures this runs once

  useEffect(() => {
    character.character?.length > 0 ? setImoveis(character.character?.data) : setImoveis(imoveisCache.data)
    setRealEstate({character: { data: imoveisCache.data }})
    
  }, [character, imoveisCache]);
  
  let research= [];

  //useEffect for not loop, and many request's
  useEffect(() => {

    //data for card
    if(imoveis?.length > 0 ){

      imoveis.filter((item, index) => {

          if(item.regiao.includes(search.label)){

            //loading
            setLoading(true)

            if(search.label !== "" && item.regiao.includes(search.label)){
              setRealEstate("")
            }

            research = research.concat(item)

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

      // console.log("realEstate===============================>", realEstate)

  }, [imoveis, search, realEstate]);

  const handleClick = cardID => { }

  return (
    <React.Fragment>
      <TopInfo />
      <Header />

      <div className="row center">
        <div className="content" style={{ minHeight: "auto",  display: "block" }}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} style={{ gridColumnGap: "20px" }}>
              <Grid size={8}>
                { imoveis?.length > 0 ? (<>
                  <Autocomplete
                    className="search-neighborhoods"
                    disablePortal
                    options={imoveis.map(((item, index) => (
                    {
                      "label": item.regiao, 
                      "id": index
                    }
                    )))}
                    InputProps={{
                      className: 'search-neighborhoods',
                      style: { backgroundColor: 'lightgray' }, // Estilo inline para o input
                    }}
                    onChange={(event, value) => { setSearch(value) }}
                    renderInput={(params) => <TextField {...params} label="Pesquise por Bairros..." />}
                  />
                </>)
                : 
                ""
                }
                
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

      { realEstate?.character?.data?.length > 0 ? 
          <Card data={realEstate} /> : 
          <Loading />
      }

      { loading ? 
          <Loading /> : 
          ""
      }

      <Pagination data={realEstate} />
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
