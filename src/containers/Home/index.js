import React, {
  useState,
  useEffect,
  useMemo
} from "react";

import { withRouter } from "react-router-dom";

import {
  connect,
  useDispatch
} from "react-redux";

import { getArticles } from "../../actions";

import * as api from "../../api";
import * as types from "../../constants/ActionTypes";

import "./Home.css";

import Card from "../../components/Card";
import Pagination from "../../components/Pagination";

import {
  TextField,
  MenuItem
} from "@mui/material";

import Autocomplete from "@mui/material/Autocomplete";

import { Button } from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import { Header } from "../../components/Header";
import { Loading } from "../../components/Loading";
import { TopInfo } from "../../components/TopInfo";
import { Footer } from "../../components/Footer";

import CloseIcon from "@mui/icons-material/Close";

import { NumericFormat } from "react-number-format";

import { Container } from "../../components";

import LocationPinIcon from "@mui/icons-material/LocationOn";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

import PreloadCard from "../../components/PreloadCard";

import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";

import { styled } from "@mui/material/styles";


const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  color: (theme.vars || theme).palette.text.secondary,

  "& > :not(style) ~ :not(style)": {
    marginTop: theme.spacing(2),
  },
}));


const Home = ({
  realstate,
  pagination
}) => {

  const dispatch = useDispatch();


  /*
   * =====================================================
   * ESTADOS
   * =====================================================
   */

  const [search, setSearch] = useState({
    label: "",
    id: ""
  });


  const [loading, setLoading] =
    useState(true);


  const [imoveis, setImoveis] =
    useState([]);


  const [category, setCategory] =
    useState("");


  const [mobileSearchOpen, setMobileSearchOpen] =
    useState(false);


  const [hasFilters, setHasFilters] =
    useState(false);


  const [optionsValue, setOptionsValue] =
    useState({
      min: 0,
      max: 0
    });


  const [isMobile, setIsMobile] =
    useState(
      window.innerWidth <= 1024
    );


  const configPreload = 6;


  /*
   * =====================================================
   * DADOS DOS CARDS
   * =====================================================
   */

  const data = useMemo(
    () =>
      Array.isArray(realstate)
        ? realstate
        : [],
    [realstate]
  );


  const realEstate = useMemo(
    () => ({
      character: {
        data
      }
    }),
    [data]
  );


  /*
   * =====================================================
   * CARREGAMENTO INICIAL
   * =====================================================
   */

  useEffect(() => {

    let mounted = true;


    const loadInitialData = async () => {

      setLoading(true);


      const articlesPromise =
        dispatch(
          getArticles()
        );


      const bairrosPromise =
        api.getAllBairros();


      try {

        await articlesPromise;

      } catch (error) {

        console.error(
          "Erro ao carregar imóveis:",
          error
        );

      } finally {

        if (mounted) {

          setLoading(false);

        }

      }


      try {

        const bairros =
          await bairrosPromise;


        if (
          mounted &&
          Array.isArray(bairros)
        ) {

          setImoveis(
            bairros.map(
              (bairro) => ({
                Bairro: bairro
              })
            )
          );

        }

      } catch (error) {

        console.error(
          "Erro ao carregar todos os bairros:",
          error
        );

      }

    };


    loadInitialData();


    return () => {

      mounted = false;

    };

  }, [dispatch]);


  /*
   * =====================================================
   * SINCRONIZA DADOS DOS CARDS
   * =====================================================
   */

  useEffect(() => {

    if (!Array.isArray(realstate)) {
      return;
    }


    if (
      isMobile &&
      realstate.length > 0
    ) {

      setMobileSearchOpen(false);

    }

  }, [
    realstate,
    isMobile
  ]);


  /*
   * =====================================================
   * BAIRROS
   * =====================================================
   */

  const options = useMemo(() => {

    if (!imoveis?.length) {
      return [];
    }


    const bairros = new Map();


    for (
      const item of imoveis
    ) {

      if (
        typeof item?.Bairro !== "string"
      ) {

        continue;

      }


      const bairro =
        item.Bairro.trim();


      if (!bairro) {
        continue;
      }


      bairros.set(
        bairro.toLowerCase(),
        bairro
      );

    }


    return [
      ...bairros.values()
    ]
      .sort(
        (a, b) =>
          a.localeCompare(
            b,
            "pt-BR",
            {
              sensitivity: "base"
            }
          )
      )
      .map(
        (bairro) => ({
          label: bairro,
          id: bairro
        })
      );

  }, [imoveis]);


  /*
   * =====================================================
   * DESABILITA BOTÃO DIREITO
   * =====================================================
   */

  useEffect(() => {

    const handleContextMenu = (e) => {

      e.preventDefault();

    };


    document.body.addEventListener(
      "contextmenu",
      handleContextMenu
    );


    return () => {

      document.body.removeEventListener(
        "contextmenu",
        handleContextMenu
      );

    };

  }, []);


  /*
   * =====================================================
   * FILTROS ATUAIS
   * =====================================================
   */

  const currentFilters = useMemo(() => ({

    bairro:
      search?.label || "",

    categoria:
      category || "",

    min:
      Number(optionsValue?.min) || 0,

    max:
      Number(optionsValue?.max) || 0

  }), [
    search,
    category,
    optionsValue
  ]);


  /*
   * =====================================================
   * APLICA FILTROS
   * =====================================================
   */

  const handleClick = async () => {

    setLoading(true);


    setTimeout(async () => {

      try {

        const response =
          await api.getArticles(
            1,
            currentFilters
          );


        dispatch({
          type: types.RECEIVE_HOME,
          payload: response
        });


        if (
          response?.meta?.pagination
        ) {

          dispatch({
            type: types.RECEIVE_PAGINATION,
            payload:
              response.meta.pagination
          });

        }


        setHasFilters(true);


        if (
          currentFilters.bairro
        ) {

          localStorage.setItem(
            "neighborhood",
            currentFilters.bairro
          );

        } else {

          localStorage.removeItem(
            "neighborhood"
          );

        }


        if (
          window.innerWidth <= 1024
        ) {

          setMobileSearchOpen(false);

        }

      } catch (error) {

        console.error(
          "Erro ao aplicar filtros:",
          error
        );


        dispatch({
          type: types.RECEIVE_HOME,
          payload: {
            data: [],
            meta: {
              pagination: {
                page: 1,
                pageSize: 25,
                pageCount: 0,
                total: 0
              }
            }
          }
        });


        dispatch({
          type: types.RECEIVE_PAGINATION,
          payload: {
            page: 1,
            pageSize: 25,
            pageCount: 0,
            total: 0
          }
        });


        setHasFilters(true);

      } finally {

        setLoading(false);

      }

    }, 1);

  };


  /*
   * =====================================================
   * LIMPA LOCAL STORAGE AO FECHAR
   * =====================================================
   */

  useEffect(() => {

    const handleBeforeUnload = () => {

      localStorage.clear();

    };


    window.addEventListener(
      "beforeunload",
      handleBeforeUnload
    );


    return () => {

      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );

    };

  }, []);


  /*
   * =====================================================
   * CATEGORIA
   * =====================================================
   */

  const handleChangeCategory = (
    evento
  ) => {

    setCategory(
      evento.target.value
    );

  };


  /*
   * =====================================================
   * RESPONSIVIDADE
   * =====================================================
   */

  useEffect(() => {

    const handleResize = () => {

      setIsMobile(
        window.innerWidth <= 1024
      );

    };


    window.addEventListener(
      "resize",
      handleResize
    );


    return () => {

      window.removeEventListener(
        "resize",
        handleResize
      );

    };

  }, []);


  /*
   * =====================================================
   * LIMPA TODOS OS FILTROS
   * =====================================================
   */

  const resetFilters = async () => {

    setSearch({
      label: "",
      id: ""
    });


    setCategory("");


    setOptionsValue({
      min: 0,
      max: 0
    });


    setLoading(true);


    localStorage.removeItem(
      "neighborhood"
    );


    setTimeout(async () => {

      try {

        const response =
          await api.getArticles(
            1,
            {}
          );


        dispatch({
          type: types.RECEIVE_HOME,
          payload: response
        });


        if (
          response?.meta?.pagination
        ) {

          dispatch({
            type: types.RECEIVE_PAGINATION,
            payload:
              response.meta.pagination
          });

        }


        setHasFilters(false);


        if (
          window.innerWidth <= 1024
        ) {

          setMobileSearchOpen(false);

        }

      } catch (error) {

        console.error(
          "Erro ao limpar filtros:",
          error
        );

      } finally {

        setLoading(false);

      }

    }, 1);

  };


  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

  return (
    <React.Fragment>

      {!isMobile && (
        <TopInfo />
      )}

      <Header />


      <div
        className="row center home"
        style={{
          paddingTop: "10px",
          paddingBottom: "0"
        }}
      >

        <div
          className="content"
          style={{
            minHeight: "auto",
            display: "block"
          }}
        >

          <Box sx={{ flexGrow: 1 }}>


            {/* =====================================================
                MOBILE SEARCH
            ===================================================== */}

            {isMobile && (
              <>

                {mobileSearchOpen && (

                  <div
                    className="mobile-search-overlay"
                    onClick={() =>
                      setMobileSearchOpen(false)
                    }
                  />

                )}


                <div className="mobile-search-trigger">

                  <Button
                    fullWidth
                    className="mobile-search-button"
                    onClick={() =>
                      setMobileSearchOpen(true)
                    }
                  >

                    <SearchIcon />

                    Buscar Imóveis

                  </Button>

                </div>


                <div
                  className={`mobile-search-panel ${
                    mobileSearchOpen
                      ? "mobile-open"
                      : ""
                  }`}
                >

                  <div className="mobile-search-header">

                    <h2>
                      Buscar Imóveis
                    </h2>

                    <CloseIcon
                      className="mobile-search-close-icon"
                      onClick={() =>
                        setMobileSearchOpen(false)
                      }
                    />

                  </div>


                  <div className="mobile-search-content">


                    {/* BAIRRO */}

                    {imoveis?.length > 0 && (

                      <Box
                        className="wrap-input neighborhood-mobile"
                      >

                        <Autocomplete

                          disablePortal

                          options={options}

                          value={
                            options.find(
                              option =>
                                option.id ===
                                search?.id
                            ) || null
                          }

                          getOptionLabel={(option) =>
                            option?.label || ""
                          }

                          isOptionEqualToValue={(
                            option,
                            value
                          ) =>
                            option.id ===
                            value.id
                          }

                          onChange={(
                            event,
                            value
                          ) => {

                            setSearch(
                              value || {
                                label: "",
                                id: ""
                              }
                            );

                          }}

                          renderInput={(params) => (

                            <TextField
                              {...params}
                              label="Selecione o Bairro"
                              inputProps={{
                                ...params.inputProps,
                                readOnly: isMobile
                              }}
                            />

                          )}

                        />


                        <LocationPinIcon
                          className="LocationPinIcon mobile-location-icon"
                        />


                        <CloseIcon
                          className="search-clear mobile-search-clear"
                          onClick={resetFilters}
                        />

                      </Box>

                    )}


                    {/* VALOR MÍNIMO */}

                    <Box className="wrap-input">

                      <NumericFormat

                        value={optionsValue.min}

                        onValueChange={(values) => {

                          setOptionsValue({
                            ...optionsValue,
                            min: values.value
                          });

                        }}

                        customInput={TextField}

                        thousandSeparator="."

                        decimalSeparator=","

                        prefix="R$ "

                        fullWidth

                        label="Valor Mínimo"

                        variant="outlined"

                        inputProps={{
                          inputMode: "numeric",
                          pattern: "[0-9]*",
                          enterKeyHint: "done"
                        }}

                        onFocus={() => {

                          if (
                            optionsValue.min === 0
                          ) {

                            setOptionsValue({
                              ...optionsValue,
                              min: ""
                            });

                          }

                        }}

                        onBlur={() => {

                          if (
                            !optionsValue.min
                          ) {

                            setOptionsValue({
                              ...optionsValue,
                              min: 0
                            });

                          }

                        }}

                      />

                    </Box>


                    {/* VALOR MÁXIMO */}

                    <Box className="wrap-input">

                      <NumericFormat

                        value={optionsValue.max}

                        onValueChange={(values) => {

                          setOptionsValue({
                            ...optionsValue,
                            max: values.value
                          });

                        }}

                        customInput={TextField}

                        thousandSeparator="."

                        decimalSeparator=","

                        prefix="R$ "

                        fullWidth

                        label="Valor Máximo"

                        variant="outlined"

                        inputProps={{
                          inputMode: "numeric",
                          pattern: "[0-9]*",
                          enterKeyHint: "done"
                        }}

                        onFocus={() => {

                          if (
                            optionsValue.max === 0
                          ) {

                            setOptionsValue({
                              ...optionsValue,
                              max: ""
                            });

                          }

                        }}

                        onBlur={() => {

                          if (
                            !optionsValue.max
                          ) {

                            setOptionsValue({
                              ...optionsValue,
                              max: 0
                            });

                          }

                        }}

                      />

                    </Box>


                    {/* CATEGORIA */}

                    <TextField
                      select
                      fullWidth
                      label="Tipo de Anúncio"
                      value={category}
                      onChange={
                        handleChangeCategory
                      }
                      SelectProps={{
                        MenuProps: {
                          disableScrollLock: true
                        }
                      }}
                    >

                      <MenuItem value="">
                        Todos
                      </MenuItem>

                      <MenuItem value="venda">
                        Venda
                      </MenuItem>

                      <MenuItem value="aluguel">
                        Aluguel
                      </MenuItem>

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


            {/* =====================================================
                DESKTOP SEARCH
            ===================================================== */}

            {!isMobile && (

              <Grid
                className="wrap-search"
                container
              >

                {/* BAIRRO */}

                <Grid size={8}>

                  <Box className="wrap-input">

                    <label
                      style={{
                        fontFamily:
                          "quicksand-regular",
                        fontSize: "0.6rem",
                        color:
                          "rgba(0,0,0,.6)",
                        margin:
                          "-5px 0 6px 0",
                        display: "block"
                      }}
                    >
                      Selecione o Bairro
                    </label>


                    <Autocomplete

                      value={
                        search?.label || null
                      }

                      className="search-neighborhoods"

                      disablePortal

                      options={options}

                      getOptionLabel={(option) =>
                        typeof option === "string"
                          ? option
                          : option?.label || ""
                      }

                      isOptionEqualToValue={(
                        option,
                        value
                      ) => {

                        const optionId =
                          typeof option === "string"
                            ? option
                            : option?.id;

                        const valueId =
                          typeof value === "string"
                            ? value
                            : value?.id;

                        return (
                          optionId ===
                          valueId
                        );

                      }}

                      onChange={(
                        event,
                        value
                      ) => {

                        setSearch(
                          value || {
                            label: "",
                            id: ""
                          }
                        );

                      }}

                      renderInput={(params) => (

                        <TextField
                          {...params}
                          label="Selecione o Bairro"
                        />

                      )}

                    />


                    <LocationPinIcon
                      className="LocationPinIcon"
                    />


                    <CloseIcon
                      className="search-clear"
                      onClick={resetFilters}
                    />

                  </Box>

                </Grid>


                {/* VALORES */}

                <Grid
                  component="form"
                  sx={{
                    "& > :not(style)": {
                      width: "15ch"
                    }
                  }}
                  noValidate
                  autoComplete="off"
                  className="minMax"
                >

                  <Box className="wrap-input">

                    <MonetizationOnIcon
                      className="MonetizationOnIcon"
                    />

                    <NumericFormat

                      value={optionsValue.min}

                      onValueChange={(values) => {

                        setOptionsValue({
                          ...optionsValue,
                          min: values.value
                        });

                      }}

                      customInput={TextField}

                      thousandSeparator="."

                      decimalSeparator=","

                      prefix="R$ "

                      fullWidth

                      label="Valor Mínimo"

                      variant="outlined"

                      inputProps={{
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                        enterKeyHint: "done"
                      }}

                      onFocus={() => {

                        if (
                          optionsValue.min === 0
                        ) {

                          setOptionsValue({
                            ...optionsValue,
                            min: ""
                          });

                        }

                      }}

                      onBlur={() => {

                        if (
                          !optionsValue.min
                        ) {

                          setOptionsValue({
                            ...optionsValue,
                            min: 0
                          });

                        }

                      }}

                      isAllowed={(values) =>
                        values.value === "" ||
                        Number(values.value) >= 0
                      }

                    />

                  </Box>


                  <Box className="wrap-input">

                    <MonetizationOnIcon
                      className="MonetizationOnIcon"
                    />

                    <NumericFormat

                      value={optionsValue.max}

                      onValueChange={(values) => {

                        setOptionsValue({
                          ...optionsValue,
                          max: values.value
                        });

                      }}

                      customInput={TextField}

                      thousandSeparator="."

                      decimalSeparator=","

                      prefix="R$ "

                      fullWidth

                      label="Valor Máximo"

                      variant="outlined"

                      inputProps={{
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                        enterKeyHint: "done"
                      }}

                      onFocus={() => {

                        if (
                          optionsValue.max === 0
                        ) {

                          setOptionsValue({
                            ...optionsValue,
                            max: ""
                          });

                        }

                      }}

                      onBlur={() => {

                        if (
                          !optionsValue.max
                        ) {

                          setOptionsValue({
                            ...optionsValue,
                            max: 0
                          });

                        }

                      }}

                      isAllowed={(values) =>
                        values.value === "" ||
                        Number(values.value) >= 0
                      }

                    />

                  </Box>

                </Grid>


                {/* CATEGORIA */}

                <Grid
                  size={12}
                  className="minMax"
                >

                  <TextField
                    select
                    label="Tipo de Anúncio"
                    value={category}
                    onChange={
                      handleChangeCategory
                    }
                    style={{
                      minWidth: "100%"
                    }}
                    className="selectType"
                  >

                    <MenuItem value="">
                      Todos
                    </MenuItem>

                    <MenuItem value="venda">
                      Venda
                    </MenuItem>

                    <MenuItem value="aluguel">
                      Aluguel
                    </MenuItem>

                    <MenuItem value="Lançamentos">
                      Lançamentos
                    </MenuItem>

                  </TextField>

                </Grid>


                {/* BOTÃO */}

                <Grid size={4}>

                  <Button
                    className="search-button"
                    variant="contained"
                    style={{
                      width: "100%"
                    }}
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


      {/* =====================================================
          RESULTADOS
      ===================================================== */}

      {loading ? (

        <>

          <Root>

            <Divider className="divider">

              <Chip
                className="divider-chip"
                label="Imóveis à Venda"
                size="small"
              />

            </Divider>

          </Root>


          <Box
            id="preload"
            className="preload"
          >

            {Array.from({
              length: configPreload
            }).map((_, index) => (

              <PreloadCard
                key={`preload-${index}`}
              />

            ))}

          </Box>

        </>

      ) : data.length > 0 ? (

        <>

          {!isMobile && (

            <div
              className="row"
              style={{
                margin: "0"
              }}
            >

              <div
                className="center"
                style={{
                  position: "relative"
                }}
              >

                <span className="breadcrumb">

                  <span>
                    Imóveis
                  </span>

                  <span className="breadcrumb-separator">
                    ›
                  </span>


                  {hasFilters &&
                    category &&
                    category !== "todos" && (

                      <>

                        <span>

                          {category
                            .charAt(0)
                            .toUpperCase() +
                            category.slice(1)}

                        </span>

                        <span className="breadcrumb-separator">
                          ›
                        </span>

                      </>

                    )}


                  <span>

                    {!search?.label ? (
                      <strong>
                        São Paulo
                      </strong>
                    ) : (
                      "São Paulo"
                    )}

                  </span>


                  {hasFilters &&
                    search?.label && (

                      <>

                        <span className="breadcrumb-separator">
                          ›
                        </span>

                        <strong>
                          {search.label}
                        </strong>

                      </>

                    )}

                </span>


                <div className="found-properties">

                  <span>
                    Imóveis encontrados:{" "}
                  </span>

                  <strong>
                    {
                      pagination?.total ??
                      data.length
                    }
                  </strong>

                </div>

              </div>

            </div>

          )}


          {isMobile && (

            <div
              className="mobile-results-summary"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "10px 16px 12px",
                margin: "0",
                display: "block"
              }}
            >

              <div
                className="mobile-results-breadcrumb"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  display: "block",
                  margin: "0",
                  padding: "0",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  fontSize: "13px",
                  lineHeight: "20px",
                  color: "rgba(0,0,0,.52)"
                }}
              >

                <span>
                  Imóveis
                </span>


                <span
                  style={{
                    margin: "0 6px",
                    color: "rgba(36,122,200,.55)"
                  }}
                >
                  ›
                </span>


                {hasFilters &&
                  category &&
                  category !== "todos" && (

                    <>

                      <span>
                        {category
                          .charAt(0)
                          .toUpperCase() +
                          category.slice(1)}
                      </span>

                      <span
                        style={{
                          margin: "0 6px",
                          color: "rgba(36,122,200,.55)"
                        }}
                      >
                        ›
                      </span>

                    </>

                  )}


                <span
                  style={{
                    color: "#247ac8",
                    fontWeight: 600
                  }}
                >
                  São Paulo
                </span>


                {hasFilters &&
                  search?.label && (

                    <>

                      <span
                        style={{
                          margin: "0 6px",
                          color: "rgba(36,122,200,.55)"
                        }}
                      >
                        ›
                      </span>

                      <span
                        style={{
                          color: "#247ac8",
                          fontWeight: 600
                        }}
                      >
                        {search.label}
                      </span>

                    </>

                  )}

              </div>


              <div
                className="mobile-found-properties"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  display: "flex",
                  alignItems: "baseline",
                  margin: "4px 0 10px",
                  padding: "0",
                  fontSize: "13px",
                  lineHeight: "21px",
                  color: "rgba(0,0,0,.52)"
                }}
              >

                <span>
                  Imóveis encontrados:
                </span>

                <strong
                  style={{
                    marginLeft: "5px",
                    color: "#247ac8",
                    fontSize: "16px",
                    fontWeight: 700
                  }}
                >
                  {
                    pagination?.total ??
                    data.length
                  }
                </strong>

              </div>

            </div>

          )}


          <Card data={realEstate} />

        </>

      ) : null}


      {!loading &&
        hasFilters &&
        data.length <= 0 && (

          <Container className="empty-state">

            <div className="empty-state__illustration">

              <div className="empty-state__decor">

                <span>✦</span>

                <span>+</span>

                <span>✦</span>

              </div>

              <div className="empty-state__icon"></div>

            </div>


            <div className="empty-state__content">

              <div className="empty-state__tag">

                Ops, nada por aqui

              </div>


              <h2 className="empty-state__title">

                Não encontramos mais resultados.

              </h2>


              <p className="empty-state__description">

                Não encontramos mais imóveis
                com os filtros aplicados.
                Tente ampliar sua busca ou
                remover alguns filtros para
                visualizar mais oportunidades.

              </p>


              <button
                className="empty-state__button"
                onClick={resetFilters}
              >

                🧹 Limpar filtros

              </button>

            </div>

          </Container>

        )}


      {loading ? <Loading /> : ""}


      {!loading && (

        <Pagination
          pagination={pagination}
          filters={currentFilters}
        />

      )}


      <Footer />

    </React.Fragment>
  );
};


/*
 * =====================================================
 * REDUX
 * =====================================================
 */

const mapStateToProps = (state) => ({

  realstate:
    state.home.realestate?.data || [],

  pagination:
    state.home.pagination || {}

});


export default withRouter(
  connect(
    mapStateToProps
  )(Home)
);