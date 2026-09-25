import React, { useState, useEffect, useRef } from "react";

import { withRouter, useHistory } from "react-router-dom";
import { connect } from "react-redux";

import { Container } from "../../components";
import CardDetail from "../../components/CardDetail";

import Stack from "@mui/material/Stack";

import { Header } from "../../components/Header";
import { TopInfo } from "../../components/TopInfo";
import { Footer } from "../../components/Footer";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { bindActionCreators } from "redux";

import {
  getAuthors,
  getImoveisCache,
  getCharacterData,
  getArticles
} from "../../actions";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

import {
  Button,
  CardActionArea,
  CardActions
} from "@mui/material";

import SellIcon from "@mui/icons-material/Sell";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import Box from "@mui/material/Box";

import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

import "./DetailImovel.css";

import ThumbSLider from "../../components/ThumbSlider";

import LocationPinIcon from "@mui/icons-material/LocationOn";
import LocationCityIcon from "@mui/icons-material/LocationCity";

import axios from "axios";

import Loading from "../../components/Loading";

import PreloadImovelDetail from "../../components/PreloadImovelDetail";
import PreloadImovelDetailMobile from "../../components/PreloadImovelDetail/Mobile";


function getParameterByName(
  name,
  url = window.location.href
) {
  name = name.replace(
    /[\\[\]]/g,
    "\\$&"
  );

  const regex = new RegExp(
    "[?&]" +
      name +
      "(=([^&#]*)|&|#|$)"
  );

  const results = regex.exec(url);

  if (!results) {
    return null;
  }

  if (!results[2]) {
    return "";
  }

  return decodeURIComponent(
    results[2].replace(
      /\+/g,
      " "
    )
  );
}


/*
 * ==========================================================
 * FUNÇÕES AUXILIARES DA DESCRIÇÃO
 * ==========================================================
 */


/*
 * Obtém todo o texto de um bloco.
 *
 * Funciona tanto para:
 *
 * {
 *   text: "Texto"
 * }
 *
 * quanto para estruturas com children aninhados.
 */
const getChildText = (child) => {
  if (!child) {
    return "";
  }

  if (
    Array.isArray(child.children) &&
    child.children.length > 0
  ) {
    return child.children
      .map((nestedChild) =>
        getChildText(nestedChild)
      )
      .join("");
  }

  if (
    child.text !== undefined &&
    child.text !== null
  ) {
    return String(child.text);
  }

  return "";
};


/*
 * Obtém o texto completo de um bloco do Strapi.
 */
const getBlockText = (block) => {
  if (!block) {
    return "";
  }

  if (
    Array.isArray(block.children)
  ) {
    return block.children
      .map((child) =>
        getChildText(child)
      )
      .join("");
  }

  return getChildText(block);
};


/*
 * Verifica se o texto está vazio.
 */
const isEmptyText = (text) => {
  return !String(
    text || ""
  ).trim();
};


/*
 * Verifica se um texto começa com emoji
 * ou algum símbolo visual.
 *
 * A ideia não é limitar a um emoji específico.
 *
 * Isso permite tratar:
 *
 * 🏋️ Academia
 * 📍 Localização
 * 🚆 Estação
 * 🛍️ Comércio
 * ✨ Destaques
 * etc.
 */
const startsWithVisualIcon = (
  text
) => {
  if (!text) {
    return false;
  }

  const value = String(
    text
  ).trim();

  if (!value) {
    return false;
  }

  /*
   * Emoji / símbolos Unicode.
   */
  const emojiPattern =
    /^[\p{Extended_Pictographic}\p{Emoji_Presentation}\p{Emoji}\uFE0F]/u;

  /*
   * Alguns marcadores comuns.
   */
  const markerPattern =
    /^(?:[-•●▪◦‣∙·*]|(?:\d+[.)]))\s+/;

  return (
    emojiPattern.test(value) ||
    markerPattern.test(value)
  );
};


/*
 * Remove marcadores que já existem.
 *
 * Se o conteúdo vier:
 *
 * - Academia
 * • Academia
 * * Academia
 * 1. Academia
 *
 * não colocamos outro marcador antes.
 */
const removeExistingBullet = (
  text
) => {
  if (!text) {
    return "";
  }

  return String(text)
    .replace(
      /^\s*(?:[•●▪◦‣∙·*-]|\d+[.)])\s*/,
      ""
    )
    .trim();
};


/*
 * Verifica se existe quebra de linha dentro
 * de um bloco.
 */
const hasMultipleLines = (
  children
) => {
  if (!Array.isArray(children)) {
    return false;
  }

  return children.some(
    (child) => {
      const text =
        getChildText(child);

      return (
        text.includes("\n") ||
        text.includes("\r")
      );
    }
  );
};


/*
 * Divide texto em linhas.
 */
const splitTextLines = (
  text
) => {
  if (!text) {
    return [];
  }

  return String(text)
    .replace(
      /\r\n/g,
      "\n"
    )
    .replace(
      /\r/g,
      "\n"
    )
    .split("\n")
    .map(
      (line) =>
        line.trim()
    )
    .filter(
      (line) =>
        line !== ""
    );
};


/*
 * Verifica se um texto parece ser um título
 * ou cabeçalho de uma seção.
 *
 * Exemplos:
 *
 * Destaques do imóvel
 * Características do imóvel
 * Lazer
 * Área de lazer
 * Estrutura
 * Infraestrutura
 */
const isListHeading = (
  text
) => {
  if (!text) {
    return false;
  }

  const value =
    String(text)
      .trim()
      .toLowerCase();

  if (!value) {
    return false;
  }

  return (
    value.includes(
      "destaques"
    ) ||
    value.includes(
      "características"
    ) ||
    value.includes(
      "caracteristicas"
    ) ||
    value.includes(
      "estrutura de lazer"
    ) ||
    value.includes(
      "área de lazer"
    ) ||
    value.includes(
      "area de lazer"
    ) ||
    value === "lazer" ||
    value.includes(
      "infraestrutura"
    ) ||
    value.includes(
      "comodidades"
    ) ||
    value.includes(
      "facilidades"
    )
  );
};


/*
 * Verifica se um texto é muito provavelmente
 * um item curto de característica.
 *
 * Exemplos:
 *
 * 34 m²
 * 2 dormitórios
 * 1 banheiro
 * Portaria 24 horas
 * Condomínio fechado
 * Academia
 * Playground
 */
const isShortFeatureText = (
  text
) => {
  if (!text) {
    return false;
  }

  const value =
    String(text)
      .trim();

  if (!value) {
    return false;
  }

  /*
   * Textos muito grandes normalmente são
   * parágrafos descritivos.
   */
  if (
    value.length > 90
  ) {
    return false;
  }

  /*
   * Se houver pontuação típica de uma
   * frase longa, evitamos transformar em lista.
   */
  const sentencePattern =
    /[.!?]\s+[A-ZÁÀÃÂÉÊÍÓÔÕÚÇ]/;

  if (
    sentencePattern.test(
      value
    )
  ) {
    return false;
  }

  return true;
};


/*
 * Renderização normal dos children.
 */
const renderNormalChildren = (
  children
) => {
  if (!Array.isArray(children)) {
    return null;
  }

  return children.map(
    (
      child,
      childIndex
    ) => {
      if (!child) {
        return null;
      }

      if (
        Array.isArray(
          child.children
        ) &&
        child.children.length > 0
      ) {
        return (
          <React.Fragment
            key={childIndex}
          >
            {renderNormalChildren(
              child.children
            )}
          </React.Fragment>
        );
      }

      const text =
        getChildText(child);

      if (!text) {
        return null;
      }

      return (
        <React.Fragment
          key={childIndex}
        >
          {text}
        </React.Fragment>
      );
    }
  );
};


/*
 * ==========================================================
 * LISTAS NATIVAS
 * ==========================================================
 *
 * Converte uma lista nativa do Strapi
 * em linhas simples.
 */
const collectNativeListItems = (
  children
) => {
  if (!Array.isArray(children)) {
    return [];
  }

  const items = [];

  children.forEach(
    (item) => {
      if (!item) {
        return;
      }

      const text =
        getBlockText(item);

      if (
        text &&
        text.trim()
      ) {
        splitTextLines(
          text
        ).forEach(
          (line) => {
            items.push(
              line
            );
          }
        );

        return;
      }

      if (
        Array.isArray(
          item.children
        )
      ) {
        item.children.forEach(
          (child) => {
            const childText =
              getChildText(
                child
              );

            splitTextLines(
              childText
            ).forEach(
              (line) => {
                items.push(
                  line
                );
              }
            );
          }
        );
      }
    }
  );

  return items;
};


/*
 * ==========================================================
 * AGRUPAMENTO DOS PARÁGRAFOS
 * ==========================================================
 *
 * Esta é a parte principal da nova lógica.
 *
 * O Strapi pode representar uma lista assim:
 *
 * paragraph
 * paragraph
 * paragraph
 * paragraph
 *
 * mesmo quando visualmente aquilo é uma lista.
 *
 * Portanto, analisamos o conjunto dos blocos.
 */
const buildDescriptionBlocks = (
  descricao
) => {
  if (!Array.isArray(descricao)) {
    return [];
  }

  const blocks = [];

  let index = 0;

  while (
    index <
    descricao.length
  ) {
    const current =
      descricao[index];

    if (!current) {
      index++;
      continue;
    }

    /*
     * ------------------------------------------------------
     * LISTA NATIVA DO STRAPI
     * ------------------------------------------------------
     */
    if (
      current.type === "list"
    ) {
      blocks.push({
        type: "visual-list",
        items:
          collectNativeListItems(
            current.children
          ),
        key:
          `native-list-${index}`
      });

      index++;
      continue;
    }

    /*
     * Só analisamos paragraph aqui.
     */
    if (
      current.type !==
      "paragraph"
    ) {
      blocks.push({
        type: "normal",
        block: current,
        key:
          `block-${index}`
      });

      index++;
      continue;
    }

    const currentText =
      getBlockText(current)
        .trim();

    /*
     * Parágrafo vazio.
     *
     * Ele será usado como separador.
     */
    if (
      isEmptyText(
        currentText
      )
    ) {
      blocks.push({
        type: "spacer",
        key:
          `spacer-${index}`
      });

      index++;
      continue;
    }

    /*
     * ------------------------------------------------------
     * LISTA DE ÍCONES
     * ------------------------------------------------------
     *
     * Exemplo:
     *
     * 🏋️ Academia
     * 🛝 Playground
     * 👶 Play baby
     *
     * Pode existir um parágrafo vazio entre os itens.
     */
    if (
      startsWithVisualIcon(
        currentText
      )
    ) {
      const iconItems = [];

      let scan =
        index;

      let emptyCount =
        0;

      while (
        scan <
        descricao.length
      ) {
        const candidate =
          descricao[scan];

        if (
          !candidate ||
          candidate.type !==
            "paragraph"
        ) {
          break;
        }

        const candidateText =
          getBlockText(
            candidate
          ).trim();

        /*
         * Ignora espaços entre itens.
         */
        if (
          isEmptyText(
            candidateText
          )
        ) {
          emptyCount++;

          /*
           * Permitimos alguns vazios,
           * mas não infinitamente.
           */
          if (
            emptyCount <= 2
          ) {
            scan++;
            continue;
          }

          break;
        }

        /*
         * Assim que aparece um texto que não
         * começa com ícone, a lista terminou.
         */
        if (
          !startsWithVisualIcon(
            candidateText
          )
        ) {
          break;
        }

        iconItems.push(
          candidateText
        );

        emptyCount = 0;

        scan++;
      }

      /*
       * Só consideramos como lista quando
       * existem pelo menos 2 itens.
       */
      if (
        iconItems.length >= 2
      ) {
        blocks.push({
          type: "visual-list",
          items: iconItems,
          key:
            `icon-list-${index}`
        });

        index = scan;
        continue;
      }
    }


    /*
     * ------------------------------------------------------
     * LISTA DE CARACTERÍSTICAS
     * ------------------------------------------------------
     *
     * Exemplo:
     *
     * ✨ Destaques do imóvel
     *
     * 34 m²
     *
     * 2 dormitórios
     *
     * 1 banheiro
     *
     * Condomínio fechado
     *
     * ...
     *
     * O título fica separado.
     */
    if (
      isListHeading(
        currentText
      )
    ) {
      blocks.push({
        type: "normal",
        block: current,
        key:
          `heading-${index}`
      });

      const featureItems = [];

      let scan =
        index + 1;

      let emptyCount =
        0;

      while (
        scan <
        descricao.length
      ) {
        const candidate =
          descricao[scan];

        if (
          !candidate ||
          candidate.type !==
            "paragraph"
        ) {
          break;
        }

        const candidateText =
          getBlockText(
            candidate
          ).trim();

        /*
         * Parágrafo vazio.
         */
        if (
          isEmptyText(
            candidateText
          )
        ) {
          emptyCount++;

          /*
           * Os dados enviados pelo Strapi
           * possuem um vazio entre praticamente
           * todos os itens.
           *
           * Mantemos esses vazios enquanto
           * estivermos dentro da lista.
           */
          if (
            featureItems.length > 0 &&
            emptyCount <= 2
          ) {
            scan++;
            continue;
          }

          /*
           * Se ainda não encontramos itens,
           * apenas avançamos.
           */
          scan++;
          continue;
        }

        /*
         * Quando encontramos outro título,
         * encerramos a lista atual.
         */
        if (
          isListHeading(
            candidateText
          )
        ) {
          break;
        }

        /*
         * Texto muito longo significa que
         * provavelmente voltamos para a descrição normal.
         */
        if (
          !isShortFeatureText(
            candidateText
          )
        ) {
          break;
        }

        featureItems.push(
          candidateText
        );

        emptyCount = 0;

        scan++;
      }

      /*
       * Só transforma em lista se realmente
       * houver pelo menos 2 características.
       */
      if (
        featureItems.length >= 2
      ) {
        blocks.push({
          type: "visual-list",
          items:
            featureItems,
          key:
            `feature-list-${index}`
        });

        index = scan;
        continue;
      }

      index++;
      continue;
    }


    /*
     * ------------------------------------------------------
     * LISTA DE CARACTERÍSTICAS SEM TÍTULO
     * ------------------------------------------------------
     *
     * Também tratamos sequências como:
     *
     * 34 m²
     * 2 dormitórios
     * 1 banheiro
     * Condomínio fechado
     *
     * quando o conteúdo claramente se comporta
     * como uma sequência de itens.
     */
    const featureItems = [];

    let scan =
      index;

    let emptyCount =
      0;

    while (
      scan <
      descricao.length
    ) {
      const candidate =
        descricao[scan];

      if (
        !candidate ||
        candidate.type !==
          "paragraph"
      ) {
        break;
      }

      const candidateText =
        getBlockText(
          candidate
        ).trim();

      if (
        isEmptyText(
          candidateText
        )
      ) {
        emptyCount++;

        if (
          featureItems.length > 0 &&
          emptyCount <= 2
        ) {
          scan++;
          continue;
        }

        scan++;
        continue;
      }

      /*
       * Não misturamos uma lista com um
       * parágrafo descritivo longo.
       */
      if (
        !isShortFeatureText(
          candidateText
        )
      ) {
        break;
      }

      /*
       * Um parágrafo com ícone já possui
       * sua própria regra.
       */
      if (
        startsWithVisualIcon(
          candidateText
        )
      ) {
        break;
      }

      featureItems.push(
        candidateText
      );

      emptyCount = 0;

      scan++;
    }

    /*
     * Para evitar transformar duas frases curtas
     * comuns em lista, exigimos pelo menos 3 itens.
     */
    if (
      featureItems.length >= 3
    ) {
      blocks.push({
        type: "visual-list",
        items:
          featureItems,
        key:
          `feature-list-${index}`
      });

      index = scan;
      continue;
    }


    /*
     * ------------------------------------------------------
     * PARÁGRAFO NORMAL
     * ------------------------------------------------------
     */
    blocks.push({
      type: "normal",
      block: current,
      key:
        `paragraph-${index}`
    });

    index++;
  }

  return blocks;
};


/*
 * ==========================================================
 * LISTA VISUAL
 * ==========================================================
 *
 * Desktop:
 *
 * • item 1              • item 2
 * • item 3              • item 4
 *
 * Mobile:
 *
 * • item 1
 * • item 2
 * • item 3
 *
 * Cada item possui:
 *
 *   • + conteúdo
 *
 * mantendo ícone + texto juntos.
 */
const renderAsVisualList = (
  items,
  keyPrefix = "list",
  isMobile = false
) => {
  if (
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return null;
  }

  const lines = items
    .map(
      (item) =>
        removeExistingBullet(
          item
        )
    )
    .filter(
      (item) =>
        item &&
        item.trim() !== ""
    );

  if (
    lines.length === 0
  ) {
    return null;
  }

  return (
    <Box
      component="div"
      sx={{
        display: "grid",

        /*
         * Desktop = 2 colunas.
         *
         * Mobile = 1 coluna.
         */
        gridTemplateColumns:
          isMobile
            ? "minmax(0, 1fr)"
            : "repeat(2, minmax(0, 1fr))",

        columnGap: "28px",

        rowGap: "0.45rem",

        /*
         * Deslocamento real solicitado.
         */
        marginLeft: "10px",

        /*
         * Impede que o margin aumente
         * o tamanho total do container.
         */
        width:
          "calc(100% - 10px)",

        boxSizing:
          "border-box",

        alignItems:
          "start",

        whiteSpace:
          "normal",

        wordBreak:
          "break-word",

        overflowWrap:
          "anywhere"
      }}
    >
      {lines.map(
        (
          line,
          index
        ) => (
          <Box
            key={`${keyPrefix}-${index}`}
            component="div"
            sx={{
              display: "flex",

              alignItems:
                "flex-start",

              width: "100%",

              minWidth: 0,

              fontSize:
                "0.9rem",

              lineHeight: 1.45,

              whiteSpace:
                "normal",

              wordBreak:
                "break-word",

              overflowWrap:
                "anywhere"
            }}
          >
            <Box
              component="span"
              sx={{
                flexShrink: 0,

                marginRight:
                  "6px",

                lineHeight:
                  1.45,

                fontSize:
                  "0.9rem"
              }}
            >
              •
            </Box>

            <Box
              component="span"
              sx={{
                display:
                  "block",

                minWidth: 0,

                flex: 1,

                fontSize:
                  "0.9rem",

                lineHeight:
                  1.45,

                whiteSpace:
                  "normal",

                wordBreak:
                  "break-word",

                overflowWrap:
                  "anywhere"
              }}
            >
              {line}
            </Box>
          </Box>
        )
      )}
    </Box>
  );
};


/*
 * ==========================================================
 * COMPONENTE
 * ==========================================================
 */

const CharacterDetail = ({
  realestate
}) => {
  const history =
    useHistory();

  const contentRef =
    useRef(null);

  const [loading, setLoading] =
    useState(true);

  const [imoveis, setImoveis] =
    useState();

  const [isMobile, setIsMobile] =
    useState(
      window.innerWidth <= 1024
    );

  const [openToggle, setOpenToggle] =
    useState(false);

  const [showToggle, setShowToggle] =
    useState(false);

  const [open, setOpen] =
    React.useState(false);

  let rows = [];

  const paramID =
    getParameterByName(
      "dcID"
    );


  /*
   * Atualiza o estado mobile.
   */
  useEffect(() => {
    const handleResize =
      () => {
        setIsMobile(
          window.innerWidth <=
            1024
        );
      };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);


  /*
   * Busca dados do Redux.
   */
  useEffect(() => {
    if (
      !realestate ||
      Object.keys(
        realestate
      ).length === 0
    ) {
      return;
    }

    setImoveis(
      realestate
    );

    const timer =
      setTimeout(() => {
        setLoading(false);
      }, 200);

    return () =>
      clearTimeout(
        timer
      );
  }, [realestate]);


  /*
   * Busca imóvel quando a página
   * é recarregada.
   */
  useEffect(() => {
    const idImovel =
      window.location.pathname.match(
        /^\/imovel\/(\d+)/
      )?.[1];

    if (!idImovel) {
      return;
    }

    const chave =
      `detailVisitada_${idImovel}`;

    const jaVisitou =
      sessionStorage.getItem(
        chave
      );

    if (
      jaVisitou === "true"
    ) {
      console.log(
        "🔥 Recarregou a página do imóvel:",
        idImovel
      );

      axios
        .get(
          `https://sublime-bat-ad2fca1255.strapiapp.com/api/Anuncios/?filters[id][$eq]=${idImovel}&populate=*`
        )
        .then(
          (response) => {
            setImoveis(
              response.data
                .data[0]
            );

            setLoading(
              false
            );
          }
        )
        .catch(
          (error) => {
            console.log(
              "An error occurred:",
              error.response
            );
          }
        );
    } else {
      console.log(
        "➡️ Primeira entrada no imóvel:",
        idImovel
      );

      sessionStorage.setItem(
        chave,
        "true"
      );
    }
  }, []);


  /*
   * Busca imóvel por documentId.
   */
  useEffect(() => {
    if (
      paramID !== null &&
      paramID !== ""
    ) {
      axios
        .get(
          `https://sublime-bat-ad2fca1255.strapiapp.com/api/Anuncios/${paramID}?status=published&populate[0]=Fotos`
        )
        .then(
          (response) => {
            setImoveis(
              response.data
                .data
            );

            setLoading(
              false
            );
          }
        )
        .catch(
          (error) => {
            console.log(
              "An error occurred:",
              error.response
            );
          }
        );
    }

    /*
     * Desabilita botão direito.
     */
    const handleContextMenu =
      (e) => {
        e.preventDefault();
      };

    document.body.addEventListener(
      "contextmenu",
      handleContextMenu
    );

    return () => {
      document.body.removeEventListener(
        "contextmenu",
        handleContextMenu
      );
    };
  }, [paramID]);


  /*
   * Cria linhas da tabela.
   */
  function createData(
    name,
    info
  ) {
    return {
      name,
      info
    };
  }


  /*
   * Informações do imóvel.
   */
  if (
    imoveis &&
    Object.keys(
      imoveis
    ).length > 0
  ) {
    if (
      imoveis.Tipo_de_Anuncio ===
      "venda"
    ) {
      rows = [
        createData(
          "Andar",
          imoveis?.Andar !==
            null
            ? imoveis.Andar +
                "º"
            : ""
        ),

        createData(
          "Área terreno",
          imoveis?.Area_Terreno !==
            null
            ? imoveis.Area_Terreno +
                " (m²)"
            : "Sem Informação"
        ),

        createData(
          "Ano de construção",
          imoveis?.Ano_de_Construcao !==
            null
            ? imoveis.Ano_de_Construcao
            : "Sem Informação"
        ),

        createData(
          "Condomínio",
          imoveis?.Condominio !==
              null &&
            imoveis.Condominio
            ? "R$" +
              imoveis.Condominio
            : "Sem Informação"
        ),

        createData(
          "IPTU (anual)",
          imoveis?.IPTU !==
            null
            ? parseInt(
                imoveis.IPTU
              ).toLocaleString(
                "pt-BR",
                {
                  style:
                    "currency",
                  currency:
                    "BRL"
                }
              )
            : "Sem Informação"
        ),

        createData(
          "Quartos",
          imoveis?.Quartos !==
            null
            ? imoveis.Quartos
            : "Sem Informação"
        ),

        createData(
          "Suítes",
          imoveis?.Suites !==
            null
            ? imoveis.Suites
            : "Sem Informação"
        ),

        createData(
          "Banheiros",
          imoveis?.Banheiros !==
            null
            ? imoveis.Banheiros
            : "Sem Informação"
        )
      ];

      rows =
        rows.filter(
          (item) =>
            item.info !==
            ""
        );
    } else {
      rows = [
        createData(
          "Andar",
          imoveis?.Andar !==
            null
            ? imoveis.Andar +
                "º"
            : ""
        ),

        createData(
          "Área terreno",
          imoveis?.Area_Terreno !==
            null
            ? imoveis.Area_Terreno +
                " (m²)"
            : "Sem Informação"
        ),

        createData(
          "Condomínio",
          imoveis?.Condominio !==
              null &&
            imoveis.Condominio
            ? "R$" +
              imoveis?.Condominio
            : "Sem Informação"
        ),

        createData(
          "IPTU (anual)",
          imoveis?.IPTU !==
            null
            ? parseInt(
                imoveis.IPTU
              ).toLocaleString(
                "pt-BR",
                {
                  style:
                    "currency",
                  currency:
                    "BRL"
                }
              )
            : ""
        ),

        createData(
          "Quartos",
          imoveis?.Quartos !==
            null
            ? imoveis.Quartos
            : ""
        ),

        createData(
          "Suítes",
          imoveis?.Suites !==
            null
            ? imoveis.Suites
            : ""
        ),

        createData(
          "Banheiros",
          imoveis?.Banheiros !==
            null
            ? imoveis.Banheiros
            : "Sem Informação"
        )
      ];

      rows =
        rows.filter(
          (item) =>
            item.info !==
            ""
        );
    }
  }


  const handleClickOpen =
    () => {
      setOpen(true);
    };


  /*
   * Controla o botão
   * "Saiba mais".
   */
  useEffect(() => {
    if (
      !contentRef.current ||
      loading
    ) {
      return;
    }

    const element =
      contentRef.current;

    const updateToggle =
      () => {
        setShowToggle(
          element.scrollHeight >
            160
        );
      };

    updateToggle();

    const resizeObserver =
      new ResizeObserver(
        updateToggle
      );

    resizeObserver.observe(
      element
    );

    return () => {
      resizeObserver.disconnect();
    };
  }, [
    loading,
    imoveis
  ]);


  /*
   * Monta os blocos da descrição.
   *
   * Isso é calculado a cada renderização
   * com base no conteúdo atual do imóvel.
   */
  const descriptionBlocks =
    buildDescriptionBlocks(
      imoveis?.descricao
    );


  return (
    <React.Fragment>

      {!isMobile && (
        <TopInfo />
      )}

      <Header />


      {!loading && (
        <>

          <div className="ThumbSLider-highligh slick-slider center slick-initialized">

            <ThumbSLider
              height="300"
              image={imoveis?.Fotos?.slice(
                1
              )}
              detail="true"
              onClick={
                handleClickOpen
              }
            />

          </div>


          <div className="row center">

            <Box
              className="back"
              sx={{
                width:
                  "100%"
              }}
            >

              <Button
                onClick={() => {
                  history.push(
                    "/"
                  );
                }}
              >
                <KeyboardBackspaceIcon />

                Voltar para Resultados
              </Button>

            </Box>


            <div className="ThumbSLider-info">

              <Box className="wrapper-property">

                <span className="imovel">
                  {imoveis?.titulo ||
                    ""}
                </span>


                <div className="property-header">

                  <div className="property-location">

                    <span className="location-chip">

                      <LocationPinIcon fontSize="small" />

                      {imoveis?.Bairro ||
                        ""}

                    </span>


                    <span className="location-chip">

                      <LocationCityIcon fontSize="small" />

                      São Paulo - SP

                    </span>


                    {imoveis?.codigo && (
                      <span
                        className="location-chip"
                        style={{
                          display:
                            "block"
                        }}
                      >
                        Cod. Imóvel{" "}

                        <i>
                          #
                        </i>

                        {
                          imoveis.codigo
                        }

                      </span>
                    )}

                  </div>

                </div>

              </Box>


              <Box className="card">

                <Typography
                  className="icon-card icon-sale"
                  variant="h6"
                  component="div"
                  color="text.secondary"
                  sx={{
                    fontSize:
                      "0.9rem"
                  }}
                >

                  {imoveis?.Valor_Venda !==
                  null
                    ? parseFloat(
                        imoveis?.Valor_Venda?.replace(
                          ".",
                          ""
                        )
                      )?.toLocaleString(
                        "pt-BR",
                        {
                          style:
                            "currency",
                          currency:
                            "BRL"
                        }
                      )
                    : parseFloat(
                        imoveis?.Valor_Aluguel?.replace(
                          ".",
                          ""
                        )
                      )?.toLocaleString(
                        "pt-BR",
                        {
                          style:
                            "currency",
                          currency:
                            "BRL"
                        }
                      )}

                </Typography>

              </Box>

            </div>


            <CardDetail
              data={imoveis}
            />


            <Box
              className="propertyDetails"
              sx={{
                width:
                  "100%"
              }}
            >

              <Box
                ref={contentRef}
                className="caracteristicas"
                sx={{
                  maxHeight:
                    openToggle
                      ? `${
                          contentRef
                            .current
                            ?.scrollHeight ||
                          9999
                        }px`
                      : "160px",

                  overflow:
                    "hidden",

                  transition:
                    "max-height .4s ease"
                }}
              >

                <h2>
                  Descrição
                </h2>


                {descriptionBlocks.map(
                  (
                    block,
                    index
                  ) => {

                    /*
                     * --------------------------------------------------
                     * LISTA VISUAL
                     * --------------------------------------------------
                     */
                    if (
                      block.type ===
                      "visual-list"
                    ) {
                      return (
                        <Box
                          key={
                            block.key ||
                            `visual-list-${index}`
                          }
                          component="div"
                          sx={{
                            width:
                              "100%",

                            marginTop:
                              "10px",

                            marginBottom:
                              "10px",

                            fontSize:
                              "0.9rem"
                          }}
                        >
                          {renderAsVisualList(
                            block.items,
                            block.key ||
                              `visual-list-${index}`,
                            isMobile
                          )}
                        </Box>
                      );
                    }


                    /*
                     * --------------------------------------------------
                     * ESPAÇO ENTRE BLOCOS
                     * --------------------------------------------------
                     *
                     * Mantemos apenas um pequeno espaçamento.
                     * Isso evita que os parágrafos vazios do Strapi
                     * criem espaços exagerados.
                     */
                    if (
                      block.type ===
                      "spacer"
                    ) {
                      return (
                        <Box
                          key={
                            block.key ||
                            `spacer-${index}`
                          }
                          sx={{
                            height:
                              "6px"
                          }}
                        />
                      );
                    }


                    /*
                     * --------------------------------------------------
                     * PARÁGRAFO NORMAL
                     * --------------------------------------------------
                     */
                    if (
                      block.type ===
                      "normal"
                    ) {
                      const desc =
                        block.block;

                      if (
                        !desc
                      ) {
                        return null;
                      }

                      /*
                       * Parágrafos com várias linhas
                       * continuam recebendo o tratamento de lista.
                       */
                      if (
                        desc.type ===
                          "paragraph" &&
                        hasMultipleLines(
                          desc.children
                        )
                      ) {
                        const lines =
                          [];

                        desc.children?.forEach(
                          (
                            child
                          ) => {
                            splitTextLines(
                              getChildText(
                                child
                              )
                            ).forEach(
                              (
                                line
                              ) => {
                                lines.push(
                                  line
                                );
                              }
                            );
                          }
                        );

                        return (
                          <Typography
                            key={
                              block.key ||
                              `multiline-${index}`
                            }
                            component="div"
                            variant="h5"
                            gutterBottom
                            sx={{
                              width:
                                "100%",

                              fontSize:
                                "0.9rem",

                              whiteSpace:
                                "normal",

                              wordBreak:
                                "break-word",

                              overflowWrap:
                                "anywhere"
                            }}
                          >
                            {renderAsVisualList(
                              lines,
                              block.key ||
                                `multiline-${index}`,
                              isMobile
                            )}
                          </Typography>
                        );
                      }


                      /*
                       * Renderização normal.
                       *
                       * Aqui permanecem textos descritivos
                       * que NÃO foram identificados como lista.
                       */
                      return (
                        <Typography
                          key={
                            block.key ||
                            `paragraph-${index}`
                          }
                          component="div"
                          variant="h5"
                          gutterBottom
                          sx={{
                            width:
                              "100%",

                            fontSize:
                              "0.9rem",

                            whiteSpace:
                              "normal",

                            wordBreak:
                              "break-word",

                            overflowWrap:
                              "anywhere"
                          }}
                        >
                          {renderNormalChildren(
                            desc.children
                          )}
                        </Typography>
                      );
                    }


                    return null;
                  }
                )}

              </Box>


              {showToggle && (
                <button
                  type="button"
                  onClick={() =>
                    setOpenToggle(
                      (prev) =>
                        !prev
                    )
                  }
                  className="toggle-description"
                  aria-expanded={
                    openToggle
                  }
                >

                  <span>
                    {openToggle
                      ? "Mostrar menos"
                      : "Saiba mais"}
                  </span>


                  {openToggle ? (
                    <KeyboardArrowUpIcon />
                  ) : (
                    <KeyboardArrowDownIcon />
                  )}

                </button>
              )}

            </Box>


            <br />


            <TableContainer
              style={{
                boxShadow:
                  "none"
              }}
            >

              <Table
                className="TableInfo-imovel"
                sx={{
                  fontSize:
                    "0.5rem"
                }}
                aria-label="simple table"
              >

                <TableBody>

                  {rows.map(
                    (
                      row
                    ) => (

                      <TableRow
                        key={
                          row.name
                        }
                        sx={{
                          "&:last-child td, &:last-child th":
                            {
                              border:
                                0
                            }
                        }}
                      >

                        <TableCell
                          component="th"
                          scope="row"
                          style={{
                            paddingLeft:
                              "30px"
                          }}
                        >
                          {
                            row.name
                          }
                        </TableCell>


                        <TableCell align="right">
                          {
                            row.info
                          }
                        </TableCell>

                      </TableRow>

                    )
                  )}

                </TableBody>

              </Table>

            </TableContainer>

          </div>

        </>
      )}


      {loading &&
        !isMobile && (
          <PreloadImovelDetail />
        )}


      {loading &&
        isMobile && (
          <PreloadImovelDetailMobile />
        )}


      <Footer />

    </React.Fragment>
  );
};


const mapStateToProps = (
  state
) => ({
  realestate:
    state.character.realestate
});


export default withRouter(
  connect(
    mapStateToProps
  )(
    CharacterDetail
  )
);