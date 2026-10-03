import React from "react";

import {
  Box,
  Button,
  TextField,
  MenuItem
} from "@mui/material";

import Autocomplete from "@mui/material/Autocomplete";

import { NumericFormat } from "react-number-format";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import LocationPinIcon from "@mui/icons-material/LocationOn";
import AutorenewIcon from "@mui/icons-material/Autorenew";

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
  handlePriceKeyDown,
  handlePriceBlur,

  handleClick,
  resetFilters,

  MobileNumericTextField
}) => {

  if (!isMobile) {
    return null;
  }

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
                  (option) =>
                    option?.label || ""
                }
                isOptionEqualToValue={
                  (option, value) =>
                    option.id === value.id
                }
                onChange={
                  (event, value) => {

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
                onClick={resetFilters}
              />

            </Box>

          )}

          <Box
            className="wrap-input"
          >

            <NumericFormat
              value={optionsValue.min}
              onValueChange={
                handlePriceValueChange("min")
              }
              onKeyDown={
                handlePriceKeyDown
              }
              onBlur={() =>
                handlePriceBlur("min")
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
                inputMode: "numeric",
                pattern: "[0-9]*",
                enterKeyHint: "search",
                type: "tel"
              }}
            />

          </Box>

          <Box
            className="wrap-input"
          >

            <NumericFormat
              value={optionsValue.max}
              onValueChange={
                handlePriceValueChange("max")
              }
              onKeyDown={
                handlePriceKeyDown
              }
              onBlur={() =>
                handlePriceBlur("max")
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
                inputMode: "numeric",
                pattern: "[0-9]*",
                enterKeyHint: "search",
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
            onClick={handleClick}
          >

            Buscar Imóveis

            <SearchIcon />

          </Button>

          <Button
            variant="text"
            onClick={resetFilters}
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

        </div>

      </div>
    </>
  );
};

export default MobileFilters;