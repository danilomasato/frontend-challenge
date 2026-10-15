import React from "react";

import {
  Box,
  Button,
  TextField,
  MenuItem,
  Chip
} from "@mui/material";

import Autocomplete from "@mui/material/Autocomplete";

import { NumericFormat } from "react-number-format";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import LocationPinIcon from "@mui/icons-material/LocationOn";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";

const MobileFilters = ({
  isMobile,
  mobileSearchOpen,
  setMobileSearchOpen,

  imoveis,
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
  removePriceFilter,

  MobileNumericTextField
}) => {

  if (!isMobile) {
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
          gap: "8px",
          marginTop: "10px",
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
            overflowX: "auto",
            overflowY: "hidden",
            minWidth: 0,
            flex: 1,
            paddingBottom: "2px",

            scrollbarWidth: "thin",

            "&::-webkit-scrollbar": {
              height: "3px"
            },

            "&::-webkit-scrollbar-thumb": {
              borderRadius: "10px",
              backgroundColor:
                "rgba(0,0,0,.16)"
            }
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
    <>

      {mobileSearchOpen && (

        <div
          className="mobile-search-overlay"
          onClick={() =>
            setMobileSearchOpen(false)
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

        <div
          className="mobile-search-header"
        >

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
                  option =>
                    option?.label || ""
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
                  params => (

                    <TextField
                      {...params}
                      label="Selecione o Bairro"
                      inputProps={{
                        ...params.inputProps,
                        readOnly: isMobile
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
                MobileNumericTextField
              }
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              fullWidth
              label="Valor Mínimo"
              variant="outlined"
              type="tel"
              inputMode="numeric"
              inputProps={{
                inputMode:
                  "numeric",
                pattern:
                  "[0-9]*",
                enterKeyHint:
                  "search",
                type: "tel"
              }}
            />

          </Box>

          <Box
            className="wrap-input"
          >

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
                MobileNumericTextField
              }
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              fullWidth
              label="Valor Máximo"
              variant="outlined"
              type="tel"
              inputMode="numeric"
              inputProps={{
                inputMode:
                  "numeric",
                pattern:
                  "[0-9]*",
                enterKeyHint:
                  "search",
                type: "tel"
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
            onClick={
              handleClick
            }
          >

            Buscar Imóveis

            <SearchIcon />

          </Button>

          <Button
            variant="text"
            onClick={
              resetFilters
            }
            style={{
              width: "100%",
              marginTop: "6px",
              textTransform: "none",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              whiteSpace: "nowrap"
            }}
          >

            <AutorenewIcon
              style={{
                fontSize: "18px"
              }}
            />

            Limpar filtros

          </Button>

          {renderAppliedFilters()}

        </div>

      </div>

    </>
  );
};

export default MobileFilters;