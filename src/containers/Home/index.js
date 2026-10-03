import React, { useState, useEffect, useMemo, useRef } from "react";
import { withRouter } from "react-router-dom";
import { connect, useDispatch } from "react-redux";

import { getArticles } from "../../actions";
import * as api from "../../api";
import * as types from "../../constants/ActionTypes";

import "./Home.css";

import TextField from "@mui/material/TextField";

import Card from "../../components/Card";
import Pagination from "../../components/Pagination";
import { Header } from "../../components/Header";
import { Loading } from "../../components/Loading";
import { TopInfo } from "../../components/TopInfo";
import { Footer } from "../../components/Footer";
import { Container } from "../../components";

import DesktopFilters from "../../components/DesktopFilters/DesktopFilters";
import MobileFilters from "../../components/MobileFilters/MobileFilters";
import ResultSummary from "../../components/ResultSummary";
import EmptyState from "../../components/EmptyState";
import HomeSkeleton from "../../components/HomeSkeleton";

let homeInitialDataLoaded = false;
let homeInitialDataCache = null;
let homeNeighborhoodCache = null;
let homeNeighborhoodsLoaded = false;

const MobileNumericTextField = React.forwardRef((props, ref) => (
  <TextField
    {...props}
    inputRef={ref}
    inputProps={{
      ...props.inputProps,
      inputMode: "numeric",
      pattern: "[0-9]*",
      enterKeyHint: "search",
      type: "tel"
    }}
  />
));

MobileNumericTextField.displayName =
  "MobileNumericTextField";

const getInitialLoadingState = () => {
  const params = new URLSearchParams(
    window.location.search
  );

  return params.get("loading") === "true";
};

const Home = ({
  realstate,
  pagination
}) => {
  const dispatch = useDispatch();

  const initialLoadStartedRef =
    useRef(false);

  const mountedRef =
    useRef(true);

  const [search, setSearch] = useState({
    label: "",
    id: ""
  });

  const [loadingState, setLoadingState] =
    useState(
      getInitialLoadingState
    );

  const [imoveis, setImoveis] =
    useState(realstate || []);

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

  const data =
    Array.isArray(realstate)
      ? realstate
      : [];

  const realEstate = {
    character: {
      data
    }
  };

  const isLoading =
    loadingState;

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pagination?.page]);

  useEffect(() => {
    if (
      initialLoadStartedRef.current
    ) {
      return;
    }

    initialLoadStartedRef.current =
      true;

    const restoreNeighborhoods = () => {
      if (
        homeNeighborhoodCache?.length
      ) {
        setImoveis(
          homeNeighborhoodCache
        );

        return true;
      }

      return false;
    };

    const loadNeighborhoods =
      async () => {

        if (
          homeNeighborhoodsLoaded &&
          homeNeighborhoodCache?.length
        ) {
          restoreNeighborhoods();
          return;
        }

        try {
          const bairros =
            await api.getAllBairros();

          if (
            !mountedRef.current
          ) {
            return;
          }

          const neighborhoods =
            Array.isArray(bairros)
              ? bairros
              : bairros?.data ||
                bairros?.bairros ||
                [];

          homeNeighborhoodCache =
            neighborhoods;

          homeNeighborhoodsLoaded =
            true;

          setImoveis(
            neighborhoods
          );
        } catch (error) {
          console.error(
            "Erro ao carregar bairros:",
            error
          );
        }
      };

    const finishInitialLoading =
      () => {
        if (
          mountedRef.current
        ) {
          setLoadingState(false);
        }
      };

    const loadInitialData =
      async () => {

        if (
          realstate?.length > 0
        ) {
          homeInitialDataLoaded =
            true;

          homeInitialDataCache = {
            data: realstate,
            meta: pagination
          };

          restoreNeighborhoods();

          await loadNeighborhoods();

          finishInitialLoading();

          return;
        }

        if (
          homeInitialDataLoaded &&
          homeInitialDataCache
        ) {
          dispatch({
            type:
              types.RECEIVE_HOME,
            payload:
              homeInitialDataCache.data
          });

          dispatch({
            type:
              types.RECEIVE_PAGINATION,
            payload:
              homeInitialDataCache.meta
          });

          restoreNeighborhoods();

          await loadNeighborhoods();

          finishInitialLoading();

          return;
        }

        setLoadingState(true);

        try {
          const [response] =
            await Promise.all([
              dispatch(getArticles()),
              loadNeighborhoods()
            ]);

          if (
            !mountedRef.current
          ) {
            return;
          }

          const responseData =
            response?.data ||
            response?.payload ||
            [];

          const responsePagination =
            response?.meta?.pagination ||
            response?.pagination ||
            {};

          homeInitialDataLoaded =
            true;

          homeInitialDataCache = {
            data: responseData,
            meta: responsePagination
          };
        } catch (error) {
          console.error(
            "Erro ao carregar imóveis:",
            error
          );
        } finally {
          finishInitialLoading();
        }
      };

    loadInitialData();
  }, [
    dispatch,
    realstate,
    pagination
  ]);

  useEffect(() => {
    if (
      isMobile &&
      data.length > 0
    ) {
      setMobileSearchOpen(false);
    }
  }, [
    isMobile,
    data.length
  ]);

  const options = useMemo(() => {
    const source =
      Array.isArray(imoveis)
        ? imoveis
        : [];

    const bairros =
      source
        .map(item => {

          if (
            typeof item === "string"
          ) {
            return item;
          }

          return (
            item?.Bairro ||
            item?.bairro ||
            item?.attributes?.Bairro ||
            item?.attributes?.bairro ||
            ""
          );
        })
        .filter(Boolean);

    const unique = [
      ...new Map(
        bairros.map(
          bairro => [
            bairro.toLowerCase(),
            bairro
          ]
        )
      ).values()
    ];

    return unique
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
      .map(bairro => ({
        label: bairro,
        bairro,
        id: bairro
      }));
  }, [imoveis]);

  const currentFilters = {
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
  };

  const handleClick =
    async () => {

      setLoadingState(true);

      requestAnimationFrame(
        async () => {

          try {

            /*
             * IMPORTANTE:
             *
             * Mantemos exatamente o mesmo formato
             * utilizado na Home antiga.
             *
             * O api.getArticles() recebe os filtros
             * completos, inclusive min e max.
             */
            const response =
              await api.getArticles(
                1,
                currentFilters
              );

            /*
             * IMPORTANTE:
             *
             * O reducer recebe a RESPOSTA COMPLETA,
             * e não apenas response.data.
             *
             * Este era o comportamento da Home
             * anterior que estava funcionando.
             */
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
             * Mantém o resultado filtrado no cache.
             */
            homeInitialDataLoaded =
              true;

            homeInitialDataCache =
              response;

            setHasFilters(true);

            if (
              search?.label
            ) {
              localStorage.setItem(
                "neighborhood",
                search.label
              );
            } else {
              localStorage.removeItem(
                "neighborhood"
              );
            }

            if (isMobile) {
              setMobileSearchOpen(
                false
              );
            }

          } catch (error) {

            console.error(
              "Erro ao buscar imóveis:",
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
                    pageSize: 0,
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
                pageSize: 0,
                pageCount: 0,
                total: 0
              }
            });

            setHasFilters(true);

          } finally {

            if (
              mountedRef.current
            ) {
              setLoadingState(false);
            }

          }
        }
      );
    };

  const handlePriceValueChange =
    field => values => {

      let value =
        values?.value ?? "";

      setOptionsValue(prev => {

        if (
          prev[field] === 0 &&
          value.length > 1 &&
          value.startsWith("0")
        ) {
          value =
            value.replace(
              /^0+/,
              ""
            ) || "0";
        }

        return {
          ...prev,
          [field]: value
        };
      });
    };

  const handlePriceKeyDown =
    event => {

      if (
        event.key !== "Enter"
      ) {
        return;
      }

      event.preventDefault();

      event.currentTarget.blur();

      setTimeout(() => {

        if (
          document.activeElement
        ) {
          document.activeElement.blur();
        }

        handleClick();

      }, 50);
    };

  const handlePriceBlur =
    field => {

      setOptionsValue(prev => {

        const value =
          prev[field];

        if (
          value === "" ||
          value === null ||
          value === undefined ||
          Number(value) === 0
        ) {
          return {
            ...prev,
            [field]: 0
          };
        }

        return prev;
      });
    };

  const handleChangeCategory =
    event => {
      setCategory(
        event.target.value
      );
    };

  const handlePaginationChange =
    async page => {

      setLoadingState(true);

      try {

        /*
         * Também mantemos os filtros completos
         * na paginação.
         */
        const response =
          await api.getArticles(
            page,
            currentFilters
          );

        /*
         * Mesmo formato da Home antiga:
         * response completo no RECEIVE_HOME.
         */
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

        homeInitialDataCache =
          response;

      } catch (error) {

        console.error(
          "Erro ao carregar página:",
          error
        );

      } finally {

        if (
          mountedRef.current
        ) {
          setLoadingState(false);
        }

      }
    };

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

      setLoadingState(true);

      setHasFilters(false);

      localStorage.removeItem(
        "neighborhood"
      );

      requestAnimationFrame(
        async () => {

          try {

            const response =
              await api.getArticles(
                1,
                {}
              );

            /*
             * Mesmo comportamento da Home antiga.
             */
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

            homeInitialDataLoaded =
              true;

            homeInitialDataCache =
              response;

            if (isMobile) {
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

            if (
              mountedRef.current
            ) {
              setLoadingState(false);
            }

          }
        }
      );
    };

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

  const hasActiveFilters =
    hasFilters &&
    (
      search?.label ||
      category ||
      Number(
        optionsValue?.min
      ) > 0 ||
      Number(
        optionsValue?.max
      ) > 0
    );

  return (
    <>
      {!isMobile && (
        <TopInfo />
      )}

      <Header />

      <main className="home">

        <Container>

          <div className="home-filters">

            <DesktopFilters
              isMobile={isMobile}
              options={options}
              search={search}
              setSearch={setSearch}
              category={category}
              handleChangeCategory={
                handleChangeCategory
              }
              optionsValue={
                optionsValue
              }
              handlePriceValueChange={
                handlePriceValueChange
              }
              handlePriceKeyDown={
                handlePriceKeyDown
              }
              handlePriceBlur={
                handlePriceBlur
              }
              handleClick={
                handleClick
              }
              resetFilters={
                resetFilters
              }
            />

            <MobileFilters
              isMobile={isMobile}
              mobileSearchOpen={
                mobileSearchOpen
              }
              setMobileSearchOpen={
                setMobileSearchOpen
              }
              imoveis={imoveis}
              options={options}
              search={search}
              setSearch={setSearch}
              category={category}
              handleChangeCategory={
                handleChangeCategory
              }
              optionsValue={
                optionsValue
              }
              handlePriceValueChange={
                handlePriceValueChange
              }
              handlePriceKeyDown={
                handlePriceKeyDown
              }
              handlePriceBlur={
                handlePriceBlur
              }
              handleClick={
                handleClick
              }
              resetFilters={
                resetFilters
              }
              MobileNumericTextField={
                MobileNumericTextField
              }
            />

          </div>

          {isLoading ? (

            <HomeSkeleton
              configPreload={
                configPreload
              }
            />

          ) : data.length > 0 ? (

            <>

              <ResultSummary
                isMobile={isMobile}
                hasFilters={
                  hasActiveFilters
                }
                category={category}
                search={search}
                pagination={
                  pagination
                }
                data={data}
              />

              <Card
                data={realEstate}
                hasFilters={
                  hasFilters
                }
              />

            </>

          ) : null}

          <EmptyState
            isLoading={isLoading}
            hasFilters={
              hasFilters
            }
            data={data}
            resetFilters={
              resetFilters
            }
          />

          {isLoading && (
            <Loading />
          )}

          {!isLoading &&
            data.length > 0 && (

              <Pagination
                pagination={
                  pagination
                }
                onChange={
                  handlePaginationChange
                }
              />

            )}

        </Container>

      </main>

      <Footer />

    </>
  );
};

const mapStateToProps =
  state => ({
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