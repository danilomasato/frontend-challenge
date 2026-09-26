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
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
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

function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, "\\$&");

  const regex = new RegExp(
    "[?&]" + name + "(=([^&#]*)|&|#|$)"
  );

  const results = regex.exec(url);

  if (!results) {
    return "";
  }

  if (!results[2]) {
    return "";
  }

  return decodeURIComponent(
    results[2].replace(/\+/g, " ")
  );
}

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

function startsWithVisualIcon(text = "") {
  const value = String(text).trim();

  if (!value) {
    return false;
  }

  const visualIconRegex =
    /^(?:[\u{1F000}-\u{1FAFF}]|[\u{2600}-\u{27BF}]|[•●○◉◌▪▫■□◆◇★☆✓✔✕✖➜➤➝➞➟➠➡➢➣➥➦➧➨➩➪➫➬➭➮➯➱➲➳➵➸➺➻➼➽➾→←↑↓↔⇒⇐⇑⇓⟶⟵⟷]|[+*-])(?:\uFE0F|\u200D[\u{1F000}-\u{1FAFF}])?(?:\s|$)/u;

  return visualIconRegex.test(value);
}

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

function normalizeVisualLine(line = "") {
  return String(line)
    .replace(/^[\t ]+/, "")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function removeExistingBullet(text = "") {
  return String(text)
    .replace(
      /^\s*[•●○◉◌▪▫■□◆◇★☆]\s*/,
      ""
    )
    .trim();
}

function isEmptyDescriptionParagraph(desc) {
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

function normalizeHighlightTitle(text = "") {
  return normalizeVisualLine(text)
    .replace(
      /^(?:[\u{1F000}-\u{1FAFF}]|[\u{2600}-\u{27BF}]|[•●○◉◌▪▫■□◆◇★☆✓✔✕✖➜➤➝➞➟➠➡➢➣➥➦➧➨➩➪➫➬➭➮➯➱➲➳➵➸➺➻➼➽➾→←↑↓↔⇒⇐⇑⇓⟶⟵⟷]|[+*-])(?:\uFE0F|\u200D[\u{1F000}-\u{1FAFF}])?\s*/u,
      ""
    )
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[：:]\s*$/, "")
    .trim();
}

function isExplicitPropertyHighlight(text = "") {
  const title =
    normalizeHighlightTitle(text);

  return /^(?:destaques?|destaque|características?|caracteristicas?|característica|caracteristica)(?:\s+do\s+im[oó]vel)?$/i.test(
    title
  );
}

function looksLikeCharacteristic(text = "") {
  const value = normalizeVisualLine(
    removeExistingBullet(text)
  );

  if (
    !value ||
    startsWithVisualIcon(value)
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

  if (
    propertyFeatureRegex.test(
      value
    ) &&
    value.length <= 160
  ) {
    return true;
  }

  if (
    value.length <= 80 &&
    !/[.!?]$/.test(value)
  ) {
    return true;
  }

  return false;
}

function looksLikeDescriptionListItem(
  text = ""
) {
  const value = normalizeVisualLine(
    removeExistingBullet(text)
  );

  if (!value) {
    return false;
  }

  if (
    startsWithVisualIcon(value)
  ) {
    return false;
  }

  if (
    looksLikeCharacteristic(value)
  ) {
    return true;
  }

  if (
    value.length <= 100 &&
    !/[.!?]$/.test(value)
  ) {
    return true;
  }

  if (
    /[|;:]/.test(value) &&
    value.length <= 180
  ) {
    return true;
  }

  return false;
}

function looksLikeHighlight(text = "") {
  const value =
    normalizeVisualLine(text);

  if (!value) {
    return false;
  }

  const withoutIcon =
    normalizeHighlightTitle(value);

  const highlightRegex =
    /^(?:destaques?|destaque|destaques do imóvel|destaque do imóvel|características?|caracteristicas?|característica|caracteristica|características do imóvel|caracteristicas do imóvel|principais características|principais caracteristicas|detalhes|detalhes do imóvel|detalhes do imovel|diferenciais|diferenciais do imóvel|diferenciais do imovel|informações|informacoes|informações do imóvel|informacoes do imovel|sobre o imóvel|sobre o imovel)\s*:?\s*$/i;

  if (
    highlightRegex.test(
      withoutIcon
    )
  ) {
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
    !/[.!?]$/.test(value)
  ) {
    return true;
  }

  return false;
}

function isHighlightCandidate(
  text = ""
) {
  const value =
    normalizeVisualLine(text);

  if (!value) {
    return false;
  }

  if (
    isExplicitPropertyHighlight(
      value
    )
  ) {
    return true;
  }

  const withoutIcon =
    normalizeHighlightTitle(value);

  const explicitHighlightRegex =
    /^(?:destaques?|destaque|destaques do imóvel|destaque do imóvel|características?|caracteristicas?|característica|caracteristica|características do imóvel|caracteristicas do imóvel|principais características|principais caracteristicas|detalhes|detalhes do imóvel|detalhes do imovel|diferenciais|diferenciais do imóvel|diferenciais do imovel|informações|informacoes|informações do imóvel|informacoes do imovel|sobre o imóvel|sobre o imovel|imóvel|imovel|característica|caracteristica)\s*:?\s*$/i;

  if (
    explicitHighlightRegex.test(
      withoutIcon
    )
  ) {
    return true;
  }

  if (
    startsWithVisualIcon(value)
  ) {
    return false;
  }

  return looksLikeHighlight(value);
}

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
    lines.filter(
      (line) =>
        startsWithVisualIcon(line)
    );

  if (
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
        .map(normalizeVisualLine)
    };
  }

  if (lines.length >= 2) {
    const firstLine =
      normalizeVisualLine(
        lines[0]
      );

    const remaining =
      lines
        .slice(1)
        .map(normalizeVisualLine)
        .filter(Boolean);

    const listLike =
      remaining.filter(
        (item) =>
          !startsWithVisualIcon(item) &&
          looksLikeDescriptionListItem(
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
        isExplicitPropertyHighlight(
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

  if (
    lines.length === 1 &&
    lines[0].includes("|")
  ) {
    const parts =
      lines[0]
        .split("|")
        .map(normalizeVisualLine)
        .filter(Boolean);

    if (
      parts.length > 1 &&
      parts.every(
        (item) =>
          !startsWithVisualIcon(item) &&
          looksLikeDescriptionListItem(
            item
          )
      )
    ) {
      return parts;
    }
  }

  if (
    lines.length === 1 &&
    lines[0].includes(";")
  ) {
    const parts =
      lines[0]
        .split(";")
        .map(normalizeVisualLine)
        .filter(Boolean);

    if (
      parts.length > 1 &&
      parts.every(
        (item) =>
          !startsWithVisualIcon(item) &&
          looksLikeDescriptionListItem(
            item
          )
      )
    ) {
      return parts;
    }
  }

  if (lines.length > 1) {
    const normalized =
      lines.map(normalizeVisualLine);

    if (
      normalized.every(
        (item) =>
          !startsWithVisualIcon(item) &&
          looksLikeDescriptionListItem(
            item
          )
      )
    ) {
      return normalized;
    }

    return [];
  }

  if (
    !startsWithVisualIcon(lines[0]) &&
    looksLikeDescriptionListItem(
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

    if (
      current?.type !== "paragraph"
    ) {
      blocks.push({
        type: "normal",
        desc: current
      });

      index += 1;

      continue;
    }

    /*
     * Paragraph vazio:
     *
     * O Strapi está criando vários paragraphs vazios
     * entre os itens da lista. Esses paragraphs não
     * devem aparecer na descrição e também não podem
     * interromper a identificação de uma lista.
     */
    if (
      isEmptyDescriptionParagraph(
        current
      )
    ) {
      index += 1;
      continue;
    }

    const currentAnalysis =
      analyzeParagraph(current);

    /*
     * ==========================================================
     * DESTAQUES / CARACTERÍSTICAS DO IMÓVEL
     * ==========================================================
     *
     * Exemplo real recebido da API:
     *
     * ✨ Destaques do imóvel
     * 34 m²
     * [paragraph vazio]
     * 2 dormitórios
     * [paragraph vazio]
     * 1 banheiro
     * [paragraph vazio]
     * Condomínio fechado
     * [paragraph vazio]
     * ...
     *
     * O ponto importante aqui é que os paragraphs vazios
     * precisam ser ignorados enquanto procuramos os itens.
     */
    const currentText =
      currentAnalysis?.text ||
      getTextFromChildren(
        current.children
      );

    const currentLines =
      getTextLines(currentText);

    const firstCurrentLine =
      currentLines.length === 1
        ? normalizeVisualLine(
            currentLines[0]
          )
        : "";

    const currentIsExplicitHighlight =
      currentLines.length === 1 &&
      isExplicitPropertyHighlight(
        firstCurrentLine
      );

    const currentIsIconHighlight =
      currentAnalysis?.type ===
        "icon" &&
      currentAnalysis.items.length ===
        1 &&
      isHighlightCandidate(
        currentAnalysis.items[0]
      );

    if (
      currentIsExplicitHighlight ||
      currentIsIconHighlight
    ) {
      const highlight =
        currentIsExplicitHighlight
          ? firstCurrentLine
          : currentAnalysis.items[0];

      const followingItems = [];

      let nextIndex =
        index + 1;

      while (
        nextIndex <
        description.length
      ) {
        const next =
          description[nextIndex];

        /*
         * Ignora paragraphs vazios.
         *
         * Isso é exatamente o formato enviado
         * pelo JSON desta descrição.
         */
        if (
          isEmptyDescriptionParagraph(
            next
          )
        ) {
          nextIndex += 1;
          continue;
        }

        if (
          !next ||
          next.type !== "paragraph"
        ) {
          break;
        }

        const nextAnalysis =
          analyzeParagraph(next);

        /*
         * Se encontrarmos outra lista visual
         * com emoji, ela pertence a outro bloco.
         */
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

        /*
         * Se o paragraph seguinte tem aparência
         * de característica, adiciona à lista.
         */
        if (
          nextItems.length > 0
        ) {
          followingItems.push(
            ...nextItems
          );

          nextIndex += 1;

          continue;
        }

        /*
         * Chegamos em texto normal.
         *
         * Exemplo do JSON:
         *
         * "Uma ótima opção para quem procura..."
         *
         * Nesse ponto a lista deve terminar.
         */
        break;
      }

      if (
        followingItems.length > 0
      ) {
        blocks.push({
          type: "highlight-list",
          highlight,
          items: followingItems
        });

        index = nextIndex;

        continue;
      }
    }

    /*
     * ==========================================================
     * LISTA DE ÍCONES
     * ==========================================================
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

        if (
          isEmptyDescriptionParagraph(
            next
          )
        ) {
          nextIndex += 1;
          continue;
        }

        if (
          !next ||
          next.type !== "paragraph"
        ) {
          break;
        }

        const nextAnalysis =
          analyzeParagraph(next);

        if (
          nextAnalysis?.type !==
          "icon"
        ) {
          break;
        }

        if (
          nextAnalysis.items.length ===
            1 &&
          isHighlightCandidate(
            nextAnalysis.items[0]
          )
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

    /*
     * ==========================================================
     * HIGHLIGHT + LISTA DENTRO DO MESMO PARAGRAPH
     * ==========================================================
     */
    if (
      currentAnalysis?.type ===
      "highlight-list"
    ) {
      blocks.push({
        type: "highlight-list",
        highlight:
          currentAnalysis.highlight,
        items:
          currentAnalysis.items
      });

      index += 1;

      continue;
    }

    /*
     * ==========================================================
     * OUTROS HEADINGS + PARAGRAPHS DE CARACTERÍSTICAS
     * ==========================================================
     */
    if (
      currentLines.length === 1 &&
      currentText.trim()
    ) {
      const firstLine =
        normalizeVisualLine(
          currentLines[0]
        );

      const followingItems = [];

      let nextIndex =
        index + 1;

      while (
        nextIndex <
        description.length
      ) {
        const next =
          description[nextIndex];

        if (
          isEmptyDescriptionParagraph(
            next
          )
        ) {
          nextIndex += 1;
          continue;
        }

        if (
          !next ||
          next.type !== "paragraph"
        ) {
          break;
        }

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

        break;
      }

      if (
        followingItems.length >= 1 &&
        isHighlightCandidate(
          firstLine
        )
      ) {
        blocks.push({
          type: "highlight-list",
          highlight: firstLine,
          items: followingItems
        });

        index = nextIndex;

        continue;
      }
    }

    /*
     * Paragraph normal.
     */
    blocks.push({
      type: "normal",
      desc: current
    });

    index += 1;
  }

  return blocks;
}

function VisualIconListItem({
  text
}) {
  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        alignItems: "flex-start",
        minWidth: 0,
        margin: 0,
        padding: 0,
        fontSize: "0.9rem",
        lineHeight: 1.55,
        wordBreak: "break-word",
        overflowWrap: "anywhere",
        whiteSpace: "normal"
      }}
    >
      <Box
        component="span"
        sx={{
          minWidth: 0,
          fontSize: "0.9rem",
          lineHeight: 1.55,
          wordBreak: "break-word",
          overflowWrap: "anywhere",
          whiteSpace: "normal"
        }}
      >
        {text}
      </Box>
    </Box>
  );
}

function VisualBulletListItem({
  text
}) {
  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        alignItems: "flex-start",
        minWidth: 0,
        margin: 0,
        padding: 0,
        fontSize: "0.9rem",
        lineHeight: 1.55,
        wordBreak: "break-word",
        overflowWrap: "anywhere",
        whiteSpace: "normal"
      }}
    >
      <Box
        component="span"
        sx={{
          flex: "0 0 auto",
          marginRight: "7px",
          fontSize: "0.9rem",
          lineHeight: 1.55
        }}
      >
        •
      </Box>

      <Box
        component="span"
        sx={{
          minWidth: 0,
          fontSize: "0.9rem",
          lineHeight: 1.55,
          wordBreak: "break-word",
          overflowWrap: "anywhere",
          whiteSpace: "normal"
        }}
      >
        {removeExistingBullet(text)}
      </Box>
    </Box>
  );
}

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
        marginLeft: "10px",
        marginTop: "0.35rem",
        marginBottom: "0.7rem",
        display: "grid",
        gridTemplateColumns:
          isMobile
            ? "minmax(0, 1fr)"
            : "repeat(2, minmax(0, 1fr))",
        columnGap: "1.5rem",
        rowGap: "0.45rem",
        width: "calc(100% - 10px)",
        maxWidth: "100%",
        boxSizing: "border-box",
        fontSize: "0.9rem"
      }}
    >
      {items.map(
        (item, index) =>
          type === "bullet" ? (
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

const detailVisits = new Set();

const detailFirstVisitInProgress =
  new Set();

const MIN_SKELETON_TIME = 200;

function getDetailVisitKey(
  idImovel,
  paramID
) {
  if (idImovel) {
    return `detailVisitada_${idImovel}`;
  }

  if (
    paramID !== null &&
    paramID !== ""
  ) {
    return `detailVisitada_${paramID}`;
  }

  return null;
}

function hasVisitedDetail(
  visitKey
) {
  if (!visitKey) {
    return false;
  }

  if (
    detailVisits.has(visitKey)
  ) {
    return true;
  }

  try {
    if (
      sessionStorage.getItem(
        visitKey
      ) === "true"
    ) {
      detailVisits.add(
        visitKey
      );

      return true;
    }
  } catch (error) {
    // Continua usando a memória da sessão.
  }

  return false;
}

function markDetailVisited(
  visitKey
) {
  if (!visitKey) {
    return;
  }

  detailVisits.add(
    visitKey
  );

  try {
    sessionStorage.setItem(
      visitKey,
      "true"
    );
  } catch (error) {
    // Não interrompe o carregamento.
  }
}

const CharacterDetail = ({
  realestate
}) => {
  const history =
    useHistory();

  const contentRef =
    useRef(null);

  const paramID =
    getParameterByName(
      "dcID"
    );

  const idImovel =
    window.location.pathname.match(
      /^\/imovel\/(\d+)/
    )?.[1];

  const visitKey =
    getDetailVisitKey(
      idImovel,
      paramID
    );

  const alreadyVisited =
    hasVisitedDetail(
      visitKey
    );

  const matchesCurrentProperty =
    Boolean(
      realestate &&
      Object.keys(realestate).length > 0 &&
      (
        (
          idImovel &&
          realestate?.id != null &&
          String(realestate.id) ===
            String(idImovel)
        ) ||
        (
          paramID !== null &&
          paramID !== "" &&
          realestate?.documentId != null &&
          String(realestate.documentId) ===
            String(paramID)
        ) ||
        (
          paramID !== null &&
          paramID !== "" &&
          realestate?.id != null &&
          String(realestate.id) ===
            String(paramID)
        )
      )
    );

  const firstVisitAlreadyStarted =
    visitKey
      ? detailFirstVisitInProgress.has(
          visitKey
        )
      : false;

  const shouldShowInitialSkeleton =
    !alreadyVisited ||
    firstVisitAlreadyStarted;

  const [loading, setLoading] =
    useState(
      shouldShowInitialSkeleton
    );

  const [imoveis, setImoveis] =
    useState(() => {
      if (
        alreadyVisited &&
        matchesCurrentProperty
      ) {
        return realestate;
      }

      return undefined;
    });

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

  const [
    copyCodigoOpen,
    setCopyCodigoOpen
  ] = useState(false);

  let rows = [];

  useEffect(() => {
    window.scrollTo(
      0,
      0
    );
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(
        window.innerWidth <= 1024
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

  useEffect(() => {
    if (
      !realestate ||
      Object.keys(realestate).length === 0
    ) {
      return;
    }

    const matchesCurrentProperty =
      Boolean(
        (
          idImovel &&
          realestate?.id != null &&
          String(
            realestate.id
          ) ===
            String(idImovel)
        ) ||
        (
          paramID !== null &&
          paramID !== "" &&
          realestate?.documentId != null &&
          String(
            realestate.documentId
          ) ===
            String(paramID)
        ) ||
        (
          paramID !== null &&
          paramID !== "" &&
          realestate?.id != null &&
          String(
            realestate.id
          ) ===
            String(paramID)
        )
      );

    if (
      !matchesCurrentProperty
    ) {
      return;
    }

    setImoveis(
      realestate
    );

    if (
      hasVisitedDetail(
        visitKey
      )
    ) {
      detailFirstVisitInProgress.delete(
        visitKey
      );

      setLoading(false);

      return;
    }

    detailFirstVisitInProgress.add(
      visitKey
    );

    markDetailVisited(
      visitKey
    );

    setLoading(true);

    const timer =
      setTimeout(() => {
        detailFirstVisitInProgress.delete(
          visitKey
        );

        setLoading(false);
      }, MIN_SKELETON_TIME);

    return () =>
      clearTimeout(timer);
  }, [
    realestate,
    idImovel,
    paramID,
    visitKey
  ]);

  useEffect(() => {
    if (!idImovel) {
      return;
    }

    const matchesCurrentProperty =
      Boolean(
        realestate &&
        Object.keys(
          realestate
        ).length > 0 &&
        (
          (
            realestate?.id != null &&
            String(
              realestate.id
            ) ===
              String(idImovel)
          ) ||
          (
            realestate?.documentId != null &&
            String(
              realestate.documentId
            ) ===
              String(idImovel)
          )
        )
      );

    if (
      matchesCurrentProperty
    ) {
      return;
    }

    const wasVisited =
      hasVisitedDetail(
        visitKey
      );

    let cancelled = false;

    const requestStart =
      Date.now();

    if (!wasVisited) {
      detailFirstVisitInProgress.add(
        visitKey
      );

      markDetailVisited(
        visitKey
      );

      setLoading(true);
    } else {
      detailFirstVisitInProgress.delete(
        visitKey
      );

      setLoading(false);
    }

    axios
      .get(
        `https://sublime-bat-ad2fca1255.strapiapp.com/api/Anuncios/?filters[id][$eq]=${idImovel}&populate=*`
      )
      .then(
        (response) => {
          if (cancelled) {
            return;
          }

          const data =
            response?.data?.data?.[0];

          if (data) {
            setImoveis(data);
          }

          if (wasVisited) {
            detailFirstVisitInProgress.delete(
              visitKey
            );

            setLoading(false);

            return;
          }

          const elapsed =
            Date.now() -
            requestStart;

          const remaining =
            Math.max(
              0,
              MIN_SKELETON_TIME -
                elapsed
            );

          setTimeout(() => {
            if (cancelled) {
              return;
            }

            detailFirstVisitInProgress.delete(
              visitKey
            );

            setLoading(false);
          }, remaining);
        }
      )
      .catch(
        (error) => {
          if (cancelled) {
            return;
          }

          console.log(
            "An error occurred:",
            error.response
          );

          detailFirstVisitInProgress.delete(
            visitKey
          );

          markDetailVisited(
            visitKey
          );

          setLoading(false);
        }
      );

    return () => {
      cancelled = true;
    };
  }, [
    idImovel,
    visitKey,
    realestate
  ]);

  useEffect(() => {
    if (
      paramID === null ||
      paramID === ""
    ) {
      return;
    }

    const matchesCurrentProperty =
      Boolean(
        realestate &&
        Object.keys(
          realestate
        ).length > 0 &&
        (
          (
            realestate?.documentId != null &&
            String(
              realestate.documentId
            ) ===
              String(paramID)
          ) ||
          (
            realestate?.id != null &&
            String(
              realestate.id
            ) ===
              String(paramID)
          )
        )
      );

    if (
      matchesCurrentProperty
    ) {
      return;
    }

    const wasVisited =
      hasVisitedDetail(
        visitKey
      );

    let cancelled = false;

    const requestStart =
      Date.now();

    if (!wasVisited) {
      detailFirstVisitInProgress.add(
        visitKey
      );

      markDetailVisited(
        visitKey
      );

      setLoading(true);
    } else {
      detailFirstVisitInProgress.delete(
        visitKey
      );

      setLoading(false);
    }

    axios
      .get(
        `https://sublime-bat-ad2fca1255.strapiapp.com/api/Anuncios/${paramID}?status=published&populate[0]=Fotos`
      )
      .then(
        (response) => {
          if (cancelled) {
            return;
          }

          const data =
            response?.data?.data;

          if (data) {
            setImoveis(data);
          }

          if (wasVisited) {
            detailFirstVisitInProgress.delete(
              visitKey
            );

            setLoading(false);

            return;
          }

          const elapsed =
            Date.now() -
            requestStart;

          const remaining =
            Math.max(
              0,
              MIN_SKELETON_TIME -
                elapsed
            );

          setTimeout(() => {
            if (cancelled) {
              return;
            }

            detailFirstVisitInProgress.delete(
              visitKey
            );

            setLoading(false);
          }, remaining);
        }
      )
      .catch(
        (error) => {
          if (cancelled) {
            return;
          }

          console.log(
            "An error occurred:",
            error.response
          );

          detailFirstVisitInProgress.delete(
            visitKey
          );

          markDetailVisited(
            visitKey
          );

          setLoading(false);
        }
      );

    return () => {
      cancelled = true;
    };
  }, [
    paramID,
    visitKey,
    realestate
  ]);

  useEffect(() => {
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

  function createData(
    name,
    info
  ) {
    return {
      name,
      info
    };
  }

  const handleClickOpen =
    () => {
      setOpen(true);
    };

  const handleCopyCodigo =
    async () => {
      const codigo =
        imoveis?.codigo;

      if (!codigo) {
        return;
      }

      const codigoParaCopiar =
        String(codigo).trim();

      try {
        if (
          navigator.clipboard &&
          window.isSecureContext
        ) {
          await navigator.clipboard.writeText(
            codigoParaCopiar
          );
        } else {
          const textArea =
            document.createElement(
              "textarea"
            );

          textArea.value =
            codigoParaCopiar;

          textArea.style.position =
            "fixed";

          textArea.style.left =
            "-9999px";

          textArea.style.top =
            "0";

          document.body.appendChild(
            textArea
          );

          textArea.focus();

          textArea.select();

          document.execCommand(
            "copy"
          );

          document.body.removeChild(
            textArea
          );
        }

        setCopyCodigoOpen(true);
      } catch (error) {
        console.error(
          "Não foi possível copiar o código do imóvel:",
          error
        );
      }
    };

  const handleCloseCopyCodigo =
    () => {
      setCopyCodigoOpen(false);
    };

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
          imoveis?.Andar !== null
            ? imoveis.Andar + "º"
            : ""
        ),
        createData(
          "Área terreno",
          imoveis?.Area_Terreno !== null
            ? imoveis.Area_Terreno +
              " (m²)"
            : "Sem Informação"
        ),
        createData(
          "Ano de construção",
          imoveis?.Ano_de_Construcao !== null
            ? imoveis.Ano_de_Construcao
            : "Sem Informação"
        ),
        createData(
          "Condomínio",
          imoveis?.Condominio !== null &&
          imoveis.Condominio
            ? "R$" +
              imoveis.Condominio
            : "Sem Informação"
        ),
        createData(
          "IPTU (anual)",
          imoveis?.IPTU !== null
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
          imoveis?.Quartos !== null
            ? imoveis.Quartos
            : "Sem Informação"
        ),
        createData(
          "Suítes",
          imoveis?.Suites !== null
            ? imoveis.Suites
            : "Sem Informação"
        ),
        createData(
          "Banheiros",
          imoveis?.Banheiros !== null
            ? imoveis.Banheiros
            : "Sem Informação"
        )
      ];

      rows = rows.filter(
        (item) =>
          item.info !== ""
      );
    } else {
      rows = [
        createData(
          "Andar",
          imoveis?.Andar !== null
            ? imoveis.Andar + "º"
            : ""
        ),
        createData(
          "Área terreno",
          imoveis?.Area_Terreno !== null
            ? imoveis.Area_Terreno +
              " (m²)"
            : "Sem Informação"
        ),
        createData(
          "Condomínio",
          imoveis?.Condominio !== null &&
          imoveis.Condominio
            ? "R$" +
              imoveis?.Condominio
            : "Sem Informação"
        ),
        createData(
          "IPTU (anual)",
          imoveis?.IPTU !== null
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
          imoveis?.Quartos !== null
            ? imoveis.Quartos
            : ""
        ),
        createData(
          "Suítes",
          imoveis?.Suites !== null
            ? imoveis.Suites
            : ""
        ),
        createData(
          "Banheiros",
          imoveis?.Banheiros !== null
            ? imoveis.Banheiros
            : "Sem Informação"
        )
      ];

      rows = rows.filter(
        (item) =>
          item.info !== ""
      );
    }
  }

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
                        onClick={
                          handleCopyCodigo
                        }
                        role="button"
                        tabIndex={0}
                        onKeyDown={(
                          event
                        ) => {
                          if (
                            event.key ===
                              "Enter" ||
                            event.key ===
                              " "
                          ) {
                            event.preventDefault();

                            handleCopyCodigo();
                          }
                        }}
                        title="Clique para copiar o código do imóvel"
                        style={{
                          display:
                            "block",
                          cursor:
                            "pointer"
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

                {buildDescriptionBlocks(
                  imoveis?.descricao
                ).map(
                  (
                    block,
                    index
                  ) => {
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
                                "0.25rem"
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
                              "calc(100% - 10px)"
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

                    const text =
                      block.desc?.type ===
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

      <Dialog
        open={copyCodigoOpen}
        onClose={
          handleCloseCopyCodigo
        }
        aria-labelledby="copy-codigo-dialog-title"
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle
          id="copy-codigo-dialog-title"
          sx={{
            fontSize: "1rem",
            fontWeight: 600
          }}
        >
          Código do imóvel
        </DialogTitle>

        <DialogContent>
          <Typography
            sx={{
              fontSize: "0.95rem",
              lineHeight: 1.5
            }}
          >
            código do imovel copiado com sucesso !
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={
              handleCloseCopyCodigo
            }
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

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