import React, { useState, useEffect } from "react";
import "./Card.css";

import PropertyCarousel from "../PropertyCarousel";

export default function MultiActionAreaCard(props) {

  //first load
  const articles = props.data?.character?.data || [];

  let sales = articles.filter(
    item => item.Tipo_de_Anuncio === "venda"
  );

  let rents = articles.filter(
    item => item.Tipo_de_Anuncio?.includes("aluguel")
  );

  let launches = articles.filter(
    item => item.Tipo_de_Anuncio?.includes("Lançamentos")
  );

  const chunkArray = (array, size = 6) => {
    const chunks = [];

    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }

    return chunks;
  };

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
  )
}