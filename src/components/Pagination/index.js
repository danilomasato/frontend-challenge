import React, {
  useState
} from "react";

import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { Loading } from "../../components/Loading";

import { useDispatch } from "react-redux";

import * as api from "../../api";
import * as types from "../../constants/ActionTypes";

export default function CustomIcons({
  pagination,
  filters = {}
}) {

  const dispatch = useDispatch();

  const [changePage, setChangePage] =
    useState(false);

  const pageCount =
    Number(
      pagination?.pageCount
    ) || 1;

  const currentPage =
    Number(
      pagination?.page
    ) || 1;

  const shouldShowPagination =
    pageCount > 1;

  const handleChange = async (
    event,
    page
  ) => {

    if (changePage) {
      return;
    }

    if (page === currentPage) {
      return;
    }

    setChangePage(true);

    try {

      const response =
        await api.getArticles(
          page,
          {
            bairro:
              filters?.bairro || "",

            categoria:
              filters?.categoria || "",

            min:
              Number(
                filters?.min
              ) || 0,

            max:
              Number(
                filters?.max
              ) || 0
          }
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

    } catch (error) {

      console.error(
        "Erro ao carregar página:",
        error
      );

    } finally {

      setChangePage(false);

    }

  };

  if (!shouldShowPagination) {
    return null;
  }

  return (
    <>

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

      {changePage && (
        <Loading />
      )}

    </>
  );
}