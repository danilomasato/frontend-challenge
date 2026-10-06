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

MobileNumericTextField.displayName = "MobileNumericTextField";

const getInitialLoadingState = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("loading") === "true";
};

const Home = ({ realstate, pagination }) => {
  const dispatch = useDispatch();

  const initialLoadStartedRef = useRef(false);
  const mountedRef = useRef(true);

  const [filters, setFilters] = useState({
    search: { label: "", id: "" },
    category: "",
    optionsValue: { min: 0, max: 0 }
  });

  const [home, setHome] = useState({
    loading: getInitialLoadingState(),
    imoveis: realstate || [],
    mobileSearchOpen: false,
    hasFilters: false,
    isMobile: window.innerWidth <= 1024
  });

  const configPreload = 6;

  const data = Array.isArray(realstate) ? realstate : [];

  const realEstate = {
    character: {
      data
    }
  };

  const isLoading = home.loading;

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
    if (initialLoadStartedRef.current) {
      return;
    }

    initialLoadStartedRef.current = true;

    const restoreNeighborhoods = () => {
      if (homeNeighborhoodCache?.length) {
        setHome(prev => ({
          ...prev,
          imoveis: homeNeighborhoodCache
        }));

        return true;
      }

      return false;
    };

    const loadNeighborhoods = async () => {
      if (homeNeighborhoodsLoaded && homeNeighborhoodCache?.length) {
        restoreNeighborhoods();
        return;
      }

      try {
        const bairros = await api.getAllBairros();

        if (!mountedRef.current) {
          return;
        }

        const neighborhoods = Array.isArray(bairros)
          ? bairros
          : bairros?.data || bairros?.bairros || [];

        homeNeighborhoodCache = neighborhoods;
        homeNeighborhoodsLoaded = true;

        setHome(prev => ({
          ...prev,
          imoveis: neighborhoods
        }));
      } catch (error) {
        console.error("Erro ao carregar bairros:", error);
      }
    };

    const finishInitialLoading = () => {
      if (mountedRef.current) {
        setHome(prev => ({
          ...prev,
          loading: false
        }));
      }
    };

    const loadInitialData = async () => {
      if (realstate?.length > 0) {
        homeInitialDataLoaded = true;

        homeInitialDataCache = {
          data: realstate,
          meta: pagination
        };

        restoreNeighborhoods();
        await loadNeighborhoods();
        finishInitialLoading();

        return;
      }

      if (homeInitialDataLoaded && homeInitialDataCache) {
        dispatch({
          type: types.RECEIVE_HOME,
          payload: homeInitialDataCache.data
        });

        dispatch({
          type: types.RECEIVE_PAGINATION,
          payload: homeInitialDataCache.meta
        });

        restoreNeighborhoods();
        await loadNeighborhoods();
        finishInitialLoading();

        return;
      }

      setHome(prev => ({
        ...prev,
        loading: true
      }));

      try {
        const [response] = await Promise.all([
          dispatch(getArticles()),
          loadNeighborhoods()
        ]);

        if (!mountedRef.current) {
          return;
        }

        const responseData = response?.data || response?.payload || [];
        const responsePagination = response?.meta?.pagination || response?.pagination || {};

        homeInitialDataLoaded = true;

        homeInitialDataCache = {
          data: responseData,
          meta: responsePagination
        };
      } catch (error) {
        console.error("Erro ao carregar imóveis:", error);
      } finally {
        finishInitialLoading();
      }
    };

    loadInitialData();
  }, [dispatch, realstate, pagination]);

  useEffect(() => {
    if (home.isMobile && data.length > 0) {
      setHome(prev => ({
        ...prev,
        mobileSearchOpen: false
      }));
    }
  }, [home.isMobile, data.length]);

  const options = useMemo(() => {
    const source = Array.isArray(home.imoveis) ? home.imoveis : [];

    const bairros = source
      .map(item => {
        if (typeof item === "string") {
          return item;
        }

        return item?.Bairro || item?.bairro || item?.attributes?.Bairro || item?.attributes?.bairro || "";
      })
      .filter(Boolean);

    const unique = [
      ...new Map(
        bairros.map(bairro => [bairro.toLowerCase(), bairro])
      ).values()
    ];

    return unique
      .sort((a, b) => a.localeCompare(b, "pt-BR", { sensitivity: "base" }))
      .map(bairro => ({
        label: bairro,
        bairro,
        id: bairro
      }));
  }, [home.imoveis]);

  const currentFilters = {
    bairro: filters.search?.label || "",
    categoria: filters.category || "",
    min: Number(filters.optionsValue?.min) || 0,
    max: Number(filters.optionsValue?.max) || 0
  };

  const handleClick = async () => {
    setHome(prev => ({
      ...prev,
      loading: true
    }));

    requestAnimationFrame(async () => {
      try {
        const response = await api.getArticles(1, currentFilters);

        dispatch({
          type: types.RECEIVE_HOME,
          payload: response
        });

        if (response?.meta?.pagination) {
          dispatch({
            type: types.RECEIVE_PAGINATION,
            payload: response.meta.pagination
          });
        }

        homeInitialDataLoaded = true;
        homeInitialDataCache = response;

        setHome(prev => ({
          ...prev,
          hasFilters: true
        }));

        if (filters.search?.label) {
          localStorage.setItem("neighborhood", filters.search.label);
        } else {
          localStorage.removeItem("neighborhood");
        }

        if (home.isMobile) {
          setHome(prev => ({
            ...prev,
            mobileSearchOpen: false
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar imóveis:", error);

        dispatch({
          type: types.RECEIVE_HOME,
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
          type: types.RECEIVE_PAGINATION,
          payload: {
            page: 1,
            pageSize: 0,
            pageCount: 0,
            total: 0
          }
        });

        setHome(prev => ({
          ...prev,
          hasFilters: true
        }));
      } finally {
        if (mountedRef.current) {
          setHome(prev => ({
            ...prev,
            loading: false
          }));
        }
      }
    });
  };

  const handlePriceValueChange = field => values => {
    let value = values?.value ?? "";

    setFilters(prev => {
      if (prev.optionsValue[field] === 0 && value.length > 1 && value.startsWith("0")) {
        value = value.replace(/^0+/, "") || "0";
      }

      return {
        ...prev,
        optionsValue: {
          ...prev.optionsValue,
          [field]: value
        }
      };
    });
  };

  const handlePriceKeyDown = event => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    event.currentTarget.blur();

    setTimeout(() => {
      if (document.activeElement) {
        document.activeElement.blur();
      }

      handleClick();
    }, 50);
  };

  const handlePriceBlur = field => {
    setFilters(prev => {
      const value = prev.optionsValue[field];

      if (value === "" || value === null || value === undefined || Number(value) === 0) {
        return {
          ...prev,
          optionsValue: {
            ...prev.optionsValue,
            [field]: 0
          }
        };
      }

      return prev;
    });
  };

  const handleChangeCategory = event => {
    setFilters(prev => ({
      ...prev,
      category: event.target.value
    }));
  };

  const handlePaginationChange = async page => {
    setHome(prev => ({
      ...prev,
      loading: true
    }));

    try {
      const response = await api.getArticles(page, currentFilters);

      dispatch({
        type: types.RECEIVE_HOME,
        payload: response
      });

      if (response?.meta?.pagination) {
        dispatch({
          type: types.RECEIVE_PAGINATION,
          payload: response.meta.pagination
        });
      }

      homeInitialDataCache = response;
    } catch (error) {
      console.error("Erro ao carregar página:", error);
    } finally {
      if (mountedRef.current) {
        setHome(prev => ({
          ...prev,
          loading: false
        }));
      }
    }
  };

  const resetFilters = async () => {
    setFilters({
      search: { label: "", id: "" },
      category: "",
      optionsValue: { min: 0, max: 0 }
    });

    setHome(prev => ({
      ...prev,
      loading: true,
      hasFilters: false
    }));

    localStorage.removeItem("neighborhood");

    requestAnimationFrame(async () => {
      try {
        const response = await api.getArticles(1, {});

        dispatch({
          type: types.RECEIVE_HOME,
          payload: response
        });

        if (response?.meta?.pagination) {
          dispatch({
            type: types.RECEIVE_PAGINATION,
            payload: response.meta.pagination
          });
        }

        homeInitialDataLoaded = true;
        homeInitialDataCache = response;

        if (home.isMobile) {
          setHome(prev => ({
            ...prev,
            mobileSearchOpen: false
          }));
        }
      } catch (error) {
        console.error("Erro ao limpar filtros:", error);
      } finally {
        if (mountedRef.current) {
          setHome(prev => ({
            ...prev,
            loading: false
          }));
        }
      }
    });
  };

  useEffect(() => {
    const handleResize = () => {
      setHome(prev => ({
        ...prev,
        isMobile: window.innerWidth <= 1024
      }));
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.clear();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const hasActiveFilters =
    home.hasFilters &&
    (
      filters.search?.label ||
      filters.category ||
      Number(filters.optionsValue?.min) > 0 ||
      Number(filters.optionsValue?.max) > 0
    );

  return (
    <>
      {!home.isMobile && <TopInfo />}

      <Header />

      <main className="home">
        <Container>
          <div className="home-filters">
            <DesktopFilters
              isMobile={home.isMobile}
              options={options}
              search={filters.search}
              setSearch={value => setFilters(prev => ({ ...prev, search: value }))}
              category={filters.category}
              handleChangeCategory={handleChangeCategory}
              optionsValue={filters.optionsValue}
              handlePriceValueChange={handlePriceValueChange}
              handlePriceKeyDown={handlePriceKeyDown}
              handlePriceBlur={handlePriceBlur}
              handleClick={handleClick}
              resetFilters={resetFilters}
            />

            <MobileFilters
              isMobile={home.isMobile}
              mobileSearchOpen={home.mobileSearchOpen}
              setMobileSearchOpen={value => setHome(prev => ({ ...prev, mobileSearchOpen: value }))}
              imoveis={home.imoveis}
              options={options}
              search={filters.search}
              setSearch={value => setFilters(prev => ({ ...prev, search: value }))}
              category={filters.category}
              handleChangeCategory={handleChangeCategory}
              optionsValue={filters.optionsValue}
              handlePriceValueChange={handlePriceValueChange}
              handlePriceKeyDown={handlePriceKeyDown}
              handlePriceBlur={handlePriceBlur}
              handleClick={handleClick}
              resetFilters={resetFilters}
              MobileNumericTextField={MobileNumericTextField}
            />
          </div>

          {isLoading ? (
            <HomeSkeleton configPreload={configPreload} />
          ) : data.length > 0 ? (
            <>
              <ResultSummary
                isMobile={home.isMobile}
                hasFilters={hasActiveFilters}
                category={filters.category}
                search={filters.search}
                pagination={pagination}
                data={data}
              />

              <Card data={realEstate} hasFilters={home.hasFilters} />
            </>
          ) : null}

          <EmptyState
            isLoading={isLoading}
            hasFilters={home.hasFilters}
            data={data}
            resetFilters={resetFilters}
          />

          {isLoading && <Loading />}

          {!isLoading && data.length > 0 && (
            <Pagination pagination={pagination} onChange={handlePaginationChange} />
          )}
        </Container>
      </main>

      <Footer />
    </>
  );
};

const mapStateToProps = state => ({
  realstate: state.home.realestate?.data || [],
  pagination: state.home.pagination || {}
});

export default withRouter(
  connect(mapStateToProps)(Home)
);