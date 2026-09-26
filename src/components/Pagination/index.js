  import React, {
    useEffect,
    useRef,
    useState
  } from "react";

  import Pagination from "@mui/material/Pagination";
  import PaginationItem from "@mui/material/PaginationItem";
  import Stack from "@mui/material/Stack";

  import ArrowBackIcon from "@mui/icons-material/ArrowBack";
  import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

  import {
    useDispatch,
    useSelector
  } from "react-redux";

  import * as api from "../../api";
  import * as types from "../../constants/ActionTypes";

  const pageCache = new Map();

  const normalizeFilters = (filters = {}) => ({
    bairro: filters?.bairro || "",
    categoria: filters?.categoria || "",
    min: Number(filters?.min) || 0,
    max: Number(filters?.max) || 0
  });

  const getFilterKey = (filters = {}) => {
    return JSON.stringify(
      normalizeFilters(filters)
    );
  };

  const getPageKey = (filters, page) => {
    return `${getFilterKey(filters)}::${page}`;
  };

  export default function CustomIcons({
    pagination,
    filters = {},
    onPageChangeStart,
    onPageChangeEnd
  }) {
    const dispatch = useDispatch();

    const realstate = useSelector(
      (state) =>
        state.home.realestate?.data || []
    );

    const [changePage, setChangePage] =
      useState(false);

    const changePageRef =
      useRef(false);

    const pageCount =
      Number(pagination?.pageCount) || 1;

    const currentPage =
      Number(pagination?.page) || 1;

    const shouldShowPagination =
      pageCount > 1;

    const filterKey =
      getFilterKey(filters);

    useEffect(() => {
      if (!pagination?.page) {
        return;
      }

      const pageKey =
        getPageKey(
          filters,
          currentPage
        );

      /*
      * Guarda somente a página atual
      * para permitir voltar a ela sem
      * fazer um novo request.
      *
      * O resultado de filtros não é
      * armazenado separadamente.
      */
      if (!pageCache.has(pageKey)) {
        pageCache.set(
          pageKey,
          {
            data: Array.isArray(realstate)
              ? realstate
              : [],
            meta: {
              pagination
            }
          }
        );
      }
    }, [
      realstate,
      pagination,
      currentPage,
      filterKey,
      filters
    ]);

    const handleChange = async (
      event,
      page
    ) => {
      if (changePageRef.current) {
        return;
      }

      if (page === currentPage) {
        return;
      }

      changePageRef.current = true;
      setChangePage(true);

      if (
        typeof onPageChangeStart ===
        "function"
      ) {
        onPageChangeStart();
      }

      try {
        const pageKey =
          getPageKey(
            filters,
            page
          );

        /*
        * Se essa página já foi visitada
        * com os mesmos filtros, utiliza
        * somente o cache da paginação.
        */
        if (pageCache.has(pageKey)) {
          const cachedResponse =
            pageCache.get(pageKey);

          await new Promise(
            (resolve) => {
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  resolve();
                });
              });
            }
          );

          dispatch({
            type: types.RECEIVE_HOME,
            payload: cachedResponse
          });

          if (
            cachedResponse?.meta
              ?.pagination
          ) {
            dispatch({
              type:
                types.RECEIVE_PAGINATION,
              payload:
                cachedResponse.meta
                  .pagination
            });
          }

          return;
        }

        /*
        * Página ainda não visitada:
        * faz o request normalmente.
        */
        const response =
          await api.getArticles(
            page,
            {
              bairro:
                filters?.bairro || "",
              categoria:
                filters?.categoria || "",
              min:
                Number(filters?.min) || 0,
              max:
                Number(filters?.max) || 0
            }
          );

        /*
        * Guarda somente o resultado
        * dessa página para a navegação
        * posterior.
        */
        pageCache.set(
          pageKey,
          response
        );

        dispatch({
          type: types.RECEIVE_HOME,
          payload: response
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
      } catch (error) {
        console.error(
          "Erro ao carregar página:",
          error
        );
      } finally {
        changePageRef.current = false;

        if (
          typeof onPageChangeEnd ===
          "function"
        ) {
          onPageChangeEnd();
        }
      }
    };

    if (!shouldShowPagination) {
      return null;
    }

    return (
      <Stack
        spacing={2}
        className="center"
        style={{
          marginTop: "30px"
        }}
      >
        <Pagination
          count={pageCount}
          page={currentPage}
          onChange={handleChange}
          disabled={changePage}
          renderItem={(item) => (
            <PaginationItem
              components={{
                previous:
                  ArrowBackIcon,
                next:
                  ArrowForwardIcon
              }}
              {...item}
            />
          )}
        />
      </Stack>
    );
  }