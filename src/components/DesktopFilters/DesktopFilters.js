import React from "react";

import {
  Box,
  Grid,
  Button,
  TextField,
  MenuItem,
  Chip,
  Select
} from "@mui/material";

import Autocomplete from "@mui/material/Autocomplete";

import { NumericFormat } from "react-number-format";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import LocationPinIcon from "@mui/icons-material/LocationOn";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";

const DesktopFilters = ({
  isMobile,

  options,

  search,
  setSearch,

  category,
  handleChangeCategory,

  optionsValue,

  handlePriceValueChange,
  handlePriceFocus,
  handlePriceKeyDown,
  handlePriceBlur,

  handleClick,
  resetFilters,

  appliedFilters,

  removeSearchFilter,
  removeCategoryFilter,
  removePriceFilter
}) => {

  if (isMobile) {
    return null;
  }

  const appliedSearch =
    appliedFilters?.search?.label || "";

  const appliedCategory =
    appliedFilters?.category || "";

  const appliedMin =
    Number(
      appliedFilters?.optionsValue?.min
    ) || 0;

  const appliedMax =
    Number(
      appliedFilters?.optionsValue?.max
    ) || 0;

  const hasActiveBadges =
    Boolean(appliedSearch) ||
    Boolean(appliedCategory) ||
    appliedMin > 0 ||
    appliedMax > 0;

  const chipSx = {
    flexShrink: 0,
    height: "28px",
    borderRadius: "8px",
    backgroundColor: "rgba(22, 135, 232, 0.08)",
    border: "1px solid rgba(22, 135, 232, 0.18)",
    color: "#315b7d",
    fontSize: "12px",
    fontWeight: 600,

    "& .MuiChip-label": {
      paddingLeft: "9px",
      paddingRight: "4px"
    },

    "& .MuiChip-deleteIcon": {
      color: "rgba(49, 91, 125, 0.65)",
      fontSize: "17px",
      marginRight: "5px",
      marginLeft: "2px",

      "&:hover": {
        color: "#315b7d"
      }
    }
  };

  const compactFieldSx = {
    "& .MuiOutlinedInput-root": {
      height: "44px"
    },

    "& .MuiInputLabel-root": {
      top: "-6px"
    },

    "& .MuiInputLabel-shrink": {
      top: "0px"
    }
  };

  const renderAppliedFilters = () => {
    if (!hasActiveBadges) {
      return null;
    }

    return (
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "9px",
          marginTop: "4px",
          minWidth: 0
        }}
      >

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            flexShrink: 0,
            whiteSpace: "nowrap",
            color: "rgba(0,0,0,.62)",
            fontSize: "12px",
            fontWeight: 600
          }}
        >

          <FilterAltOutlinedIcon
            sx={{
              fontSize: "17px"
            }}
          />

          <span>
            Filtros aplicados
          </span>

        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            flexWrap: "nowrap",
            minWidth: 0,
            flex: 1
          }}
        >

          {appliedSearch && (
            <Chip
              label={appliedSearch}
              onDelete={
                removeSearchFilter
              }
              deleteIcon={
                <CloseIcon />
              }
              size="small"
              sx={chipSx}
            />
          )}

          {appliedCategory && (
            <Chip
              label={
                appliedCategory ===
                "venda"
                  ? "Venda"
                  : appliedCategory ===
                    "aluguel"
                    ? "Aluguel"
                    : appliedCategory ===
                      "Lançamentos"
                      ? "Lançamentos"
                      : appliedCategory
              }
              onDelete={
                removeCategoryFilter
              }
              deleteIcon={
                <CloseIcon />
              }
              size="small"
              sx={chipSx}
            />
          )}

          {appliedMin > 0 && (
            <Chip
              label={`A partir de R$ ${appliedMin.toLocaleString(
                "pt-BR"
              )}`}
              onDelete={() =>
                removePriceFilter("min")
              }
              deleteIcon={
                <CloseIcon />
              }
              size="small"
              sx={chipSx}
            />
          )}

          {appliedMax > 0 && (
            <Chip
              label={`Até R$ ${appliedMax.toLocaleString(
                "pt-BR"
              )}`}
              onDelete={() =>
                removePriceFilter("max")
              }
              deleteIcon={
                <CloseIcon />
              }
              size="small"
              sx={chipSx}
            />
          )}

        </Box>

      </Box>
    );
  };

  return (

    <Grid
      className="wrap-search"
      container
      sx={{
        rowGap: "10px",
        alignItems: "start",
        paddingBottom: "20px"
      }}
    >

      <Grid size={8}>

        <Box
          className="wrap-input"
          sx={{
            marginBottom: 0
          }}
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
                "-5px 0 2px 0",
              display:
                "block",
              lineHeight:
                "12px"
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
                  placeholder="Selecione o Bairro"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "44px",
                      minHeight: "44px",
                      lineHeight: "44px",
                      display: "flex",
                      alignItems: "center",
                      boxSizing: "border-box"
                    },

                    "& .MuiAutocomplete-inputRoot": {
                      height: "44px",
                      minHeight: "44px",
                      paddingTop:
                        "0px !important",
                      paddingBottom:
                        "0px !important",
                      display: "flex",
                      alignItems: "center",
                      boxSizing: "border-box"
                    },

                    "& .MuiAutocomplete-input": {
                      height:
                        "auto !important",
                      minHeight:
                        "0 !important",
                      boxSizing:
                        "border-box",
                      paddingTop:
                        "0px !important",
                      paddingBottom:
                        "0px !important",
                      paddingLeft:
                        "10px !important",
                      paddingRight:
                        "0px !important",
                      marginTop:
                        "0px !important",
                      marginBottom:
                        "0px !important",
                      lineHeight:
                        "1.4375em !important",
                      position:
                        "relative",
                      top:
                        "1px"
                    },

                    "& .MuiInputBase-input": {
                      boxSizing:
                        "border-box"
                    },

                    "& .MuiInputLabel-shrink": {
                      top: "0px"
                    },

                    "& .MuiAutocomplete-input::placeholder": {
                      color:
                        "rgba(0,0,0,.6)",
                      opacity: 1
                    }
                  }}
                />

              )
            }
          />

          <LocationPinIcon
            className="LocationPinIcon"
            sx={{
              zIndex: 2
            }}
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
          },
          alignSelf: "start"
        }}
        noValidate
        autoComplete="off"
        className="minMax"
      >

        <Box
          className="wrap-input"
          sx={{
            marginBottom: 0
          }}
        >

          <MonetizationOnIcon
            className="MonetizationOnIcon"
          />

          <NumericFormat
            value={
              optionsValue?.min ??
              0
            }
            onValueChange={
              handlePriceValueChange(
                "min"
              )
            }
            onFocus={
              handlePriceFocus
                ? () =>
                    handlePriceFocus(
                      "min"
                    )
                  : undefined
            }
            onKeyDown={
              handlePriceKeyDown
            }
            onBlur={() =>
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
            sx={compactFieldSx}
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
          sx={{
            marginBottom: 0
          }}
        >

          <MonetizationOnIcon
            className="MonetizationOnIcon"
          />

          <NumericFormat
            value={
              optionsValue?.max ??
              0
            }
            onValueChange={
              handlePriceValueChange(
                "max"
              )
            }
            onFocus={
              handlePriceFocus
                ? () =>
                    handlePriceFocus(
                      "max"
                    )
                  : undefined
            }
            onKeyDown={
              handlePriceKeyDown
            }
            onBlur={() =>
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
            sx={compactFieldSx}
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
        sx={{
          marginTop: "0px"
        }}
      >

        <Box
          sx={{
            width: "100%",
            paddingLeft: "17px",
            boxSizing: "border-box",
            marginBottom: "2px",
          }}
        >

          <label
            style={{
              fontFamily:
                "quicksand-regular",
              fontSize:
                "0.6rem",
              color:
                "rgba(0,0,0,.6)",
              display:
                "block",
              lineHeight:
                "12px"
            }}
          >
            Tipo de Anúncio
          </label>

        </Box>

        <Select
          value={
            category ?? ""
          }
          onChange={
            handleChangeCategory
          }
          displayEmpty
          variant="outlined"
          className="selectType"
          renderValue={
            selected => {

              if (
                selected === "" ||
                selected === null ||
                selected === undefined
              ) {
                return (
                  <span
                    style={{
                      color:
                        "rgba(0,0,0,.6)",
                      fontFamily:
                        "quicksand-regular"
                    }}
                  >
                    Selecione
                  </span>
                );
              }

              if (
                selected ===
                "todos"
              ) {
                return "Todos";
              }

              if (
                selected ===
                "venda"
              ) {
                return "Venda";
              }

              if (
                selected ===
                "aluguel"
              ) {
                return "Aluguel";
              }

              if (
                selected ===
                "Lançamentos"
              ) {
                return "Lançamentos";
              }

              return selected;
            }
          }
          sx={{
            width: "100%",
            height: "44px",
            minHeight: "44px",
            boxSizing: "border-box",
            border: "1px solid #be9f6061",

            "& .MuiOutlinedInput-root": {
              height: "44px",
              minHeight: "44px",
              borderRadius: "4px",
              boxSizing: "border-box",
            },

            "& .MuiSelect-select": {
              height: "44px",
              minHeight: "44px",
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
              paddingTop: "0px",
              paddingBottom: "0px",
              paddingLeft: "14px",
              paddingRight: "32px"
            },

            "& .MuiOutlinedInput-notchedOutline": {
              border:
                "1px solid #be9f6061 !important"
            },

            "&:hover .MuiOutlinedInput-notchedOutline": {
              border:
                "1px solid #be9f6061 !important"
            },

            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border:
                "1px solid #be9f6061 !important"
            }
          }}
        >

          <MenuItem value="todos">
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

        </Select>

      </Grid>

      <Grid
        size={4}
        sx={{
          marginTop: "0px",
          position: "relative"
        }}
      >

        <Button
          className="search-button"
          variant="contained"
          style={{
            width: "100%",
            minHeight: "44px",
            height: "44px"
          }}
          onClick={
            handleClick
          }
        >

          Buscar Imóveis

          <SearchIcon />

        </Button>

        <Grid
          size={12}
          sx={{
            position: "absolute",
            top: "52px",
            right: 0,
            margin: 0
          }}
        >

          <div
            style={{
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
                  "2px 0"
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

      {renderAppliedFilters()}

    </Grid>

  );
};

export default DesktopFilters;