import React from "react";
import { Container } from "../../components";

const EmptyState = ({
  isLoading,
  hasFilters,
  data,
  resetFilters
}) => {

  if (
    isLoading ||
    !hasFilters ||
    data.length > 0
  ) {
    return null;
  }

  return (

    <Container
      className="empty-state"
    >

      <div
        className="empty-state__illustration"
      >

        <div
          className="empty-state__decor"
        >

          <span>
            ✦
          </span>

          <span>
            +
          </span>

          <span>
            ✦
          </span>

        </div>

        <div
          className="empty-state__icon"
        />

      </div>

      <div
        className="empty-state__content"
      >

        <div
          className="empty-state__tag"
        >
          Ops, nada por aqui
        </div>

        <h2
          className="empty-state__title"
        >
          Não encontramos mais
          resultados.
        </h2>

        <p
          className="empty-state__description"
        >
          Não encontramos mais imóveis
          com os filtros aplicados.
          Tente ampliar sua busca ou
          remover alguns filtros para
          visualizar mais oportunidades.
        </p>

        <button
          className="empty-state__button"
          onClick={resetFilters}
        >
          🧹 Limpar filtros
        </button>

      </div>

    </Container>

  );

};

export default EmptyState;