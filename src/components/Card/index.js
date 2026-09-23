import React from "react";
import "./Card.css";

import PropertyCarousel from "../PropertyCarousel";

export default function MultiActionAreaCard(props) {
  const articles = props.data?.character?.data || [];

  const normalizeType = (value) => {
    return String(value || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  /*
   * ---------------------------------------------------
   * SEPARA OS IMÓVEIS POR TIPO
   * ---------------------------------------------------
   *
   * A separação acontece tanto na Home normal quanto
   * quando existem filtros ativos.
   *
   * Os filtros já foram aplicados pela API.
   * Aqui apenas organizamos os resultados em seus
   * respectivos carrosséis.
   */

  const sales = articles.filter((item) => {
    const type = normalizeType(
      item?.Tipo_de_Anuncio
    );

    return type.includes("venda");
  });

  const rents = articles.filter((item) => {
    const type = normalizeType(
      item?.Tipo_de_Anuncio
    );

    return type.includes("aluguel");
  });

  const launches = articles.filter((item) => {
    const type = normalizeType(
      item?.Tipo_de_Anuncio
    );

    return type.includes("lancamento");
  });

  return (
    <>
      {sales.length > 0 && (
        <PropertyCarousel
          title="Imóveis à Venda"
          items={sales}
        />
      )}

      {rents.length > 0 && (
        <PropertyCarousel
          title="Imóveis para Alugar"
          items={rents}
        />
      )}

      {launches.length > 0 && (
        <PropertyCarousel
          title="Lançamentos"
          items={launches}
        />
      )}
    </>
  );
}