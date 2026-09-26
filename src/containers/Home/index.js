import React, {
  useState,
  useEffect,
  useMemo,
  useRef
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


/*
 * =====================================================
 * CACHE DA HOME
 * =====================================================
 *
 * Fica fora do componente.
 *
 * Isso é importante porque useRef() é perdido quando
 * a Home é desmontada.
 *
 * Ao entrar em CharacterDetail e voltar para a Home,
 * estes valores continuam existindo enquanto a aplicação
 * estiver aberta.
 */
let homeInitialDataLoaded = false;


/*
 * Resposta da última carga válida da Home.
 */
let homeInitialDataCache = null;


/*
 * =====================================================
 * CACHE DOS BAIRROS
 * =====================================================
 *
 * Este é o ponto principal da correção.
 *
 * O getAllBairros() também faz requests paginados
 * no Strapi.
 *
 * Antes, ao voltar de CharacterDetail para Home,
 * a Home era remontada e executava novamente:
 *
 *     api.getAllBairros()
 *
 * mesmo quando os bairros já tinham sido carregados.
 *
 * Agora os bairros ficam armazenados fora do componente,
 * da mesma forma que os dados iniciais da Home.
 *
 * Portanto:
 *
 * HOME
 *   ↓
 * getAllBairros()
 *   ↓
 * bairros armazenados
 *   ↓
 * detalhe
 *   ↓
 * HOME novamente
 *   ↓
 * NÃO chama getAllBairros()
 */
let homeNeighborhoodCache = null;


/*
 * Indica se os bairros já foram carregados
 * com sucesso pelo menos uma vez.
 */
let homeNeighborhoodsLoaded = false;


/*
 * =====================================================
 * ESTILOS
 * =====================================================
 */

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


  /*
   * =====================================================
   * FORÇA LOADING PELA URL
   * =====================================================
   */

  const forceLoading =
    new URLSearchParams(
      window.location.search
    ).get("loading") === "true";


  /*
   * =====================================================
   * CONTROLE ATÔMICO DO LOADING
   * =====================================================
   *
   * initial = 40%
   * filter  = 40%
   * page    = 72%
   */

  const getInitialLoadingState = () => {

    if (forceLoading) {
      return {
        active: true,
        mode: "initial"
      };
    }

    if (
      !Array.isArray(realstate) ||
      realstate.length === 0
    ) {
      return {
        active: true,
        mode: "initial"
      };
    }

    return {
      active: false,
      mode: null
    };

  };


  const [
    loadingState,
    setLoadingState
  ] = useState(
    getInitialLoadingState
  );


  /*
   * Mantém o modo atual em ref para que operações
   * assíncronas não utilizem um valor antigo.
   */

  const loadingModeRef =
    useRef(
      getInitialLoadingState().mode
    );


  /*
   * =====================================================
   * CONTROLE DO CARREGAMENTO INICIAL
   * =====================================================
   *
   * Este ref controla apenas a montagem atual.
   *
   * O controle definitivo de "já carregou a Home"
   * fica no cache externo.
   */

  const initialLoadStartedRef =
    useRef(false);


  /*
   * Indica operação de filtro em andamento.
   */

  const filterLoadingRef =
    useRef(false);


  /*
   * =====================================================
   * FUNÇÕES CENTRAIS DO LOADING
   * =====================================================
   */

  const startLoading = (mode) => {

    loadingModeRef.current =
      mode;

    setLoadingState({
      active: true,
      mode
    });

  };


  const finishLoading = () => {

    loadingModeRef.current =
      null;

    setLoadingState({
      active: false,
      mode: null
    });

  };


  const isLoading =
    loadingState.active ||
    forceLoading;


  /*
   * =====================================================
   * OUTROS ESTADOS
   * =====================================================
   */

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
   * SCROLL AUTOMÁTICO DA PAGINAÇÃO
   * =====================================================
   */

  useEffect(() => {

    if (
      pagination?.page == null
    ) {

      return;

    }


    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto"
    });

  }, [
    pagination?.page
  ]);


  /*
   * =====================================================
   * CARREGAMENTO INICIAL
   * =====================================================
   *
   * Existem três situações:
   *
   * 1. Primeira entrada na Home:
   *    - busca imóveis;
   *    - busca bairros.
   *
   * 2. Home remontada com imóveis já no Redux:
   *    - NÃO busca imóveis;
   *    - NÃO busca bairros novamente;
   *    - usa o cache dos bairros.
   *
   * 3. Home remontada momentaneamente sem imóveis:
   *    - restaura os dados do cache;
   *    - restaura os bairros do cache;
   *    - NÃO faz novo request.
   */

  useEffect(() => {

    let mounted = true;


    /*
     * Se esta montagem já iniciou o carregamento,
     * não inicia novamente.
     */

    if (
      initialLoadStartedRef.current
    ) {

      return () => {

        mounted = false;

      };

    }


    initialLoadStartedRef.current =
      true;


    /*
     * =================================================
     * FUNÇÃO AUXILIAR PARA RESTAURAR BAIRROS
     * =================================================
     *
     * Não faz request.
     *
     * Apenas coloca no estado local os bairros
     * que já foram carregados anteriormente.
     */

    const restoreNeighborhoods = () => {

      if (
        !Array.isArray(
          homeNeighborhoodCache
        )
      ) {

        return false;

      }


      if (!mounted) {

        return false;

      }


      setImoveis(
        homeNeighborhoodCache.map(
          (bairro) => ({
            Bairro: bairro
          })
        )
      );


      return true;

    };


    /*
     * =================================================
     * FUNÇÃO PARA BUSCAR BAIRROS
     * =================================================
     *
     * Só executa getAllBairros() se ainda não existir
     * um cache válido.
     */

    const loadNeighborhoods =
      async () => {

        /*
         * Se já temos os bairros no cache,
         * simplesmente restauramos.
         */
        if (
          homeNeighborhoodsLoaded &&
          Array.isArray(
            homeNeighborhoodCache
          )
        ) {

          restoreNeighborhoods();

          return;

        }


        /*
         * Primeira carga dos bairros.
         */
        try {

          const bairros =
            await api.getAllBairros();


          if (
            Array.isArray(bairros)
          ) {

            /*
             * Guarda o resultado fora do componente.
             *
             * Isso impede novas chamadas de
             * getAllBairros() quando a Home for
             * desmontada e montada novamente.
             */
            homeNeighborhoodCache =
              [
                ...bairros
              ];

            homeNeighborhoodsLoaded =
              true;


            if (mounted) {

              setImoveis(
                bairros.map(
                  (bairro) => ({
                    Bairro: bairro
                  })
                )
              );

            }

          }

        } catch (error) {

          console.error(
            "Erro ao carregar bairros:",
            error
          );

        }

      };


    const loadInitialData =
      async () => {

      /*
       * =================================================
       * CASO 1
       * =================================================
       *
       * O Redux já possui os imóveis.
       *
       * Este é o cenário normal ao voltar do detalhe.
       *
       * NÃO fazemos getArticles().
       */

      if (
        Array.isArray(realstate) &&
        realstate.length > 0
      ) {

        /*
         * Marca a Home como carregada.
         */
        homeInitialDataLoaded =
          true;


        /*
         * Guarda os dados atuais caso ainda
         * não exista cache.
         */
        if (
          !homeInitialDataCache
        ) {

          homeInitialDataCache = {
            data: [
              ...realstate
            ],

            meta: {
              pagination
            }
          };

        }


        /*
         * =================================================
         * IMPORTANTE
         * =================================================
         *
         * Se os bairros já foram carregados anteriormente,
         * apenas restaura o cache.
         *
         * NÃO chama getAllBairros().
         */
        if (
          homeNeighborhoodsLoaded &&
          Array.isArray(
            homeNeighborhoodCache
          )
        ) {

          restoreNeighborhoods();

        } else {

          /*
           * Primeira carga dos bairros.
           */
          await loadNeighborhoods();

        }


        if (
          mounted &&
          loadingModeRef.current ===
            "initial"
        ) {

          finishLoading();

        }

        return;

      }


      /*
       * =================================================
       * CASO 2
       * =================================================
       *
       * A Home já foi carregada anteriormente,
       * mas durante a remontagem o Redux ainda está
       * momentaneamente sem os dados.
       *
       * NÃO fazemos novo request.
       *
       * Restauramos os dados e os bairros do cache.
       */

      if (
        homeInitialDataLoaded &&
        homeInitialDataCache
      ) {

        dispatch({
          type:
            types.RECEIVE_HOME,

          payload:
            homeInitialDataCache
        });


        if (
          homeInitialDataCache
            ?.meta
            ?.pagination
        ) {

          dispatch({
            type:
              types.RECEIVE_PAGINATION,

            payload:
              homeInitialDataCache
                .meta
                .pagination
          });

        }


        /*
         * =================================================
         * IMPORTANTE
         * =================================================
         *
         * Não chamamos getAllBairros() aqui.
         *
         * Se já houver cache, restauramos diretamente.
         */
        if (
          homeNeighborhoodsLoaded &&
          Array.isArray(
            homeNeighborhoodCache
          )
        ) {

          restoreNeighborhoods();

        } else {

          /*
           * Esta situação só ocorre se a primeira
           * carga ainda não conseguiu carregar os bairros.
           */
          await loadNeighborhoods();

        }


        if (
          mounted &&
          loadingModeRef.current ===
            "initial"
        ) {

          finishLoading();

        }

        return;

      }


      /*
       * =================================================
       * CASO 3
       * =================================================
       *
       * Primeiro acesso real à Home.
       *
       * Aqui sim fazemos os requests iniciais.
       */

      startLoading("initial");


      const articlesPromise =
        dispatch(
          getArticles()
        );


      /*
       * A busca de bairros acontece somente
       * na primeira carga.
       */
      const bairrosPromise =
        loadNeighborhoods();


      try {

        const response =
          await articlesPromise;


        /*
         * Marca a Home como carregada somente
         * depois que o request terminou com sucesso.
         */
        if (
          response
        ) {

          homeInitialDataLoaded =
            true;


          homeInitialDataCache =
            response;

        }

      } catch (error) {

        console.error(
          "Erro ao carregar imóveis:",
          error
        );

      } finally {

        if (
          mounted &&
          loadingModeRef.current ===
            "initial"
        ) {

          finishLoading();

        }

      }


      try {

        await bairrosPromise;

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

  }, [
    dispatch,
    realstate,
    pagination
  ]);


  /*
   * =====================================================
   * SINCRONIZA DADOS DOS CARDS
   * =====================================================
   */

  useEffect(() => {

    if (
      !Array.isArray(realstate)
    ) {

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

    if (
      !imoveis?.length
    ) {

      return [];

    }


    const bairros =
      new Map();


    for (
      const item of imoveis
    ) {

      if (
        typeof item?.Bairro !==
        "string"
      ) {

        continue;

      }


      const bairro =
        item.Bairro.trim();


      if (
        !bairro
      ) {

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
              sensitivity:
                "base"
            }
          )
      )
      .map(
        (bairro) => ({
          label: bairro,
          id: bairro
        })
      );

  }, [
    imoveis
  ]);


  /*
   * =====================================================
   * DESABILITA BOTÃO DIREITO
   * =====================================================
   */

  useEffect(() => {

    const handleContextMenu =
      (e) => {

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

  const currentFilters =
    useMemo(
      () => ({

        bairro:
          search?.label || "",

        categoria:
          category || "",

        min:
          Number(
            optionsValue?.min
          ) || 0,

        max:
          Number(
            optionsValue?.max
          ) || 0

      }),
      [
        search,
        category,
        optionsValue
      ]
    );


  /*
   * =====================================================
   * APLICA FILTROS
   * =====================================================
   */

  const handleClick = async () => {

    filterLoadingRef.current =
      true;


    startLoading("filter");


    await new Promise(
      (resolve) =>
        requestAnimationFrame(
          resolve
        )
    );


    try {

      const response =
        await api.getArticles(
          1,
          currentFilters
        );


      dispatch({
        type:
          types.RECEIVE_HOME,

        payload:
          response
      });


      if (
        response?.meta?.pagination
      ) {

        dispatch({
          type:
            types.RECEIVE_PAGINATION,

          payload:
            response.meta.pagination
        });

      }


      /*
       * Atualiza também o cache da Home.
       *
       * Isso permite retornar do detalhe sem
       * perder o resultado filtrado.
       */
      homeInitialDataLoaded =
        true;

      homeInitialDataCache =
        response;


      setHasFilters(
        true
      );


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

        setMobileSearchOpen(
          false
        );

      }

    } catch (error) {

      console.error(
        "Erro ao aplicar filtros:",
        error
      );


      dispatch({
        type:
          types.RECEIVE_HOME,

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
        type:
          types.RECEIVE_PAGINATION,

        payload: {
          page: 1,
          pageSize: 25,
          pageCount: 0,
          total: 0
        }
      });


      setHasFilters(
        true
      );

    } finally {

      filterLoadingRef.current =
        false;


      if (
        loadingModeRef.current ===
        "filter"
      ) {

        finishLoading();

      }

    }

  };


  /*
   * =====================================================
   * PAGINAÇÃO
   * =====================================================
   */

  const handlePageChangeStart = () => {

    startLoading("page");

  };


  const handlePageChangeEnd = () => {

    if (
      loadingModeRef.current ===
      "page"
    ) {

      finishLoading();

    }

  };


  /*
   * =====================================================
   * LIMPA LOCAL STORAGE AO FECHAR
   * =====================================================
   */

  useEffect(() => {

    const handleBeforeUnload =
      () => {

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

  const handleChangeCategory =
    (evento) => {

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

    const handleResize =
      () => {

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

  const resetFilters =
    async () => {

      setSearch({
        label: "",
        id: ""
      });


      setCategory("");


      setOptionsValue({
        min: 0,
        max: 0
      });


      filterLoadingRef.current =
        true;


      startLoading("filter");


      localStorage.removeItem(
        "neighborhood"
      );


      await new Promise(
        (resolve) =>
          requestAnimationFrame(
            resolve
          )
      );


      try {

        const response =
          await api.getArticles(
            1,
            {}
          );


        dispatch({
          type:
            types.RECEIVE_HOME,

          payload:
            response
        });


        if (
          response?.meta?.pagination
        ) {

          dispatch({
            type:
              types.RECEIVE_PAGINATION,

            payload:
              response.meta.pagination
          });

        }


        /*
         * Atualiza o cache com a Home sem filtros.
         */
        homeInitialDataLoaded =
          true;

        homeInitialDataCache =
          response;


        setHasFilters(
          false
        );


        if (
          window.innerWidth <= 1024
        ) {

          setMobileSearchOpen(
            false
          );

        }

      } catch (error) {

        console.error(
          "Erro ao limpar filtros:",
          error
        );

      } finally {

        filterLoadingRef.current =
          false;


        if (
          loadingModeRef.current ===
          "filter"
        ) {

          finishLoading();

        }

      }

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
                      setMobileSearchOpen(
                        false
                      )
                    }
                  />

                )}


                <div
                  className="mobile-search-trigger"
                >

                  <Button
                    fullWidth
                    className="mobile-search-button"
                    onClick={() =>
                      setMobileSearchOpen(
                        true
                      )
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

                  <div
                    className="mobile-search-header"
                  >

                    <h2>
                      Buscar Imóveis
                    </h2>


                    <CloseIcon
                      className="mobile-search-close-icon"
                      onClick={() =>
                        setMobileSearchOpen(
                          false
                        )
                      }
                    />

                  </div>


                  <div
                    className="mobile-search-content"
                  >

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
                          getOptionLabel={
                            (option) =>
                              option?.label ||
                              ""
                          }
                          isOptionEqualToValue={
                            (
                              option,
                              value
                            ) =>
                              option.id ===
                              value.id
                          }
                          onChange={
                            (
                              event,
                              value
                            ) => {

                              setSearch(
                                value || {
                                  label: "",
                                  id: ""
                                }
                              );

                            }
                          }
                          renderInput={
                            (params) => (

                              <TextField
                                {...params}
                                label="Selecione o Bairro"
                                inputProps={{
                                  ...params.inputProps,
                                  readOnly:
                                    isMobile
                                }}
                              />

                            )
                          }
                        />


                        <LocationPinIcon
                          className="LocationPinIcon mobile-location-icon"
                        />


                        <CloseIcon
                          className="search-clear mobile-search-clear"
                          onClick={
                            resetFilters
                          }
                        />

                      </Box>

                    )}


                    <Box
                      className="wrap-input"
                    >

                      <NumericFormat
                        value={
                          optionsValue.min
                        }
                        onValueChange={
                          (values) => {

                            setOptionsValue({
                              ...optionsValue,
                              min:
                                values.value
                            });

                          }
                        }
                        customInput={
                          TextField
                        }
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix="R$ "
                        fullWidth
                        label="Valor Mínimo"
                        variant="outlined"
                        inputProps={{
                          inputMode:
                            "numeric",
                          pattern:
                            "[0-9]*",
                          enterKeyHint:
                            "done"
                        }}
                        onFocus={() => {

                          if (
                            optionsValue.min ===
                            0
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


                    <Box
                      className="wrap-input"
                    >

                      <NumericFormat
                        value={
                          optionsValue.max
                        }
                        onValueChange={
                          (values) => {

                            setOptionsValue({
                              ...optionsValue,
                              max:
                                values.value
                            });

                          }
                        }
                        customInput={
                          TextField
                        }
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix="R$ "
                        fullWidth
                        label="Valor Máximo"
                        variant="outlined"
                        inputProps={{
                          inputMode:
                            "numeric",
                          pattern:
                            "[0-9]*",
                          enterKeyHint:
                            "done"
                        }}
                        onFocus={() => {

                          if (
                            optionsValue.max ===
                            0
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
                          disableScrollLock:
                            true
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
                      onClick={
                        handleClick
                      }
                    >

                      Buscar Imóveis

                      <SearchIcon />

                    </Button>


                    <Button
                      className="clear-filters-button"
                      variant="outlined"
                      onClick={
                        resetFilters
                      }
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

                <Grid size={8}>

                  <Box
                    className="wrap-input"
                  >

                    <label
                      style={{
                        fontFamily:
                          "quicksand-regular",
                        fontSize:
                          "0.6rem",
                        color:
                          "rgba(0,0,0,.6)",
                        margin:
                          "-5px 0 6px 0",
                        display:
                          "block"
                      }}
                    >
                      Selecione o Bairro
                    </label>


                    <Autocomplete
                      value={
                        search?.label ||
                        null
                      }
                      className="search-neighborhoods"
                      disablePortal
                      options={options}
                      getOptionLabel={
                        (option) =>
                          typeof option ===
                          "string"
                            ? option
                            : option?.label ||
                              ""
                      }
                      isOptionEqualToValue={
                        (
                          option,
                          value
                        ) => {

                          const optionId =
                            typeof option ===
                            "string"
                              ? option
                              : option?.id;

                          const valueId =
                            typeof value ===
                            "string"
                              ? value
                              : value?.id;

                          return (
                            optionId ===
                            valueId
                          );

                        }
                      }
                      onChange={
                        (
                          event,
                          value
                        ) => {

                          setSearch(
                            value || {
                              label: "",
                              id: ""
                            }
                          );

                        }
                      }
                      renderInput={
                        (params) => (

                          <TextField
                            {...params}
                            label="Selecione o Bairro"
                          />

                        )
                      }
                    />


                    <LocationPinIcon
                      className="LocationPinIcon"
                    />


                    <CloseIcon
                      className="search-clear"
                      onClick={
                        resetFilters
                      }
                    />

                  </Box>

                </Grid>


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

                  <Box
                    className="wrap-input"
                  >

                    <MonetizationOnIcon
                      className="MonetizationOnIcon"
                    />


                    <NumericFormat
                      value={
                        optionsValue.min
                      }
                      onValueChange={
                        (values) => {

                          setOptionsValue({
                            ...optionsValue,
                            min:
                              values.value
                          });

                        }
                      }
                      customInput={
                        TextField
                      }
                      thousandSeparator="."
                      decimalSeparator=","
                      prefix="R$ "
                      fullWidth
                      label="Valor Mínimo"
                      variant="outlined"
                      inputProps={{
                        inputMode:
                          "numeric",
                        pattern:
                          "[0-9]*",
                        enterKeyHint:
                          "done"
                      }}
                      onFocus={() => {

                        if (
                          optionsValue.min ===
                          0
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
                      isAllowed={
                        (values) =>
                          values.value ===
                            "" ||
                          Number(
                            values.value
                          ) >= 0
                      }
                    />

                  </Box>


                  <Box
                    className="wrap-input"
                  >

                    <MonetizationOnIcon
                      className="MonetizationOnIcon"
                    />


                    <NumericFormat
                      value={
                        optionsValue.max
                      }
                      onValueChange={
                        (values) => {

                          setOptionsValue({
                            ...optionsValue,
                            max:
                              values.value
                          });

                        }
                      }
                      customInput={
                        TextField
                      }
                      thousandSeparator="."
                      decimalSeparator=","
                      prefix="R$ "
                      fullWidth
                      label="Valor Máximo"
                      variant="outlined"
                      inputProps={{
                        inputMode:
                          "numeric",
                        pattern:
                          "[0-9]*",
                        enterKeyHint:
                          "done"
                      }}
                      onFocus={() => {

                        if (
                          optionsValue.max ===
                          0
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
                      isAllowed={
                        (values) =>
                          values.value ===
                            "" ||
                          Number(
                            values.value
                          ) >= 0
                      }
                    />

                  </Box>

                </Grid>


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
                      minWidth:
                        "100%"
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


                <Grid size={4}>

                  <Button
                    className="search-button"
                    variant="contained"
                    style={{
                      width: "100%"
                    }}
                    onClick={
                      handleClick
                    }
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

      {isLoading ? (

        <>

          <Root>

            <Divider
              className="divider"
            >

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
              length:
                configPreload
            }).map(
              (_, index) => (

                <PreloadCard
                  key={`preload-${index}`}
                />

              )
            )}

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
                  position:
                    "relative"
                }}
              >

                <span
                  className="breadcrumb"
                >

                  <span>
                    Imóveis
                  </span>


                  <span
                    className="breadcrumb-separator"
                  >
                    ›
                  </span>


                  {hasFilters &&
                    category &&
                    category !==
                      "todos" && (

                      <>

                        <span>

                          {category
                            .charAt(0)
                            .toUpperCase() +
                            category.slice(1)}

                        </span>


                        <span
                          className="breadcrumb-separator"
                        >
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

                        <span
                          className="breadcrumb-separator"
                        >
                          ›
                        </span>


                        <strong>
                          {search.label}
                        </strong>

                      </>

                    )}

                </span>


                <div
                  className="found-properties"
                >

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
                width:
                  "100%",
                boxSizing:
                  "border-box",
                padding:
                  "10px 16px 12px",
                margin:
                  "0",
                display:
                  "block"
              }}
            >

              <div
                className="mobile-results-breadcrumb"
                style={{
                  width:
                    "100%",
                  boxSizing:
                    "border-box",
                  display:
                    "block",
                  margin:
                    "0",
                  padding:
                    "0",
                  overflow:
                    "hidden",
                  whiteSpace:
                    "nowrap",
                  textOverflow:
                    "ellipsis",
                  fontSize:
                    "13px",
                  lineHeight:
                    "20px",
                  color:
                    "rgba(0,0,0,.52)"
                }}
              >

                <span>
                  Imóveis
                </span>


                <span
                  style={{
                    margin:
                      "0 6px",
                    color:
                      "rgba(36,122,200,.55)"
                  }}
                >
                  ›
                </span>


                {hasFilters &&
                  category &&
                  category !==
                    "todos" && (

                    <>

                      <span>
                        {category
                          .charAt(0)
                          .toUpperCase() +
                          category.slice(1)}
                      </span>


                      <span
                        style={{
                          margin:
                            "0 6px",
                          color:
                            "rgba(36,122,200,.55)"
                        }}
                      >
                        ›
                      </span>

                    </>

                  )}


                <span
                  style={{
                    color:
                      "#247ac8",
                    fontWeight:
                      600
                  }}
                >
                  São Paulo
                </span>


                {hasFilters &&
                  search?.label && (

                    <>

                      <span
                        style={{
                          margin:
                            "0 6px",
                          color:
                            "rgba(36,122,200,.55)"
                        }}
                      >
                        ›
                      </span>


                      <span
                        style={{
                          color:
                            "#247ac8",
                          fontWeight:
                            600
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
                  width:
                    "100%",
                  boxSizing:
                    "border-box",
                  display:
                    "flex",
                  alignItems:
                    "baseline",
                  margin:
                    "4px 0 10px",
                  padding:
                    "0",
                  fontSize:
                    "13px",
                  lineHeight:
                    "21px",
                  color:
                    "rgba(0,0,0,.52)"
                }}
              >

                <span>
                  Imóveis encontrados:
                </span>


                <strong
                  style={{
                    marginLeft:
                      "5px",
                    color:
                      "#247ac8",
                    fontSize:
                      "16px",
                    fontWeight:
                      700
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


          <Card
            data={realEstate}
            hasFilters={hasFilters}
          />

        </>

      ) : null}


      {!isLoading &&
        hasFilters &&
        data.length <= 0 && (

          <Container
            className="empty-state"
          >

            <div
              className="empty-state__illustration"
            >

              <div
                className="empty-state__decor"
              >

                <span>
                  ✦
                </span>

                <span>
                  +
                </span>

                <span>
                  ✦
                </span>

              </div>


              <div
                className="empty-state__icon"
              />

            </div>


            <div
              className="empty-state__content"
            >

              <div
                className="empty-state__tag"
              >

                Ops, nada por aqui

              </div>


              <h2
                className="empty-state__title"
              >

                Não encontramos mais
                resultados.

              </h2>


              <p
                className="empty-state__description"
              >

                Não encontramos mais imóveis
                com os filtros aplicados.
                Tente ampliar sua busca ou
                remover alguns filtros para
                visualizar mais oportunidades.

              </p>


              <button
                className="empty-state__button"
                onClick={
                  resetFilters
                }
              >

                🧹 Limpar filtros

              </button>

            </div>

          </Container>

        )}


      {/* =====================================================
          LOADING OVERLAY
      ===================================================== */}

      {isLoading ? (

        <Loading
          isPageChange={
            loadingState.mode ===
            "page"
          }
        />

      ) : null}


      {/* =====================================================
          PAGINAÇÃO
      ===================================================== */}

      {!isLoading && (

        <Pagination
          pagination={
            pagination
          }
          filters={
            currentFilters
          }
          onPageChangeStart={
            handlePageChangeStart
          }
          onPageChangeEnd={
            handlePageChangeEnd
          }
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

const mapStateToProps =
  (state) => ({

    realstate:
      state.home.realestate?.data ||
      [],

    pagination:
      state.home.pagination ||
      {}

  });


export default withRouter(
  connect(
    mapStateToProps
  )(Home)
);