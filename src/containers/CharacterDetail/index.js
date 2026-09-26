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

import { Button, CardActionArea, CardActions } from "@mui/material";

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
    /[\[\]]/g,
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
    results[2].replace(/\+/g, " ")
  );
}

/**
 * Extrai todo o texto dos children de um bloco do Strapi.
 */
function getTextFromChildren(children = []) {
  if (!Array.isArray(children)) {
    return "";
  }

  return children
    .map((child) =>
      child?.text != null
        ? String(child.text)
        : ""
    )
    .join("");
}

/**
 * Verifica se o texto começa visualmente com um ícone,
 * emoji, marcador ou símbolo de lista.
 */
function startsWithVisualIcon(text = "") {
  const value = String(text).trim();

  if (!value) {
    return false;
  }

  const visualIconRegex =
    /^(?:[\u{1F000}-\u{1FAFF}]|[\u{2600}-\u{27BF}]|[•●○◉◌▪▫■□◆◇★☆✓✔✕✖➜➤➝➞➟➠➡➢➣➥➦➧➨➩➪➫➬➭➮➯➱➲➳➵➸➺➻➼➽➾→←↑↓↔⇒⇐⇑⇓⟶⟵⟷]|[-*+])(?:\uFE0F|\u200D[\u{1F000}-\u{1FAFF}])?(?:\s|$)/u;

  return visualIconRegex.test(value);
}

/**
 * Divide linhas que eventualmente foram colocadas
 * dentro do mesmo parágrafo.
 *
 * Exemplo:
 *
 * ⭐ Item 1 🏡 Item 2 📍 Item 3
 *
 * vira:
 *
 * ⭐ Item 1
 * 🏡 Item 2
 * 📍 Item 3
 */
function splitVisualLines(text = "") {
  const normalized = String(text)
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");

  const explicitLines = normalized
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const result = [];

  const visualMarkerRegex =
    /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}•●○◉◌▪▫■□◆◇★☆✓✔✕✖➜➤➝➞➟➠➡➢➣➥➦➧➨➩➪➫➬➭➮➯➱➲➳➵➸➺➻➼➽➾→←↑↓↔⇒⇐⇑⇓⟶⟵⟷]/gu;

  explicitLines.forEach((line) => {
    const trimmed = line.trim();

    const matches = [
      ...trimmed.matchAll(
        visualMarkerRegex
      )
    ];

    if (
      matches.length > 1 &&
      matches[0].index === 0
    ) {
      for (
        let i = 0;
        i < matches.length;
        i += 1
      ) {
        const start =
          matches[i].index;

        const end =
          i + 1 < matches.length
            ? matches[i + 1].index
            : trimmed.length;

        const item = trimmed
          .slice(start, end)
          .trim();

        if (item) {
          result.push(item);
        }
      }
    } else {
      result.push(trimmed);
    }
  });

  return result;
}

function getTextLines(text = "") {
  return splitVisualLines(text);
}

/**
 * Normaliza espaços sem destruir o conteúdo.
 */
function normalizeVisualLine(line = "") {
  return String(line)
    .replace(/^[\t ]+/, "")
    .replace(/[ \t]+/g, " ")
    .trim();
}

/**
 * Remove uma bolinha/marcador que eventualmente já exista
 * no começo do texto.
 *
 * A bolinha será desenhada pelo componente da lista.
 */
function removeExistingBullet(text = "") {
  return String(text)
    .replace(
      /^\s*[•●○◉◌▪▫■□◆◇★☆]\s*/,
      ""
    )
    .trim();
}

/**
 * Detecta características de imóvel.
 */
function looksLikeCharacteristic(text = "") {
  const value = normalizeVisualLine(
    removeExistingBullet(text)
  );

  if (!value) {
    return false;
  }

  if (startsWithVisualIcon(value)) {
    return false;
  }

  /**
   * Frases completas/descritivas não devem ser
   * transformadas em item de característica.
   *
   * Isso evita casos como:
   *
   * "Uma ótima opção para quem procura um apartamento
   * compacto de 2 dormitórios..."
   *
   * mesmo contendo palavras como "apartamento"
   * ou "dormitórios".
   */
  if (
    /[.!?…]$/.test(value) ||
    /\.\.\.$/.test(value)
  ) {
    return false;
  }

  const characteristicRegex =
    /^(?:área|area|quarto|quartos|suíte|suítes|suite|suites|banheiro|banheiros|vaga|vagas|andar|condomínio|condominio|iptu|valor|preço|preco|metragem|dormitório|dormitórios|dormitorio|dormitorios|sala|salas|cozinha|varanda|sacada|elevador|garagem|portaria|segurança|seguranca|lazer|piscina|academia|churrasqueira|mobiliado|semimobiliado|semi mobiliado|localização|localizacao|aceita|aceitam|permuta|imóvel|imovel|apartamento|casa|sobrado|cobertura|terreno|armários|armarios|closet|lavabo|terraço|terraco|quintal|jardim|escritório|escritorio|dependência|dependencia|área externa|area externa|serviço|servico|lavanderia|hall|playground|salão|salao)\b/i;

  if (
    characteristicRegex.test(value)
  ) {
    return true;
  }

  /**
   * Evita que textos descritivos longos sejam
   * confundidos com características apenas porque
   * possuem números.
   */
  const wordCount = value
    .split(/\s+/)
    .filter(Boolean)
    .length;

  if (
    wordCount > 8 &&
    !characteristicRegex.test(value)
  ) {
    return false;
  }

  if (
    /\d/.test(value) &&
    value.length <= 140
  ) {
    return true;
  }

  if (
    /[|;:]/.test(value) &&
    value.length <= 140
  ) {
    return true;
  }

  const propertyFeatureRegex =
    /(?:m²|m2|metros|dormitórios|dormitorios|quartos|suítes|suites|banheiros|vagas|vaga|andar|condomínio|condominio|portaria|elevador|garagem|piscina|academia|churrasqueira|sacada|varanda|iptu|lavabo|armário|armarios|closet|terraço|terraco|quintal|jardim)/i;

  /**
   * Para palavras de característica encontradas no meio
   * do texto, exige uma descrição curta. Isso impede que
   * uma frase comercial/descritiva seja transformada em
   * item com bolinha.
   */
  if (
    propertyFeatureRegex.test(value) &&
    value.length <= 80
  ) {
    return true;
  }

  if (
    value.length <= 80 &&
    !/[.!?…]$/.test(value) &&
    !/\.\.\.$/.test(value)
  ) {
    return true;
  }

  return false;
}

/**
 * Detecta se uma linha é um título de destaque/característica.
 *
 * Importante:
 * O emoji pode estar antes do texto.
 *
 * Exemplos aceitos:
 *
 * ✨ Destaques do imóvel
 * ⭐ Destaque do imóvel
 * 🏡 Característica do imóvel
 * 📌 Características
 * 🔑 Diferenciais
 * Imóvel
 * Característica
 */
function isHighlightTitle(text = "") {
  const value =
    normalizeVisualLine(text);

  if (!value) {
    return false;
  }

  const withoutIcon = value
    .replace(
      /^(?:[\u{1F000}-\u{1FAFF}]|[\u{2600}-\u{27BF}]|[•●○◉◌▪▫■□◆◇★☆✓✔✕✖➜➤➝➞➟➠➡➢➣➥➦➧➨➩➪➫➬➭➮➯➱➲➳➵➸➺➻➼➽➾→←↑↓↔⇒⇐⇑⇓⟶⟵⟷]|[-*+])(?:\uFE0F|\u200D[\u{1F000}-\u{1FAFF}])?\s*/u,
      ""
    )
    .trim();

  const explicitHighlightRegex =
    /^(?:destaques?|destaques do imóvel|destaques do imovel|destaque do imóvel|destaque do imovel|características?|caracteristicas?|características do imóvel|caracteristicas do imóvel|característica do imóvel|caracteristica do imóvel|principais características|principais caracteristicas|detalhes|detalhes do imóvel|detalhes do imovel|diferenciais|diferenciais do imóvel|diferenciais do imovel|informações|informacoes|informações do imóvel|informacoes do imovel|sobre o imóvel|sobre o imovel|imóvel|imovel|característica|caracteristica)\s*:?\s*$/i;

  return explicitHighlightRegex.test(
    withoutIcon
  );
}

/**
 * Mantido para compatibilidade com a lógica anterior.
 */
function looksLikeHighlight(text = "") {
  const value =
    normalizeVisualLine(text);

  if (!value) {
    return false;
  }

  if (isHighlightTitle(value)) {
    return true;
  }

  if (
    /:$/.test(value) &&
    value.length <= 100
  ) {
    return true;
  }

  if (
    value.length <= 70 &&
    !looksLikeCharacteristic(value) &&
    !/[.!?…]$/.test(value) &&
    !/\.\.\.$/.test(value)
  ) {
    return true;
  }

  return false;
}

/**
 * Verifica se uma linha pode ser usada como cabeçalho
 * de uma lista de destaque.
 */
function isHighlightCandidate(text = "") {
  const value =
    normalizeVisualLine(text);

  if (!value) {
    return false;
  }

  if (isHighlightTitle(value)) {
    return true;
  }

  if (startsWithVisualIcon(value)) {
    return false;
  }

  return looksLikeHighlight(value);
}

/**
 * Analisa um parágrafo do Rich Text do Strapi.
 */
function analyzeParagraph(desc) {
  if (
    !desc ||
    desc.type !== "paragraph"
  ) {
    return null;
  }

  const text =
    getTextFromChildren(
      desc.children
    );

  const lines =
    getTextLines(text);

  if (!lines.length) {
    return null;
  }

  const iconLines =
    lines.filter((line) =>
      startsWithVisualIcon(line)
    );

  if (
    lines.length >= 1 &&
    iconLines.length ===
      lines.length
  ) {
    return {
      type: "icon",
      items: lines.map(
        normalizeVisualLine
      )
    };
  }

  if (
    lines.length > 1 &&
    iconLines.length >= 2
  ) {
    return {
      type: "icon",
      items: lines
        .filter((line) =>
          startsWithVisualIcon(line)
        )
        .map(
          normalizeVisualLine
        )
    };
  }

  if (lines.length >= 2) {
    const firstLine =
      normalizeVisualLine(
        lines[0]
      );

    const remaining = lines
      .slice(1)
      .map(
        normalizeVisualLine
      )
      .filter(Boolean);

    const listLike =
      remaining.filter(
        (item) =>
          !startsWithVisualIcon(
            item
          ) &&
          looksLikeCharacteristic(
            item
          )
      );

    if (
      firstLine &&
      remaining.length > 0 &&
      listLike.length ===
        remaining.length &&
      (
        looksLikeHighlight(
          firstLine
        ) ||
        remaining.length >= 2
      )
    ) {
      return {
        type: "highlight-list",
        highlight: firstLine,
        items: remaining
      };
    }
  }

  return {
    type: "paragraph",
    text
  };
}

/**
 * Extrai características de um parágrafo.
 */
function getCharacteristicItemsFromParagraph(
  desc
) {
  if (
    !desc ||
    desc.type !== "paragraph"
  ) {
    return [];
  }

  const text =
    getTextFromChildren(
      desc.children
    );

  const lines =
    getTextLines(text);

  if (!lines.length) {
    return [];
  }

  /**
   * Exemplo:
   *
   * Área: 64 m² | 2 dormitórios | 1 vaga
   */
  if (
    lines.length === 1 &&
    lines[0].includes("|")
  ) {
    const parts = lines[0]
      .split("|")
      .map((item) =>
        normalizeVisualLine(
          item
        )
      )
      .filter(Boolean);

    if (
      parts.length > 1 &&
      parts.every(
        (item) =>
          !startsWithVisualIcon(
            item
          ) &&
          looksLikeCharacteristic(
            item
          )
      )
    ) {
      return parts;
    }
  }

  /**
   * Várias linhas dentro do mesmo parágrafo.
   */
  if (lines.length > 1) {
    const normalized =
      lines.map(
        normalizeVisualLine
      );

    if (
      normalized.every(
        (item) =>
          !startsWithVisualIcon(
            item
          ) &&
          looksLikeCharacteristic(
            item
          )
      )
    ) {
      return normalized;
    }

    return [];
  }

  /**
   * Uma única característica.
   */
  if (
    lines.length === 1 &&
    !startsWithVisualIcon(
      lines[0]
    ) &&
    looksLikeCharacteristic(
      lines[0]
    )
  ) {
    return [
      normalizeVisualLine(
        lines[0]
      )
    ];
  }

  return [];
}

/**
 * Verifica se o bloco está vazio.
 *
 * Isso é importante porque o Rich Text do Strapi
 * pode retornar:
 *
 * paragraph vazio
 * paragraph "Área: 64 m²"
 * paragraph vazio
 * paragraph "2 dormitórios"
 *
 * Os vazios não devem interromper a lista.
 */
function isEmptyParagraph(desc) {
  if (
    !desc ||
    desc.type !== "paragraph"
  ) {
    return false;
  }

  const text =
    getTextFromChildren(
      desc.children
    );

  return !String(text).trim();
}

/**
 * Constrói os blocos visuais da descrição.
 *
 * A ordem de detecção é importante:
 *
 * 1. Primeiro identifica títulos de destaque.
 * 2. Depois procura os itens seguintes.
 * 3. Só depois trata os demais parágrafos com ícones.
 */
function buildDescriptionBlocks(
  description = []
) {
  if (!Array.isArray(description)) {
    return [];
  }

  const blocks = [];

  let index = 0;

  while (
    index < description.length
  ) {
    const current =
      description[index];

    /**
     * Lista nativa do Strapi.
     */
    if (
      current?.type === "list"
    ) {
      blocks.push({
        type: "native-list",
        desc: current
      });

      index += 1;
      continue;
    }

    /**
     * Blocos que não são paragraph.
     */
    if (
      current?.type !==
      "paragraph"
    ) {
      blocks.push({
        type: "normal",
        desc: current
      });

      index += 1;
      continue;
    }

    /**
     * Parágrafo vazio isolado:
     * não precisa ser renderizado.
     */
    if (
      isEmptyParagraph(current)
    ) {
      index += 1;
      continue;
    }

    const currentText =
      getTextFromChildren(
        current.children
      );

    const currentLines =
      getTextLines(
        currentText
      );

    /**
     * =========================================================
     * 1. DESTAQUE / CARACTERÍSTICA + LISTA
     * =========================================================
     */
    if (
      currentLines.length === 1 &&
      isHighlightCandidate(
        currentLines[0]
      )
    ) {
      const highlight =
        normalizeVisualLine(
          currentLines[0]
        );

      const followingItems =
        [];

      let nextIndex =
        index + 1;

      while (
        nextIndex <
        description.length
      ) {
        const next =
          description[nextIndex];

        /**
         * Ignora parágrafos vazios
         * entre o título e os itens.
         */
        if (
          isEmptyParagraph(next)
        ) {
          nextIndex += 1;
          continue;
        }

        /**
         * Se encontrou outro tipo de
         * bloco, a lista terminou.
         */
        if (
          !next ||
          next.type !==
            "paragraph"
        ) {
          break;
        }

        const nextText =
          getTextFromChildren(
            next.children
          );

        const nextLines =
          getTextLines(
            nextText
          );

        /**
         * Se o próximo parágrafo é
         * outro título de destaque,
         * encerra esta lista.
         */
        if (
          nextLines.length === 1 &&
          isHighlightCandidate(
            nextLines[0]
          )
        ) {
          break;
        }

        /**
         * Se é uma lista de ícones,
         * não mistura com a lista de
         * características.
         */
        const nextAnalysis =
          analyzeParagraph(next);

        if (
          nextAnalysis?.type ===
          "icon"
        ) {
          break;
        }

        const nextItems =
          getCharacteristicItemsFromParagraph(
            next
          );

        if (
          nextItems.length > 0
        ) {
          followingItems.push(
            ...nextItems
          );

          nextIndex += 1;
          continue;
        }

        /**
         * Se não conseguiu identificar
         * como característica, encerra.
         */
        break;
      }

      /**
       * Só transforma em lista quando
       * realmente existem itens.
       */
      if (
        followingItems.length > 0
      ) {
        blocks.push({
          type:
            "highlight-list",
          highlight,
          items:
            followingItems
        });

        index = nextIndex;
        continue;
      }
    }

    const currentAnalysis =
      analyzeParagraph(
        current
      );

    /**
     * =========================================================
     * 2. LISTA DE ÍCONES CONSECUTIVOS
     * =========================================================
     *
     * Aqui entram somente linhas que são
     * realmente itens com ícones.
     *
     * Elas NÃO recebem bolinha.
     */
    if (
      currentAnalysis?.type ===
      "icon"
    ) {
      const iconItems = [
        ...currentAnalysis.items
      ];

      let nextIndex =
        index + 1;

      while (
        nextIndex <
        description.length
      ) {
        const next =
          description[nextIndex];

        /**
         * Parágrafo vazio não precisa
         * interromper uma sequência de
         * ícones.
         */
        if (
          isEmptyParagraph(next)
        ) {
          nextIndex += 1;
          continue;
        }

        if (
          !next ||
          next.type !==
            "paragraph"
        ) {
          break;
        }

        const nextAnalysis =
          analyzeParagraph(
            next
          );

        /**
         * Se o próximo parágrafo é um
         * título de destaque, para aqui.
         */
        const nextText =
          getTextFromChildren(
            next.children
          );

        const nextLines =
          getTextLines(
            nextText
          );

        if (
          nextLines.length === 1 &&
          isHighlightCandidate(
            nextLines[0]
          )
        ) {
          break;
        }

        if (
          nextAnalysis?.type !==
          "icon"
        ) {
          break;
        }

        iconItems.push(
          ...nextAnalysis.items
        );

        nextIndex += 1;
      }

      blocks.push({
        type: "icon-list",
        items: iconItems
      });

      index = nextIndex;
      continue;
    }

    /**
     * =========================================================
     * 3. DESTAQUE + LISTA NO MESMO PARÁGRAFO
     * =========================================================
     */
    if (
      currentAnalysis?.type ===
      "highlight-list"
    ) {
      blocks.push({
        type:
          "highlight-list",
        highlight:
          currentAnalysis.highlight,
        items:
          currentAnalysis.items
      });

      index += 1;
      continue;
    }

    /**
     * =========================================================
     * 4. TÍTULO NORMAL + LISTA NOS PARÁGRAFOS SEGUINTES
     * =========================================================
     *
     * Mantém compatibilidade com conteúdos antigos
     * que não possuem emoji no título.
     */
    if (
      currentLines.length === 1 &&
      currentText.trim()
    ) {
      const firstLine =
        normalizeVisualLine(
          currentLines[0]
        );

      const followingItems =
        [];

      let nextIndex =
        index + 1;

      while (
        nextIndex <
        description.length
      ) {
        const next =
          description[nextIndex];

        /**
         * Ignora vazios.
         */
        if (
          isEmptyParagraph(next)
        ) {
          nextIndex += 1;
          continue;
        }

        if (
          !next ||
          next.type !==
            "paragraph"
        ) {
          break;
        }

        const nextText =
          getTextFromChildren(
            next.children
          );

        const nextLines =
          getTextLines(
            nextText
          );

        if (
          nextLines.length === 1 &&
          isHighlightCandidate(
            nextLines[0]
          )
        ) {
          break;
        }

        const nextAnalysis =
          analyzeParagraph(
            next
          );

        if (
          nextAnalysis?.type ===
          "icon"
        ) {
          break;
        }

        const nextItems =
          getCharacteristicItemsFromParagraph(
            next
          );

        if (
          nextItems.length > 0
        ) {
          followingItems.push(
            ...nextItems
          );

          nextIndex += 1;
          continue;
        }

        break;
      }

      if (
        followingItems.length >= 2 &&
        isHighlightCandidate(
          firstLine
        )
      ) {
        blocks.push({
          type:
            "highlight-list",
          highlight:
            firstLine,
          items:
            followingItems
        });

        index = nextIndex;
        continue;
      }
    }

    /**
     * =========================================================
     * 5. PARÁGRAFO NORMAL
     * =========================================================
     */
    blocks.push({
      type: "normal",
      desc: current
    });

    index += 1;
  }

  return blocks;
}

/**
 * Item de uma lista composta por ícones.
 *
 * NÃO adiciona "•".
 */
function VisualIconListItem({
  text
}) {
  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        alignItems:
          "flex-start",
        minWidth: 0,
        margin: 0,
        padding: 0,
        fontSize: "0.9rem",
        lineHeight: 1.55,
        wordBreak:
          "break-word",
        overflowWrap:
          "anywhere",
        whiteSpace:
          "normal"
      }}
    >
      <Box
        component="span"
        sx={{
          minWidth: 0,
          fontSize: "0.9rem",
          lineHeight: 1.55,
          wordBreak:
            "break-word",
          overflowWrap:
            "anywhere",
          whiteSpace:
            "normal"
        }}
      >
        {text}
      </Box>
    </Box>
  );
}

/**
 * Item da lista de destaque/característica.
 *
 * Aqui SIM adicionamos a bolinha.
 */
function VisualBulletListItem({
  text
}) {
  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        alignItems:
          "flex-start",
        minWidth: 0,
        margin: 0,
        padding: 0,
        fontSize: "0.9rem",
        lineHeight: 1.55,
        wordBreak:
          "break-word",
        overflowWrap:
          "anywhere",
        whiteSpace:
          "normal"
      }}
    >
      <Box
        component="span"
        sx={{
          flex:
            "0 0 auto",
          marginRight:
            "7px",
          fontSize:
            "0.9rem",
          lineHeight:
            1.55
        }}
      >
        •
      </Box>

      <Box
        component="span"
        sx={{
          minWidth: 0,
          fontSize:
            "0.9rem",
          lineHeight:
            1.55,
          wordBreak:
            "break-word",
          overflowWrap:
            "anywhere",
          whiteSpace:
            "normal"
        }}
      >
        {removeExistingBullet(
          text
        )}
      </Box>
    </Box>
  );
}

/**
 * Renderiza listas visuais.
 */
function VisualList({
  items,
  isMobile,
  type = "icon"
}) {
  if (!items?.length) {
    return null;
  }

  return (
    <Box
      component="div"
      sx={{
        marginLeft:
          "10px",
        marginTop:
          "0.35rem",
        marginBottom:
          "0.7rem",
        display: "grid",
        gridTemplateColumns:
          isMobile
            ? "minmax(0, 1fr)"
            : "repeat(2, minmax(0, 1fr))",
        columnGap:
          "1.5rem",
        rowGap:
          "0.45rem",
        width:
          "calc(100% - 10px)",
        maxWidth:
          "100%",
        boxSizing:
          "border-box",
        fontSize:
          "0.9rem"
      }}
    >
      {items.map(
        (item, index) =>
          type ===
          "bullet" ? (
            <VisualBulletListItem
              key={index}
              text={item}
            />
          ) : (
            <VisualIconListItem
              key={index}
              text={item}
            />
          )
      )}
    </Box>
  );
}

const CharacterDetail = ({
  realestate
}) => {
  const history =
    useHistory();

  const contentRef =
    useRef(null);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    imoveis,
    setImoveis
  ] = useState();

  const [
    isMobile,
    setIsMobile
  ] = useState(
    window.innerWidth <= 1024
  );

  const [
    openToggle,
    setOpenToggle
  ] = useState(false);

  const [
    showToggle,
    setShowToggle
  ] = useState(false);

  const [
    open,
    setOpen
  ] = React.useState(false);

  let rows = [];

  const paramID =
    getParameterByName(
      "dcID"
    );

  /**
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
      clearTimeout(timer);
  }, [realestate]);

  /**
   * Busca imóvel quando a página é recarregada.
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
              response.data.data[0]
            );

            setLoading(false);
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

  /**
   * Busca imóvel por documentId.
   */
  useEffect(() => {
    if (
      paramID !== null
    ) {
      axios
        .get(
          `https://sublime-bat-ad2fca1255.strapiapp.com/api/Anuncios/${paramID}?status=published&populate[0]=Fotos`
        )
        .then(
          (response) => {
            setImoveis(
              response.data.data
            );

            setLoading(false);
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

    /**
     * Desabilita botão direito.
     */
    const handleContextMenu = (
      e
    ) => {
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
  }, []);

  /**
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

  /**
   * Informações do imóvel.
   */
  if (
    imoveis &&
    Object.keys(imoveis)
      .length > 0
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

  /**
   * Controla o botão "Saiba mais".
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

  /**
   * Atualiza breakpoint mobile.
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
              image={
                imoveis?.Fotos?.slice(
                  1
                )
              }
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
                width: "100%"
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
                        <i>#</i>
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
                >
                  {
                    imoveis?.Valor_Venda !==
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
                        )
                  }
                </Typography>
              </Box>
            </div>

            <CardDetail
              data={imoveis}
            />

            <Box
              className="propertyDetails"
              sx={{
                width: "100%"
              }}
            >
              <Box
                ref={contentRef}
                className="caracteristicas"
                sx={{
                  maxHeight:
                    openToggle
                      ? `${
                          contentRef.current
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

                {buildDescriptionBlocks(
                  imoveis?.descricao
                ).map(
                  (
                    block,
                    index
                  ) => {
                    /**
                     * LISTA DE ÍCONES
                     *
                     * Os ícones existentes permanecem
                     * exatamente como estão.
                     *
                     * NÃO recebem bolinha.
                     */
                    if (
                      block.type ===
                      "icon-list"
                    ) {
                      return (
                        <VisualList
                          key={`icon-list-${index}`}
                          items={
                            block.items
                          }
                          isMobile={
                            isMobile
                          }
                          type="icon"
                        />
                      );
                    }

                    /**
                     * DESTAQUE / CARACTERÍSTICA
                     *
                     * O título permanece com o emoji.
                     *
                     * Os itens seguintes recebem
                     * bolinha e são organizados em
                     * duas colunas no desktop.
                     */
                    if (
                      block.type ===
                      "highlight-list"
                    ) {
                      return (
                        <React.Fragment
                          key={`highlight-list-${index}`}
                        >
                          <Typography
                            gutterBottom
                            variant="h5"
                            sx={{
                              fontSize:
                                "0.9rem",
                              lineHeight:
                                1.55,
                              marginBottom:
                                "0.25rem",
                              wordBreak:
                                "break-word",
                              overflowWrap:
                                "anywhere",
                              whiteSpace:
                                "normal"
                            }}
                          >
                            {
                              block.highlight
                            }
                          </Typography>

                          <VisualList
                            items={
                              block.items
                            }
                            isMobile={
                              isMobile
                            }
                            type="bullet"
                          />
                        </React.Fragment>
                      );
                    }

                    /**
                     * LISTA NATIVA DO STRAPI.
                     */
                    if (
                      block.type ===
                      "native-list"
                    ) {
                      return (
                        <Box
                          key={`list-${index}`}
                          component="div"
                          sx={{
                            marginLeft:
                              "10px",
                            marginTop:
                              "0.35rem",
                            marginBottom:
                              "0.7rem",
                            display:
                              "grid",
                            gridTemplateColumns:
                              isMobile
                                ? "minmax(0, 1fr)"
                                : "repeat(2, minmax(0, 1fr))",
                            columnGap:
                              "1.5rem",
                            rowGap:
                              "0.45rem",
                            width:
                              "calc(100% - 10px)",
                            maxWidth:
                              "100%",
                            boxSizing:
                              "border-box"
                          }}
                        >
                          {block.desc.children?.map(
                            (
                              listItem,
                              itemIndex
                            ) => (
                              <Box
                                component="div"
                                key={
                                  itemIndex
                                }
                                sx={{
                                  fontSize:
                                    "0.9rem",
                                  lineHeight:
                                    1.55,
                                  wordBreak:
                                    "break-word",
                                  overflowWrap:
                                    "anywhere"
                                }}
                              >
                                •{" "}
                                {
                                  getTextFromChildren(
                                    listItem.children
                                  )
                                }
                              </Box>
                            )
                          )}
                        </Box>
                      );
                    }

                    /**
                     * PARÁGRAFO NORMAL.
                     */
                    if (
                      block.type ===
                      "normal"
                    ) {
                      const text =
                        block.desc
                          ?.type ===
                        "paragraph"
                          ? getTextFromChildren(
                              block.desc
                                .children
                            )
                          : "";

                      return (
                        <Typography
                          key={`paragraph-${index}`}
                          gutterBottom
                          variant="h5"
                          sx={{
                            fontSize:
                              "0.9rem",
                            lineHeight:
                              1.55,
                            wordBreak:
                              "break-word",
                            overflowWrap:
                              "anywhere",
                            whiteSpace:
                              "pre-wrap"
                          }}
                        >
                          {text}
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
                    (row) => (
                      <TableRow
                        key={
                          row.name
                        }
                        sx={{
                          "&:last-child td, &:last-child th":
                            {
                              border: 0
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

const mapStateToProps =
  (state) => ({
    realestate:
      state.character
        .realestate
  });

export default withRouter(
  connect(
    mapStateToProps
  )(CharacterDetail)
);