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
   * Sem filtros:
   *
   * 1. Mantemos a consulta geral original, que traz
   *    normalmente Venda, Aluguel e demais imóveis.
   *
   * 2. Fazemos uma consulta independente somente para
   *    os 3 lançamentos mais recentes.
   *
   * Dessa forma, os lançamentos não dependem de estarem
   * entre os 25 imóveis gerais retornados pela primeira
   * consulta.
   */

  if (!hasActiveFilters(filters)) {

    const params =
      new URLSearchParams();


    const currentPage =
      Number(page) > 0
        ? Number(page)
        : 1;


    /*
     * ---------------------------------------------------
     * CONSULTA GERAL
     * ---------------------------------------------------
     *
     * IMPORTANTE:
     *
     * Não existe filtro por Tipo_de_Anuncio aqui.
     *
     * Esta é a consulta que já funcionava anteriormente
     * e trazia os imóveis de Venda e Aluguel normalmente.
     */

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


    /*
     * ---------------------------------------------------
     * ORDENAÇÃO
     * ---------------------------------------------------
     */

    params.set(
      "sort[0]",
      "publishedAt:desc"
    );


    params.set(
      "sort[1]",
      "id:desc"
    );


    /*
     * ---------------------------------------------------
     * REQUEST GERAL
     * ---------------------------------------------------
     */

    const generalRequest =
      utils.GetAPI(
        `Anuncios/?${params.toString()}`
      );


    /*
     * =================================================
     * CONSULTA DOS LANÇAMENTOS
     * =================================================
     *
     * Busca exclusivamente os 3 lançamentos mais
     * recentes.
     */

    const launchParams =
      new URLSearchParams();


    launchParams.set(
      "pagination[page]",
      1
    );


    launchParams.set(
      "pagination[pageSize]",
      3
    );


    launchParams.set(
      "populate",
      "*"
    );


    launchParams.set(
      "filters[Tipo_de_Anuncio][$eq]",
      "Lançamentos"
    );


    launchParams.set(
      "sort[0]",
      "publishedAt:desc"
    );


    launchParams.set(
      "sort[1]",
      "id:desc"
    );


    const launchRequest =
      utils.GetAPI(
        `Anuncios/?${launchParams.toString()}`
      );


    /*
     * ---------------------------------------------------
     * EXECUTA AS DUAS CONSULTAS EM PARALELO
     * ---------------------------------------------------
     */

    const [
      generalResponse,
      launchResponse
    ] = await Promise.all([
      generalRequest,
      launchRequest
    ]);


    /*
     * ---------------------------------------------------
     * DADOS GERAIS
     * ---------------------------------------------------
     */

    const generalData =
      Array.isArray(
        generalResponse?.data
      )
        ? generalResponse.data
        : [];


    /*
     * ---------------------------------------------------
     * DADOS DOS LANÇAMENTOS
     * ---------------------------------------------------
     */

    const launchData =
      Array.isArray(
        launchResponse?.data
      )
        ? launchResponse.data
        : [];


    /*
     * =================================================
     * IDENTIFICA OS IMÓVEIS JÁ EXISTENTES
     * =================================================
     */

    const existingIds =
      new Set();


    generalData.forEach(
      (item) => {

        const itemId =
          item?.documentId ??
          item?.id;


        if (
          itemId !== undefined &&
          itemId !== null
        ) {

          existingIds.add(
            itemId
          );

        }

      }
    );


    /*
     * =================================================
     * ADICIONA SOMENTE LANÇAMENTOS NOVOS
     * =================================================
     */

    const additionalLaunches =
      launchData.filter(
        (item) => {

          const itemId =
            item?.documentId ??
            item?.id;


          if (
            itemId === undefined ||
            itemId === null
          ) {

            return true;

          }


          return !existingIds.has(
            itemId
          );

        }
      );


    /*
     * =================================================
     * RESULTADO FINAL
     * =================================================
     *
     * Primeiro permanecem exatamente os imóveis da
     * consulta geral.
     *
     * Depois acrescentamos os lançamentos que não
     * estavam nessa primeira página.
     */

    const combinedData = [
      ...generalData,
      ...additionalLaunches
    ];


    /*
     * ---------------------------------------------------
     * RETORNO
     * ---------------------------------------------------
     */

    return {

      data:
        combinedData,

      meta:
        generalResponse?.meta || {

          pagination: {

            page:
              currentPage,

            pageSize:
              25,

            pageCount:
              1,

            total:
              combinedData.length

          }

        }

    };

  }


  /*
   * ===================================================
   * BUSCA COM FILTROS
   * ===================================================
   *
   * Quando existem filtros:
   *
   * - Busca todos os resultados correspondentes.
   * - Usa até 100 registros por página.
   * - Percorre todas as páginas.
   * - Junta tudo em uma única lista.
   */

  const firstParams =
    new URLSearchParams();


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
    "publishedAt:desc"
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
        "publishedAt:desc"
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