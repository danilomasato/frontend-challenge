import React, { useState, useEffect, useRef } from "react";

import { withRouter, useHistory } from "react-router-dom";
import { connect } from "react-redux";

import { Container } from "../../components";
import CardDetail from "../../components/CardDetail";

import Stack from "@mui/material/Stack";

import { Header } from "../../components/Header";
import { TopInfo } from "../../components/TopInfo";
import { Footer } from "../../components/Footer";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { bindActionCreators } from "redux";

import {
  getAuthors,
  getImoveisCache,
  getCharacterData,
  getArticles
} from "../../actions";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import {
  Button,
  CardActionArea,
  CardActions
} from "@mui/material";

import SellIcon from "@mui/icons-material/Sell";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import Box from "@mui/material/Box";

import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

import "./DetailImovel.css";

import ThumbSLider from "../../components/ThumbSlider";

import LocationPinIcon from "@mui/icons-material/LocationOn";
import LocationCityIcon from "@mui/icons-material/LocationCity";

import axios from "axios";

import Loading from "../../components/Loading";
import PreloadImovelDetail from "../../components/PreloadImovelDetail";
import PreloadImovelDetailMobile from "../../components/PreloadImovelDetail/Mobile";


const DETAIL_CACHE_KEY =
  "tsa_imovel_detail_cache";

const detailMemoryCache =
  new Map();


function normalizeIdentifier(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  return String(value).trim();
}


function getParameterByName(
  name,
  url = window.location.href
) {
  name = name.replace(
    /[\[\]]/g,
    "\\$&"
  );

  const regex = new RegExp(
    "[?&]" +
      name +
      "(=([^&#]*)|&|#|$)"
  );

  const results = regex.exec(url);

  if (!results) {
    return null;
  }

  if (!results[2]) {
    return "";
  }

  return decodeURIComponent(
    results[2].replace(/\+/g, " ")
  );
}


function getPersistentDetailCache() {
  try {
    const stored =
      localStorage.getItem(
        DETAIL_CACHE_KEY
      );

    if (!stored) {
      return {};
    }

    const parsed =
      JSON.parse(stored);

    if (
      !parsed ||
      typeof parsed !== "object" ||
      Array.isArray(parsed)
    ) {
      return {};
    }

    return parsed;
  } catch (error) {
    console.warn(
      "Não foi possível ler o cache dos imóveis:",
      error
    );

    return {};
  }
}


function savePersistentDetailCache(
  cache
) {
  try {
    localStorage.setItem(
      DETAIL_CACHE_KEY,
      JSON.stringify(cache)
    );
  } catch (error) {
    console.warn(
      "Não foi possível salvar o cache dos imóveis:",
      error
    );
  }
}


function getDetailIdentifiers(data) {
  if (!data) {
    return [];
  }

  const identifiers = [
    data.id,
    data.documentId
  ]
    .map(normalizeIdentifier)
    .filter(Boolean);

  return [
    ...new Set(identifiers)
  ];
}


function cacheDetail(
  data,
  extraIdentifiers = []
) {
  if (
    !data ||
    typeof data !== "object"
  ) {
    return;
  }

  const identifiers = [
    ...getDetailIdentifiers(data),
    ...extraIdentifiers
      .map(normalizeIdentifier)
      .filter(Boolean)
  ];

  const uniqueIdentifiers = [
    ...new Set(identifiers)
  ];

  if (
    !uniqueIdentifiers.length
  ) {
    return;
  }

  uniqueIdentifiers.forEach(
    (identifier) => {
      detailMemoryCache.set(
        identifier,
        data
      );
    }
  );

  const persistentCache =
    getPersistentDetailCache();

  uniqueIdentifiers.forEach(
    (identifier) => {
      persistentCache[
        identifier
      ] = data;
    }
  );

  savePersistentDetailCache(
    persistentCache
  );
}


function getCachedDetail(
  identifiers = []
) {
  const normalizedIdentifiers =
    identifiers
      .map(normalizeIdentifier)
      .filter(Boolean);

  if (
    !normalizedIdentifiers.length
  ) {
    return null;
  }

  for (
    const identifier of normalizedIdentifiers
  ) {
    if (
      detailMemoryCache.has(
        identifier
      )
    ) {
      return detailMemoryCache.get(
        identifier
      );
    }
  }

  const persistentCache =
    getPersistentDetailCache();

  for (
    const identifier of normalizedIdentifiers
  ) {
    if (
      persistentCache[
        identifier
      ]
    ) {
      const cachedData =
        persistentCache[
          identifier
        ];

      cacheDetail(
        cachedData,
        normalizedIdentifiers
      );

      return cachedData;
    }
  }

  return null;
}


function getPropertyIdentifiers(
  data
) {
  return [
    data?.id,
    data?.documentId
  ]
    .map(normalizeIdentifier)
    .filter(Boolean);
}


function propertyMatchesIdentifiers(
  data,
  identifiers
) {
  if (
    !data ||
    typeof data !== "object"
  ) {
    return false;
  }

  const propertyIdentifiers =
    getPropertyIdentifiers(
      data
    );

  const normalizedIdentifiers =
    identifiers
      .map(normalizeIdentifier)
      .filter(Boolean);

  return propertyIdentifiers.some(
    (identifier) =>
      normalizedIdentifiers.includes(
        identifier
      )
  );
}


const CharacterDetail = ({
  realestate,
  location
}) => {
  const history = useHistory();

  const contentRef =
    useRef(null);

  const pathname =
    location?.pathname ||
    window.location.pathname;

  const search =
    location?.search ||
    window.location.search;

  const pathId =
    pathname.match(
      /^\/imovel\/(\d+)/
    )?.[1] || null;

  const paramID =
    getParameterByName(
      "dcID",
      `${window.location.origin}${search}`
    );

  const detailIdentifiers = [
    paramID,
    pathId
  ]
    .map(normalizeIdentifier)
    .filter(Boolean);

  const initialCachedDetail =
    getCachedDetail(
      detailIdentifiers
    );

  const [
    loading,
    setLoading
  ] = useState(
    !initialCachedDetail
  );

  const [
    imoveis,
    setImoveis
  ] = useState(
    initialCachedDetail ||
      undefined
  );

  const [
    isMobile,
    setIsMobile
  ] = useState(
    window.innerWidth <= 1024
  );

  const [
    openToggle,
    setOpenToggle
  ] = useState(false);

  const [
    showToggle,
    setShowToggle
  ] = useState(false);

  const [
    open,
    setOpen
  ] = React.useState(false);

  let rows = [];


  /*
   * Sempre que entrar em um imóvel
   * ou trocar de imóvel, volta para o topo.
   */
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto"
    });
  }, [pathname]);


  /*
   * Atualiza o estado mobile
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
   * Carrega o imóvel pelo cache ou pela API.
   *
   * A primeira visita não possui cache e,
   * portanto, mantém o preload.
   *
   * Depois que o imóvel é carregado, ele fica
   * armazenado em memória e localStorage.
   */
  useEffect(() => {
    let cancelled = false;

    const identifiers =
      [
        paramID,
        pathId
      ]
        .map(normalizeIdentifier)
        .filter(Boolean);

    if (!identifiers.length) {
      return undefined;
    }

    const cachedDetail =
      getCachedDetail(
        identifiers
      );

    if (cachedDetail) {
      setImoveis(
        cachedDetail
      );

      setLoading(false);

      return undefined;
    }

    /*
     * Se o Redux já possui exatamente o imóvel
     * solicitado, utilizamos os dados dele.
     *
     * Nunca utilizamos um imóvel diferente apenas
     * porque existe algo em state.character.realestate.
     */
    if (
      propertyMatchesIdentifiers(
        realestate,
        identifiers
      )
    ) {
      cacheDetail(
        realestate,
        identifiers
      );

      setImoveis(
        realestate
      );

      /*
       * Mantém o comportamento original da primeira
       * entrada: o preload aparece por um pequeno
       * período antes de liberar o conteúdo.
       */
      const timer =
        setTimeout(() => {
          if (!cancelled) {
            setLoading(false);
          }
        }, 200);

      return () => {
        cancelled = true;
        clearTimeout(timer);
      };
    }

    /*
     * Sem cache e sem dados correspondentes no Redux:
     * primeira abertura do imóvel.
     */
    setLoading(true);

    /*
     * Busca por documentId quando existe dcID.
     */
    if (
      paramID !== null &&
      paramID !== ""
    ) {
      axios
        .get(
          `https://sublime-bat-ad2fca1255.strapiapp.com/api/Anuncios/${paramID}?status=published&populate[0]=Fotos`
        )
        .then((response) => {
          if (cancelled) {
            return;
          }

          const data =
            response?.data?.data;

          if (!data) {
            return;
          }

          cacheDetail(
            data,
            identifiers
          );

          setImoveis(data);
          setLoading(false);
        })
        .catch((error) => {
          if (cancelled) {
            return;
          }

          console.log(
            "An error occurred:",
            error.response
          );
        });

      return () => {
        cancelled = true;
      };
    }

    /*
     * Busca por ID numérico quando a URL é:
     * /imovel/221/...
     */
    if (pathId) {
      axios
        .get(
          `https://sublime-bat-ad2fca1255.strapiapp.com/api/Anuncios/?filters[id][$eq]=${pathId}&populate=*`
        )
        .then((response) => {
          if (cancelled) {
            return;
          }

          const data =
            response?.data?.data?.[0];

          if (!data) {
            return;
          }

          cacheDetail(
            data,
            identifiers
          );

          setImoveis(data);
          setLoading(false);
        })
        .catch((error) => {
          if (cancelled) {
            return;
          }

          console.log(
            "An error occurred:",
            error.response
          );
        });
    }

    return () => {
      cancelled = true;
    };
  }, [
    pathname,
    search,
    paramID,
    pathId,
    realestate
  ]);


  /*
   * Desabilita botão direito
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
   * Cria linhas da tabela
   */
  function createData(
    name,
    info
  ) {
    return {
      name,
      info
    };
  }


  /*
   * Informações do imóvel
   */
  if (
    imoveis &&
    Object.keys(imoveis).length > 0
  ) {
    if (
      imoveis.Tipo_de_Anuncio ===
      "venda"
    ) {
      rows = [
        createData(
          "Andar",
          imoveis?.Andar !== null
            ? imoveis.Andar + "º"
            : ""
        ),

        createData(
          "Área terreno",
          imoveis?.Area_Terreno !== null
            ? imoveis.Area_Terreno +
                " (m²)"
            : "Sem Informação"
        ),

        createData(
          "Ano de construção",
          imoveis?.Ano_de_Construcao !==
          null
            ? imoveis.Ano_de_Construcao
            : "Sem Informação"
        ),

        createData(
          "Condomínio",
          imoveis?.Condominio !== null &&
          imoveis.Condominio
            ? "R$" +
              imoveis.Condominio
            : "Sem Informação"
        ),

        createData(
          "IPTU (anual)",
          imoveis?.IPTU !== null
            ? parseInt(
                imoveis.IPTU
              ).toLocaleString(
                "pt-BR",
                {
                  style:
                    "currency",
                  currency:
                    "BRL"
                }
              )
            : "Sem Informação"
        ),

        createData(
          "Quartos",
          imoveis?.Quartos !== null
            ? imoveis.Quartos
            : "Sem Informação"
        ),

        createData(
          "Suítes",
          imoveis?.Suites !== null
            ? imoveis.Suites
            : "Sem Informação"
        ),

        createData(
          "Banheiros",
          imoveis?.Banheiros !== null
            ? imoveis.Banheiros
            : "Sem Informação"
        )
      ];

      rows =
        rows.filter(
          (item) =>
            item.info !== ""
        );
    } else {
      rows = [
        createData(
          "Andar",
          imoveis?.Andar !== null
            ? imoveis.Andar + "º"
            : ""
        ),

        createData(
          "Área terreno",
          imoveis?.Area_Terreno !== null
            ? imoveis.Area_Terreno +
                " (m²)"
            : "Sem Informação"
        ),

        createData(
          "Condomínio",
          imoveis?.Condominio !== null &&
          imoveis.Condominio
            ? "R$" +
              imoveis?.Condominio
            : "Sem Informação"
        ),

        createData(
          "IPTU (anual)",
          imoveis?.IPTU !== null
            ? parseInt(
                imoveis.IPTU
              ).toLocaleString(
                "pt-BR",
                {
                  style:
                    "currency",
                  currency:
                    "BRL"
                }
              )
            : ""
        ),

        createData(
          "Quartos",
          imoveis?.Quartos !== null
            ? imoveis.Quartos
            : ""
        ),

        createData(
          "Suítes",
          imoveis?.Suites !== null
            ? imoveis.Suites
            : ""
        ),

        createData(
          "Banheiros",
          imoveis?.Banheiros !== null
            ? imoveis.Banheiros
            : "Sem Informação"
        )
      ];

      rows =
        rows.filter(
          (item) =>
            item.info !== ""
        );
    }
  }


  const handleClickOpen = () => {
    setOpen(true);
  };


  /*
   * Controla o botão "Saiba mais"
   */
  useEffect(() => {
    if (
      !contentRef.current ||
      loading
    ) {
      return;
    }

    const element =
      contentRef.current;

    const updateToggle = () => {
      setShowToggle(
        element.scrollHeight >
          160
      );
    };

    updateToggle();

    const resizeObserver =
      new ResizeObserver(
        updateToggle
      );

    resizeObserver.observe(
      element
    );

    return () => {
      resizeObserver.disconnect();
    };
  }, [
    loading,
    imoveis
  ]);


  return (
    <React.Fragment>

      {!isMobile && (
        <TopInfo />
      )}

      <Header />


      {!loading && (
        <>
          <div className="ThumbSLider-highligh slick-slider center slick-initialized">

            <ThumbSLider
              height="300"
              image={imoveis?.Fotos?.slice(
                1
              )}
              detail="true"
              onClick={
                handleClickOpen
              }
            />

          </div>


          <div className="row center">

            <Box
              className="back"
              sx={{
                width: "100%"
              }}
            >

              <Button
                onClick={() => {
                  history.push(
                    "/"
                  );
                }}
              >
                <KeyboardBackspaceIcon />
                Voltar para Resultados
              </Button>

            </Box>


            <div className="ThumbSLider-info">

              <Box className="wrapper-property">

                <span className="imovel">
                  {imoveis?.titulo ||
                    ""}
                </span>

                <div className="property-header">

                  <div className="property-location">

                    <span className="location-chip">
                      <LocationPinIcon fontSize="small" />
                      {imoveis?.Bairro ||
                        ""}
                    </span>

                    <span className="location-chip">
                      <LocationCityIcon fontSize="small" />
                      São Paulo - SP
                    </span>

                    {imoveis?.codigo && (
                      <span
                        className="location-chip"
                        style={{
                          display:
                            "block"
                        }}
                      >
                        Cod. Imóvel{" "}
                        <i>#</i>
                        {
                          imoveis.codigo
                        }
                      </span>
                    )}

                  </div>

                </div>

              </Box>


              <Box className="card">

                <Typography
                  className="icon-card icon-sale"
                  variant="h6"
                  component="div"
                  color="text.secondary"
                >

                  {imoveis?.Valor_Venda !==
                  null
                    ? parseFloat(
                        imoveis?.Valor_Venda?.replace(
                          ".",
                          ""
                        )
                      )?.toLocaleString(
                        "pt-BR",
                        {
                          style:
                            "currency",
                          currency:
                            "BRL"
                        }
                      )
                    : parseFloat(
                        imoveis?.Valor_Aluguel?.replace(
                          ".",
                          ""
                        )
                      )?.toLocaleString(
                        "pt-BR",
                        {
                          style:
                            "currency",
                          currency:
                            "BRL"
                        }
                      )}

                </Typography>

              </Box>

            </div>


            <CardDetail
              data={imoveis}
            />


            <Box
              className="propertyDetails"
              sx={{
                width: "100%"
              }}
            >

              <Box
                ref={contentRef}
                className="caracteristicas"
                sx={{
                  maxHeight:
                    openToggle
                      ? `${
                          contentRef
                            .current
                            ?.scrollHeight ||
                          9999
                        }px`
                      : "160px",

                  overflow:
                    "hidden",

                  transition:
                    "max-height .4s ease"
                }}
              >

                <h2>
                  Descrição
                </h2>


                {imoveis?.descricao?.map(
                  (
                    desc,
                    index
                  ) => {

                    if (
                      desc.type ===
                      "paragraph"
                    ) {
                      return (
                        <Typography
                          key={`paragraph-${index}`}
                          gutterBottom
                          variant="h5"
                        >
                          {desc.children?.map(
                            (
                              child,
                              childIndex
                            ) => (
                              <React.Fragment
                                key={
                                  childIndex
                                }
                              >
                                {
                                  child.text
                                }
                              </React.Fragment>
                            )
                          )}
                        </Typography>
                      );
                    }


                    if (
                      desc.type ===
                      "list"
                    ) {
                      return (
                        <ol
                          key={`list-${index}`}
                          className="list"
                          style={{
                            marginLeft:
                              "10px"
                          }}
                        >

                          {desc.children?.map(
                            (
                              listItem,
                              itemIndex
                            ) => (
                              <li
                                key={
                                  itemIndex
                                }
                                style={{
                                  marginTop:
                                    itemIndex ===
                                    0
                                      ? "15px"
                                      : "0.3rem",

                                  marginBottom:
                                    itemIndex ===
                                    desc
                                      .children
                                      .length -
                                      1
                                      ? "15px"
                                      : "0.3rem"
                                }}
                              >

                                <Typography
                                  component="span"
                                  variant="h5"
                                >
                                  {listItem.children?.map(
                                    (
                                      child,
                                      childIndex
                                    ) => (
                                      <React.Fragment
                                        key={
                                          childIndex
                                        }
                                      >
                                        {
                                          child.text
                                        }
                                      </React.Fragment>
                                    )
                                  )}
                                </Typography>

                              </li>
                            )
                          )}

                        </ol>
                      );
                    }


                    return null;
                  }
                )}

              </Box>


              {showToggle && (
                <button
                  type="button"
                  onClick={() =>
                    setOpenToggle(
                      (prev) =>
                        !prev
                    )
                  }
                  className="toggle-description"
                  aria-expanded={
                    openToggle
                  }
                >

                  <span>
                    {openToggle
                      ? "Mostrar menos"
                      : "Saiba mais"}
                  </span>


                  {openToggle ? (
                    <KeyboardArrowUpIcon />
                  ) : (
                    <KeyboardArrowDownIcon />
                  )}

                </button>
              )}

            </Box>


            <br />


            <TableContainer
              style={{
                boxShadow:
                  "none"
              }}
            >

              <Table
                className="TableInfo-imovel"
                sx={{
                  fontSize:
                    "0.5rem"
                }}
                aria-label="simple table"
              >

                <TableBody>

                  {rows.map(
                    (row) => (
                      <TableRow
                        key={
                          row.name
                        }
                        sx={{
                          "&:last-child td, &:last-child th":
                            {
                              border: 0
                            }
                        }}
                      >

                        <TableCell
                          component="th"
                          scope="row"
                          style={{
                            paddingLeft:
                              "30px"
                          }}
                        >
                          {row.name}
                        </TableCell>


                        <TableCell align="right">
                          {
                            row.info
                          }
                        </TableCell>

                      </TableRow>
                    )
                  )}

                </TableBody>

              </Table>

            </TableContainer>

          </div>
        </>
      )}


      {loading &&
        !isMobile && (
          <PreloadImovelDetail />
        )}


      {loading &&
        isMobile && (
          <PreloadImovelDetailMobile />
        )}


      <Footer />

    </React.Fragment>
  );
};


const mapStateToProps = (
  state
) => ({
  realestate:
    state.character.realestate
});


export default withRouter(
  connect(
    mapStateToProps
  )(CharacterDetail)
);