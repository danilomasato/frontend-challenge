import * as utils from "../utils";


/*
 * =====================================================
 * DADOS DE UM IMÓVEL
 * =====================================================
 */

export const getCharacterData = (id) =>
  utils.GetAPI(
    !id
      ? "Anuncios?populate=*"
      : `Anuncios/?filters[id][$eq]=${id}&populate=*`
  );


/*
 * =====================================================
 * IMÓVEIS PAGINADOS
 * =====================================================
 *
 * Esta função continua sendo usada pelos Cards.
 *
 * IMPORTANTE:
 * A paginação continua com 25 imóveis por página.
 *
 * Não alteramos essa lógica para não interferir
 * no funcionamento atual da paginação.
 */

export const getArticles = (
  page = 1,
  filters = {}
) => {

  const params = new URLSearchParams();


  params.set(
    "pagination[page]",
    page
  );


  params.set(
    "pagination[pageSize]",
    25
  );


  params.set(
    "populate",
    "*"
  );


  params.set(
    "sort",
    "sortOrder:asc"
  );


  /*
   * ===================================================
   * BAIRRO
   * ===================================================
   */

  if (filters?.bairro) {

    params.set(
      "filters[Bairro][$containsi]",
      filters.bairro
    );

  }


  /*
   * ===================================================
   * CATEGORIA
   * ===================================================
   */

  if (
    filters?.categoria &&
    filters.categoria !== "todos"
  ) {

    params.set(
      "filters[Tipo_de_Anuncio][$eq]",
      filters.categoria
    );

  }


  /*
   * ===================================================
   * VALOR MÍNIMO
   * ===================================================
   */

  if (filters?.min > 0) {

    params.set(
      "filters[$or][0][Valor_Venda][$gte]",
      filters.min
    );


    params.set(
      "filters[$or][1][Valor_Aluguel][$gte]",
      filters.min
    );

  }


  /*
   * ===================================================
   * VALOR MÁXIMO
   * ===================================================
   */

  if (filters?.max > 0) {

    params.set(
      "filters[$or][0][Valor_Venda][$lte]",
      filters.max
    );


    params.set(
      "filters[$or][1][Valor_Aluguel][$lte]",
      filters.max
    );

  }


  return utils.GetAPI(
    `Anuncios/?${params.toString()}`
  );

};


/*
 * =====================================================
 * TODOS OS BAIRROS
 * =====================================================
 *
 * Esta função é independente da paginação dos Cards.
 *
 * Ela percorre TODAS as páginas da API e coleta somente
 * o campo Bairro.
 *
 * Dessa forma:
 *
 * Página 1 -> bairros
 * Página 2 -> bairros
 * Página 3 -> bairros
 * Página N -> bairros
 *
 * Tudo é reunido em uma única lista.
 */

export const getAllBairros = async () => {

  const pageSize = 100;


  /*
   * ---------------------------------------------------
   * PRIMEIRA PÁGINA
   * ---------------------------------------------------
   *
   * Buscamos somente o campo Bairro para evitar
   * carregar imagens e demais campos dos imóveis.
   */

  const firstParams = new URLSearchParams();


  firstParams.set(
    "pagination[page]",
    1
  );


  firstParams.set(
    "pagination[pageSize]",
    pageSize
  );


  firstParams.set(
    "fields[0]",
    "Bairro"
  );


  const firstResponse =
    await utils.GetAPI(
      `Anuncios/?${firstParams.toString()}`
    );


  /*
   * Guarda os dados encontrados na primeira página.
   */

  const allData = [
    ...(firstResponse?.data || [])
  ];


  /*
   * Quantidade total de páginas.
   */

  const pageCount =
    Number(
      firstResponse?.meta?.pagination?.pageCount
    ) || 1;


  /*
   * ---------------------------------------------------
   * DEMAIS PÁGINAS
   * ---------------------------------------------------
   */

  if (pageCount > 1) {

    const requests = [];


    for (
      let page = 2;
      page <= pageCount;
      page++
    ) {

      const params =
        new URLSearchParams();


      params.set(
        "pagination[page]",
        page
      );


      params.set(
        "pagination[pageSize]",
        pageSize
      );


      params.set(
        "fields[0]",
        "Bairro"
      );


      requests.push(
        utils.GetAPI(
          `Anuncios/?${params.toString()}`
        )
      );

    }


    const responses =
      await Promise.all(
        requests
      );


    for (
      const response of responses
    ) {

      if (
        Array.isArray(
          response?.data
        )
      ) {

        allData.push(
          ...response.data
        );

      }

    }

  }


  /*
   * ---------------------------------------------------
   * REMOVE DUPLICADOS
   * ---------------------------------------------------
   */

  const bairrosMap =
    new Map();


  for (
    const item of allData
  ) {

    const bairro =
      item?.Bairro;


    if (
      typeof bairro !== "string"
    ) {

      continue;

    }


    const normalized =
      bairro.trim();


    if (!normalized) {
      continue;
    }


    /*
     * A chave em lowercase evita duplicados
     * como:
     *
     * "Centro"
     * "centro"
     * "CENTRO"
     */

    const key =
      normalized.toLowerCase();


    if (
      !bairrosMap.has(key)
    ) {

      bairrosMap.set(
        key,
        normalized
      );

    }

  }


  /*
   * ---------------------------------------------------
   * RETORNA LISTA ORDENADA
   * ---------------------------------------------------
   */

  return Array.from(
    bairrosMap.values()
  ).sort(
    (a, b) =>
      a.localeCompare(
        b,
        "pt-BR",
        {
          sensitivity: "base"
        }
      )
  );

};


/*
 * =====================================================
 * AUTHORS
 * =====================================================
 */

export const getAuthors = (id) =>
  utils.GetAPI(
    id
      ? "Anuncios"
      : "Anuncios?populate=*"
  );


/*
 * =====================================================
 * CACHE DE IMÓVEIS
 * =====================================================
 */

export const getImoveisCache = (id) =>
  utils.GetNewAPI(
    "https://tudosobreap.com.br/Articles.json"
  );