import React from "react";

const gradientTextStyle = {
  backgroundImage: "linear-gradient(90deg, #1687E8 0%, #7656D9 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text"
};

const ResultSummary = ({
  isMobile,
  hasFilters,
  category,
  search,
  pagination,
  data
}) => {

  const total =
    pagination?.total ??
    data?.length ??
    0;

  if (!isMobile) {

    return (

      <div
        className="row"
        style={{
          margin: "0"
        }}
      >

        <div
          className="center"
          style={{
            position: "relative"
          }}
        >

          <span
            className="breadcrumb"
          >

            <span>
              Imóveis
            </span>

            <span
              className="breadcrumb-separator"
            >
              ›
            </span>

            {hasFilters &&
              category &&
              category !== "todos" && (

                <>

                  <span>

                    {category
                      .charAt(0)
                      .toUpperCase() +
                      category.slice(1)}

                  </span>

                  <span
                    className="breadcrumb-separator"
                  >
                    ›
                  </span>

                </>

              )}

            <span>

              {!search?.label ? (

                <strong
                  style={gradientTextStyle}
                >
                  São Paulo
                </strong>

              ) : (

                "São Paulo"

              )}

            </span>

            {hasFilters &&
              search?.label && (

                <>

                  <span
                    className="breadcrumb-separator"
                  >
                    ›
                  </span>

                  <strong
                    style={gradientTextStyle}
                  >
                    {search.label}
                  </strong>

                </>

              )}

          </span>

          <div
            className="found-properties"
          >

            <strong
              style={gradientTextStyle}
            >
              {total}
            </strong>

            <span
              style={{
                marginLeft: "2px"
              }}
            >
              imóveis encontrados
            </span>

          </div>

        </div>

      </div>

    );

  }

  return (

    <div
      className="mobile-results-summary"
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "10px 16px 12px",
        margin: "0",
        display: "block"
      }}
    >

      <div
        className="mobile-results-breadcrumb"
        style={{
          width: "100%",
          boxSizing: "border-box",
          display: "block",
          margin: "0",
          padding: "0",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          fontSize: "13px",
          lineHeight: "20px",
          color: "rgba(0,0,0,.52)"
        }}
      >

        <span>
          Imóveis
        </span>

        <span
          style={{
            margin: "0 6px",
            color:
              "rgba(36,122,200,.55)"
          }}
        >
          ›
        </span>

        {hasFilters &&
          category &&
          category !== "todos" && (

            <>

              <span>

                {category
                  .charAt(0)
                  .toUpperCase() +
                  category.slice(1)}

              </span>

              <span
                style={{
                  margin: "0 6px",
                  color:
                    "rgba(36,122,200,.55)"
                }}
              >
                ›
              </span>

            </>

          )}

        <span
          style={gradientTextStyle}
        >
          São Paulo
        </span>

        {hasFilters &&
          search?.label && (

            <>

              <span
                style={{
                  margin: "0 6px",
                  color:
                    "rgba(36,122,200,.55)"
                }}
              >
                ›
              </span>

              <span
                style={gradientTextStyle}
              >
                {search.label}
              </span>

            </>

          )}

      </div>

      <div
        className="mobile-found-properties"
        style={{
          width: "100%",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "baseline",
          margin: "4px 0 10px",
          padding: "0",
          fontSize: "13px",
          lineHeight: "21px",
          color: "rgba(0,0,0,.52)"
        }}
      >

        <strong
          style={{
            ...gradientTextStyle,
            fontSize: "16px",
            fontWeight: 700
          }}
        >
          {total}
        </strong>

        <span
          style={{
            marginLeft: "2px"
          }}
        >
          imóveis encontrados
        </span>

      </div>

    </div>

  );

};

export default ResultSummary;