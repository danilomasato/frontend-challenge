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
 * CONSTRUÇÃO DOS FILTROS
 * =====================================================
 */

const buildFilterParams = (
  params,
  filters = {}
) => {

  /*
   * ---------------------------------------------------
   * BAIRRO
   * ---------------------------------------------------
   */

  const bairro =
    typeof filters?.bairro === "string"
      ? filters.bairro.trim()
      : "";


  if (bairro) {

    params.set(
      "filters[Bairro][$containsi]",
      bairro
    );

  }


  /*
   * ---------------------------------------------------
   * CATEGORIA
   * ---------------------------------------------------
   */

  const categoria =
    typeof filters?.categoria === "string"
      ? filters.categoria.trim()
      : "";


  if (
    categoria &&
    categoria.toLowerCase() !== "todos"
  ) {

    params.set(
      "filters[Tipo_de_Anuncio][$eq]",
      categoria
    );

  }


  /*
   * ---------------------------------------------------
   * VALOR MÍNIMO
   * ---------------------------------------------------
   */

  const min =
    Number(filters?.min) || 0;


  if (min > 0) {

    params.set(
      "filters[$or][0][Valor_Venda][$gte]",
      min
    );


    params.set(
      "filters[$or][1][Valor_Aluguel][$gte]",
      min
    );

  }


  /*
   * ---------------------------------------------------
   * VALOR MÁXIMO
   * ---------------------------------------------------
   */

  const max =
    Number(filters?.max) || 0;


  if (max > 0) {

    params.set(
      "filters[$or][0][Valor_Venda][$lte]",
      max
    );


    params.set(
      "filters[$or][1][Valor_Aluguel][$lte]",
      max
    );

  }

};


/*
 * =====================================================
 * VERIFICA SE EXISTE ALGUM FILTRO
 * =====================================================
 */

const hasActiveFilters = (
  filters = {}
) => {

  const bairro =
    typeof filters?.bairro === "string"
      ? filters.bairro.trim()
      : "";


  const categoria =
    typeof filters?.categoria === "string"
      ? filters.categoria.trim()
      : "";


  const min =
    Number(filters?.min) || 0;


  const max =
    Number(filters?.max) || 0;


  return Boolean(
    bairro ||
    (
      categoria &&
      categoria.toLowerCase() !== "todos"
    ) ||
    min > 0 ||
    max > 0
  );

};


/*
 * =====================================================
 * IMÓVEIS PAGINADOS / BUSCA
 * =====================================================
 *
 * SEM FILTROS:
 *
 * Mantém o comportamento atual:
 *
 * - 25 imóveis por página
 * - paginação normal
 *
 *
 * COM FILTROS:
 *
 * A consulta passa a buscar TODOS os imóveis
 * correspondentes aos filtros.
 *
 * Os resultados são reunidos antes de serem
 * devolvidos ao Home.
 *
 * Isso evita o problema de procurar, por exemplo,
 * "Sabará" somente dentro dos 25 imóveis da página.
 */

export const getArticles = async (
  page = 1,
  filters = {}
) => {

  /*
   * ===================================================
   * BUSCA NORMAL
   * ===================================================
   *
   * Nenhum filtro:
   * continua usando a paginação normal.
   */

  if (!hasActiveFilters(filters)) {

    const params =
      new URLSearchParams();


    const currentPage =
      Number(page) > 0
        ? Number(page)
        : 1;


    params.set(
      "pagination[page]",
      currentPage
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


    return utils.GetAPI(
      `Anuncios/?${params.toString()}`
    );

  }


  /*
   * ===================================================
   * BUSCA COM FILTROS
   * ===================================================
   *
   * Aqui NÃO usamos a paginação de 25 imóveis.
   *
   * Primeiro buscamos a quantidade total de páginas
   * disponíveis para os filtros.
   *
   * Depois buscamos todas elas em paralelo e juntamos
   * os resultados.
   */


  const firstParams =
    new URLSearchParams();


  /*
   * Usamos um tamanho alto apenas para descobrir
   * rapidamente a quantidade de resultados.
   *
   * A função continua buscando todas as páginas caso
   * existam mais resultados.
   */

  const searchPageSize = 100;


  firstParams.set(
    "pagination[page]",
    1
  );


  firstParams.set(
    "pagination[pageSize]",
    searchPageSize
  );


  firstParams.set(
    "populate",
    "*"
  );


  firstParams.set(
    "sort",
    "sortOrder:asc"
  );


  buildFilterParams(
    firstParams,
    filters
  );


  const firstResponse =
    await utils.GetAPI(
      `Anuncios/?${firstParams.toString()}`
    );


  const firstData =
    Array.isArray(firstResponse?.data)
      ? firstResponse.data
      : [];


  const firstPagination =
    firstResponse?.meta?.pagination || {};


  const pageCount =
    Number(
      firstPagination?.pageCount
    ) || 1;


  /*
   * Se já couberam todos os resultados na primeira
   * consulta, não precisamos fazer outras requisições.
   */

  let allData = [
    ...firstData
  ];


  /*
   * ===================================================
   * BUSCA DAS DEMAIS PÁGINAS
   * ===================================================
   */

  if (pageCount > 1) {

    const requests = [];


    for (
      let currentPage = 2;
      currentPage <= pageCount;
      currentPage++
    ) {

      const params =
        new URLSearchParams();


      params.set(
        "pagination[page]",
        currentPage
      );


      params.set(
        "pagination[pageSize]",
        searchPageSize
      );


      params.set(
        "populate",
        "*"
      );


      params.set(
        "sort",
        "sortOrder:asc"
      );


      buildFilterParams(
        params,
        filters
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
   * ===================================================
   * RESULTADO FINAL DA BUSCA
   * ===================================================
   *
   * Agora todos os imóveis encontrados pertencem a
   * uma única lista.
   *
   * O Home recebe pageCount = 1 porque os resultados
   * filtrados serão exibidos juntos.
   */

  return {

    data: allData,

    meta: {

      pagination: {

        page: 1,

        pageSize:
          allData.length,

        pageCount: 1,

        total:
          allData.length

      }

    }

  };

};


/*
 * =====================================================
 * TODOS OS BAIRROS
 * =====================================================
 *
 * Esta função é independente da busca dos Cards.
 *
 * Ela percorre TODAS as páginas da API e coleta somente
 * o campo Bairro.
 */

export const getAllBairros = async () => {

  const pageSize = 100;


  /*
   * ---------------------------------------------------
   * PRIMEIRA PÁGINA
   * ---------------------------------------------------
   */

  const firstParams =
    new URLSearchParams();


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


  const allData = [
    ...(firstResponse?.data || [])
  ];


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