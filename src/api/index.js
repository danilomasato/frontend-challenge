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
 *
 * IMPORTANTE:
 *
 * Valor_Venda e Valor_Aluguel são campos TEXT no Strapi.
 *
 * Portanto NÃO utilizamos:
 *
 * filters[Valor_Venda][$gte]
 * filters[Valor_Venda][$lte]
 * filters[Valor_Aluguel][$gte]
 * filters[Valor_Aluguel][$lte]
 *
 * A comparação de preço é feita posteriormente em
 * JavaScript, convertendo os valores para Number().
 *
 * O Strapi continua responsável pelos filtros que ele
 * consegue executar corretamente:
 *
 * - Bairro
 * - Tipo_de_Anuncio
 *
 * =====================================================
 */

const buildFilterParams = (
  params,
  filters = {},
  forcedCategory = null
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

  const categoriaAplicada =
    forcedCategory !== null
      ? forcedCategory
      : categoria;

  const categoriaAplicadaNormalizada =
    typeof categoriaAplicada === "string"
      ? categoriaAplicada.toLowerCase()
      : "";

  if (
    categoriaAplicada &&
    categoriaAplicadaNormalizada !== "todos"
  ) {
    params.set(
      "filters[Tipo_de_Anuncio][$eq]",
      categoriaAplicada
    );
  }

  /*
   * ---------------------------------------------------
   * PREÇO
   * ---------------------------------------------------
   *
   * NÃO adicionamos filtros de preço na URL.
   *
   * Valor_Venda e Valor_Aluguel são TEXT no Strapi.
   *
   * A comparação será feita posteriormente no
   * JavaScript.
   */
};

/*
 * =====================================================
 * CONVERSÃO DE VALOR MONETÁRIO
 * =====================================================
 */

const parsePriceValue = (value) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  if (typeof value === "number") {
    return Number.isFinite(value)
      ? value
      : null;
  }

  let stringValue = String(value).trim();

  if (!stringValue) {
    return null;
  }

  /*
   * Remove moeda, espaços e caracteres externos.
   */

  stringValue = stringValue
    .replace(/R\$/gi, "")
    .replace(/\s/g, "")
    .trim();

  if (!stringValue) {
    return null;
  }

  /*
   * ---------------------------------------------------
   * PONTO + VÍRGULA
   * ---------------------------------------------------
   *
   * Exemplo:
   *
   * 1.290,50
   */

  if (
    stringValue.includes(".") &&
    stringValue.includes(",")
  ) {
    stringValue = stringValue
      .replace(/\./g, "")
      .replace(",", ".");
  }

  /*
   * ---------------------------------------------------
   * SOMENTE VÍRGULA
   * ---------------------------------------------------
   */

  else if (
    stringValue.includes(",")
  ) {
    stringValue = stringValue.replace(
      ",",
      "."
    );
  }

  /*
   * ---------------------------------------------------
   * SOMENTE PONTO
   * ---------------------------------------------------
   */

  else if (
    stringValue.includes(".")
  ) {
    const dotCount =
      (
        stringValue.match(/\./g) || []
      ).length;

    if (dotCount > 1) {
      stringValue =
        stringValue.replace(
          /\./g,
          ""
        );
    } else {
      const parts =
        stringValue.split(".");

      const integerPart =
        parts[0] || "";

      const decimalPart =
        parts[1] || "";

      if (
        decimalPart.length === 3 &&
        integerPart.length >= 1
      ) {
        stringValue =
          `${integerPart}${decimalPart}`;
      }
    }
  }

  const parsed =
    Number(stringValue);

  return Number.isFinite(parsed)
    ? parsed
    : null;
};

/*
 * =====================================================
 * FILTRO NUMÉRICO DE PREÇO
 * =====================================================
 */

const filterDataByPrice = (
  data = [],
  filters = {}
) => {
  if (!Array.isArray(data)) {
    return [];
  }

  const min =
    Number(filters?.min) || 0;

  const max =
    Number(filters?.max) || 0;

  /*
   * Se não existe preço, não precisamos filtrar
   * por preço.
   */

  if (
    min <= 0 &&
    max <= 0
  ) {
    return data;
  }

  return data.filter(
    (item) => {
      const categoria =
        typeof item?.Tipo_de_Anuncio === "string"
          ? item.Tipo_de_Anuncio
              .trim()
              .toLowerCase()
          : "";

      /*
       * -------------------------------------------------
       * LANÇAMENTOS
       * -------------------------------------------------
       */

      if (
        categoria === "lançamentos" ||
        categoria === "lancamentos"
      ) {
        return false;
      }

      /*
       * -------------------------------------------------
       * VENDA
       * -------------------------------------------------
       */

      if (
        categoria === "venda"
      ) {
        const valorVenda =
          parsePriceValue(
            item?.Valor_Venda
          );

        if (
          valorVenda === null
        ) {
          return false;
        }

        if (
          min > 0 &&
          valorVenda < min
        ) {
          return false;
        }

        if (
          max > 0 &&
          valorVenda > max
        ) {
          return false;
        }

        return true;
      }

      /*
       * -------------------------------------------------
       * ALUGUEL
       * -------------------------------------------------
       */

      if (
        categoria === "aluguel"
      ) {
        const valorAluguel =
          parsePriceValue(
            item?.Valor_Aluguel
          );

        if (
          valorAluguel === null
        ) {
          return false;
        }

        if (
          min > 0 &&
          valorAluguel < min
        ) {
          return false;
        }

        if (
          max > 0 &&
          valorAluguel > max
        ) {
          return false;
        }

        return true;
      }

      /*
       * Qualquer outro tipo de anúncio não participa
       * do filtro de preço.
       */

      return false;
    }
  );
};

/*
 * =====================================================
 * ORDENAÇÃO PADRÃO DOS RESULTADOS
 * =====================================================
 */

const sortByPublishedDate =
  (data = []) => {
    return [
      ...data
    ].sort(
      (a, b) => {
        const dateA =
          new Date(
            a?.publishedAt || 0
          ).getTime();

        const dateB =
          new Date(
            b?.publishedAt || 0
          ).getTime();

        if (
          dateB !== dateA
        ) {
          return dateB - dateA;
        }

        const idA =
          Number(
            a?.id
          ) || 0;

        const idB =
          Number(
            b?.id
          ) || 0;

        return idB - idA;
      }
    );
  };

/*
 * =====================================================
 * REMOVE DUPLICADOS
 * =====================================================
 */

const removeDuplicates = (
  data = []
) => {
  const uniqueData = [];
  const uniqueIds = new Set();

  for (
    const item of data
  ) {
    const itemId =
      item?.documentId ??
      item?.id;

    if (
      itemId === undefined ||
      itemId === null
    ) {
      uniqueData.push(
        item
      );
      continue;
    }

    if (
      uniqueIds.has(
        itemId
      )
    ) {
      continue;
    }

    uniqueIds.add(
      itemId
    );

    uniqueData.push(
      item
    );
  }

  return uniqueData;
};

/*
 * =====================================================
 * BUSCA TODOS OS DADOS NECESSÁRIOS PARA FILTROS
 * =====================================================
 */

const getFilteredData = async (
  filters = {}
) => {
  const searchPageSize = 100;

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
    searchPageSize
  );

  firstParams.set(
    "populate",
    "*"
  );

  firstParams.set(
    "sort[0]",
    "publishedAt:desc"
  );

  firstParams.set(
    "sort[1]",
    "id:desc"
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
    Array.isArray(
      firstResponse?.data
    )
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
   * ---------------------------------------------------
   * DEMAIS PÁGINAS
   * ---------------------------------------------------
   */

  if (
    pageCount > 1
  ) {
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
        "sort[0]",
        "publishedAt:desc"
      );

      params.set(
        "sort[1]",
        "id:desc"
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

  allData =
    removeDuplicates(
      allData
    );

  return allData;
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
   * LOG DE TESTE
   * ===================================================
   *
   * Verifica exatamente o que o Home.js está enviando
   * para o getArticles().
   */

  console.log(
    "FILTRO RECEBIDO NO getArticles:",
    {
      bairro: filters?.bairro,
      categoria: filters?.categoria,
      min: filters?.min,
      max: filters?.max
    }
  );

  /*
   * ===================================================
   * BUSCA NORMAL
   * ===================================================
   */

  if (
    !hasActiveFilters(filters)
  ) {
    const params =
      new URLSearchParams();

    const currentPage =
      Number(page) > 0
        ? Number(page)
        : 1;

    /*
     * CONSULTA GERAL
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

    params.set(
      "sort[0]",
      "publishedAt:desc"
    );

    params.set(
      "sort[1]",
      "id:desc"
    );

    const generalRequest =
      utils.GetAPI(
        `Anuncios/?${params.toString()}`
      );

    /*
     * CONSULTA DOS LANÇAMENTOS
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

    const [
      generalResponse,
      launchResponse
    ] = await Promise.all([
      generalRequest,
      launchRequest
    ]);

    const generalData =
      Array.isArray(
        generalResponse?.data
      )
        ? generalResponse.data
        : [];

    const launchData =
      Array.isArray(
        launchResponse?.data
      )
        ? launchResponse.data
        : [];

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

    const combinedData = [
      ...generalData,
      ...additionalLaunches
    ];

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
   */

  const categoria =
    typeof filters?.categoria === "string"
      ? filters.categoria.trim()
      : "";

  const categoriaNormalizada =
    categoria.toLowerCase();

  const min =
    Number(filters?.min) || 0;

  const max =
    Number(filters?.max) || 0;

  /*
   * ===================================================
   * LANÇAMENTOS
   * ===================================================
   */

  if (
    categoriaNormalizada === "lançamentos" ||
    categoriaNormalizada === "lancamentos"
  ) {
    const launchParams =
      new URLSearchParams();

    launchParams.set(
      "pagination[page]",
      1
    );

    launchParams.set(
      "pagination[pageSize]",
      100
    );

    launchParams.set(
      "populate",
      "*"
    );

    launchParams.set(
      "sort",
      "publishedAt:desc"
    );

    buildFilterParams(
      launchParams,
      filters,
      "Lançamentos"
    );

    const launchResponse =
      await utils.GetAPI(
        `Anuncios/?${launchParams.toString()}`
      );

    const launchData =
      Array.isArray(
        launchResponse?.data
      )
        ? launchResponse.data
        : [];

    return {
      data:
        launchData,
      meta: {
        pagination: {
          page: 1,
          pageSize:
            launchData.length,
          pageCount: 1,
          total:
            launchData.length
        }
      }
    };
  }

  /*
   * ===================================================
   * BUSCA COM PREÇO
   * ===================================================
   */

  if (
    min > 0 ||
    max > 0
  ) {
    /*
     * ---------------------------------------------------
     * BUSCA TODAS AS PÁGINAS
     * ---------------------------------------------------
     */

    const allData =
      await getFilteredData(
        filters
      );

    /*
     * ---------------------------------------------------
     * FILTRO NUMÉRICO
     * ---------------------------------------------------
     */

    let filteredData =
      filterDataByPrice(
        allData,
        filters
      );

    /*
     * ===================================================
     * LOG DE TESTE
     * ===================================================
     *
     * Verifica:
     *
     * - qual mínimo chegou;
     * - qual máximo chegou;
     * - quantos imóveis existiam antes do filtro;
     * - quantos sobraram depois do filtro.
     */

    console.log(
      "PREÇO:",
      {
        min,
        max,
        totalAntes:
          allData.length,
        totalDepois:
          filteredData.length
      }
    );

    /*
     * ---------------------------------------------------
     * ORDENAÇÃO
     * ---------------------------------------------------
     */

    filteredData =
      sortByPublishedDate(
        filteredData
      );

    /*
     * ---------------------------------------------------
     * REMOVE DUPLICADOS
     * ---------------------------------------------------
     */

    filteredData =
      removeDuplicates(
        filteredData
      );

    return {
      data:
        filteredData,
      meta: {
        pagination: {
          page: 1,
          pageSize:
            filteredData.length,
          pageCount: 1,
          total:
            filteredData.length
        }
      }
    };
  }

  /*
   * ===================================================
   * BUSCA COM CATEGORIA, MAS SEM PREÇO
   * ===================================================
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
    Array.isArray(
      firstResponse?.data
    )
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

  if (
    pageCount > 1
  ) {
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

  allData =
    removeDuplicates(
      allData
    );

  return {
    data:
      allData,
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

  if (
    pageCount > 1
  ) {
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

  return Array.from(
    bairrosMap.values()
  ).sort(
    (a, b) =>
      a.localeCompare(
        b,
        "pt-BR",
        {
          sensitivity:
            "base"
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