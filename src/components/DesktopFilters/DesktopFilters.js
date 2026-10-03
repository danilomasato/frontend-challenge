import React from "react";

import {
  Box,
  Grid,
  Button,
  TextField,
  MenuItem
} from "@mui/material";

import Autocomplete from "@mui/material/Autocomplete";

import { NumericFormat } from "react-number-format";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import LocationPinIcon from "@mui/icons-material/LocationOn";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AutorenewIcon from "@mui/icons-material/Autorenew";

const DesktopFilters = ({
  isMobile,

  options,

  search,
  setSearch,

  category,
  handleChangeCategory,

  optionsValue,

  handlePriceValueChange,
  handlePriceKeyDown,
  handlePriceBlur,

  handleClick,
  resetFilters
}) => {

  if (isMobile) {
    return null;
  }

  return (

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
              options.find(
                option =>
                  option.id ===
                  search?.id
              ) || null
            }
            className="search-neighborhoods"
            disablePortal
            options={options}
            getOptionLabel={
              option =>
                typeof option ===
                "string"
                  ? option
                  : option?.label || ""
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
              params => (

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
              handlePriceValueChange(
                "min"
              )
            }
            onKeyDown={
              handlePriceKeyDown
            }
            onBlur={
              () =>
                handlePriceBlur(
                  "min"
                )
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
                "search"
            }}
            isAllowed={
              values =>
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
              handlePriceValueChange(
                "max"
              )
            }
            onKeyDown={
              handlePriceKeyDown
            }
            onBlur={
              () =>
                handlePriceBlur(
                  "max"
                )
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
                "search"
            }}
            isAllowed={
              values =>
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

        <Grid size={12}>

          <div
            style={{
              marginTop: "6px",
              position: "relative",
              right: "-119px"
            }}
          >

            <Button
              variant="text"
              onClick={
                resetFilters
              }
              style={{
                textTransform:
                  "none",
                fontSize:
                  "13px",
                whiteSpace:
                  "nowrap",
                minWidth:
                  "unset",
                padding:
                  "4px 0"
              }}
            >

              <AutorenewIcon
                style={{
                  marginRight:
                    "4px",
                  fontSize:
                    "18px"
                }}
              />

              Limpar filtros

            </Button>

          </div>

        </Grid>

      </Grid>

    </Grid>

  );
};

export default DesktopFilters;