import React, { useEffect, useMemo, useState } from "react";
import "./LandingPage.css";

const params = new URLSearchParams(window.location.search);
const useLocalApi = ["1", "true", "yes"].includes((params.get("local") || "").toLowerCase());
const configuredApiBase = useLocalApi
  ? process.env.REACT_APP_API_URL_LOCAL
  : process.env.REACT_APP_API_URL;
const API_BASE = (configuredApiBase || "").replace(/\/+$/, "");
const STRAPI_BASE = API_BASE.replace(/\/api$/, "");

const unwrap = (value) => {
  if (!value) return null;
  if (Array.isArray(value)) return value.map(unwrap);
  if (value.data !== undefined) return unwrap(value.data);
  if (value.attributes) return { id: value.id, ...value.attributes };
  return value;
};

const getImageUrl = (value) => {
  // O Strapi v5 pode devolver mídia como objeto direto, relação data/attributes,
  // array, ou objeto com formats. Percorre a estrutura para não depender de um
  // único formato de resposta.
  const seen = new Set();
  const candidates = [];
  const visit = (node) => {
    if (!node || typeof node !== "object" || seen.has(node)) return;
    seen.add(node);
    if (typeof node.url === "string" && node.url.trim()) candidates.push(node.url.trim());
    if (node.formats && typeof node.formats === "object") {
      ["large", "medium", "small", "thumbnail"].forEach((key) => {
        const url = node.formats[key]?.url;
        if (typeof url === "string" && url.trim()) candidates.push(url.trim());
      });
    }
    Object.values(node).forEach(visit);
  };
  if (typeof value === "string") candidates.push(value.trim());
  else visit(value);
  const url = candidates.find(Boolean);
  if (!url) return "";
  if (/^(https?:)?\/\//i.test(url)) {
    return url.startsWith("//") ? `${window.location.protocol}${url}` : url;
  }
  if (!STRAPI_BASE) return url;
  return `${STRAPI_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
};

const textValue = (value) => {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map(textValue).filter(Boolean).join(" ");
  if (!value || typeof value !== "object") return "";
  if (value.text) return value.text;
  if (value.children) return textValue(value.children);
  if (value.body) return textValue(value.body);
  if (value.descricao) return textValue(value.descricao);
  if (value.titulo) return textValue(value.titulo);
  return "";
};

const getHostSubdomain = () => {
  const params = new URLSearchParams(window.location.search);
  const localPreview = params.get("landing");
  if (localPreview) return localPreview.toLowerCase();

  const hostname = window.location.hostname.toLowerCase().split(":")[0];
  const configuredBase = (process.env.REACT_APP_BASEURL || "https://tudosobreap.com.br")
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "")
    .toLowerCase();

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    // Em modo local, permite abrir a landing page sem subdomínio real.
    // Se ?landing=slug estiver presente, esse slug será usado como filtro.
    return useLocalApi ? "__local_preview__" : "";
  }
  if (hostname === configuredBase || hostname === `www.${configuredBase}`) return "";
  if (hostname.endsWith(`.${configuredBase}`)) {
    const prefix = hostname.slice(0, -(configuredBase.length + 1));
    return prefix && !prefix.includes(".") && prefix !== "www" ? prefix : "";
  }
  return "";
};

const getCards = (value) => {
  const cards = unwrap(value);
  if (!cards) return [];
  return Array.isArray(cards) ? cards : [cards];
};

const LandingPage = ({ subdomain }) => {
  const [landing, setLanding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!API_BASE || !subdomain) {
        setError(true);
        setLoading(false);
        return;
      }
      try {
        // Consulta validada no Strapi: carrega somente registros publicados,
        // filtra pelo subdomínio e popula os cards com suas imagens relacionadas.
        const params = new URLSearchParams();
        params.set("status", "published");
        const localPreviewMode = subdomain === "__local_preview__";
        if (!localPreviewMode) params.set("filters[subdominio][$eq]", subdomain);
        params.set("populate[imagemTopo]", "true");
        params.set("populate[cardsConteudo1][populate]", "*");
        params.set("pagination[pageSize]", "100");
        const query = `${API_BASE}/landing-pages?${params.toString()}`;
        const response = await fetch(query, {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        if (!response.ok) throw new Error(`Não foi possível carregar a landing page (HTTP ${response.status}).`);
        const json = await response.json();
        const rawRecords = Array.isArray(json?.data) ? json.data : json?.data ? [json.data] : [];
        const records = rawRecords.map(unwrap).filter(Boolean);
        // Algumas respostas podem conter mais de um locale/registro. Seleciona
        // somente o subdomínio solicitado e prioriza a versão com publishedAt.
        const requestedLanding = new URLSearchParams(window.location.search).get("landing");
        const requestedSlug = (requestedLanding || new URLSearchParams(window.location.search).get("subdominio") || "").toLowerCase();
        const matching = localPreviewMode && !requestedSlug
          ? records
          : records.filter((item) =>
              String(item.subdominio || "").toLowerCase() === String(requestedSlug || subdomain).toLowerCase()
            );
        const first = matching.find((item) => Boolean(item.publishedAt)) || matching[0] || null;
        if (active) {
          setLanding(first);
          setError(!first);
        }
      } catch (e) {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [subdomain]);

  const gallery = useMemo(() => getCards(landing?.imagensGaleria), [landing]);
  const cards1 = useMemo(() => getCards(landing?.cardsConteudo1), [landing]);
  const cards2 = useMemo(() => getCards(landing?.cardsConteudo2), [landing]);
  const heroImage = getImageUrl(
    landing?.imagemTopo || landing?.imagem_topo || landing?.imagemPrincipal || landing?.imagemCapa
  );
  const logoImage = getImageUrl(landing?.logo);
  const phone = textValue(landing?.telefoneContato).replace(/\D/g, "");
  const whatsappUrl = phone ? `https://wa.me/${phone.startsWith("55") ? phone : `55${phone}`}` : "#contato";

  if (loading) return <main className="landing-state"><span className="landing-spinner" />Carregando empreendimento...</main>;
  if (error || !landing) return <main className="landing-state"><h1>Empreendimento não encontrado</h1><p>Não encontramos uma página publicada para este endereço.</p></main>;

  return (
    <main className="landing-page">
      <header className="landing-header">
        <a className="landing-brand" href="#inicio" aria-label={landing.nomeEmpreendimento || "Início"}>
          {logoImage ? <img src={logoImage} alt={landing.nomeEmpreendimento || "Logo do empreendimento"} /> : <span>{textValue(landing.nomeEmpreendimento)}</span>}
        </a>
        <nav className="landing-nav"><a href="#empreendimento">O empreendimento</a><a href="#galeria">Galeria</a><a href="#contato" className="landing-nav-cta">Tenho interesse</a></nav>
      </header>

      <section className={`landing-hero ${heroImage ? "has-image" : ""}`} id="inicio" style={heroImage ? { backgroundImage: `linear-gradient(90deg, rgba(12,24,36,.72), rgba(12,24,36,.12)), url("${heroImage}")` } : undefined}>
        <div className="landing-hero-layout">
          <div className="landing-hero-content">
            {landing.subTituloTopo && <p className="landing-eyebrow">{textValue(landing.subTituloTopo)}</p>}
            <h1>{textValue(landing.tituloTopo) || textValue(landing.nomeEmpreendimento)}</h1>
            {landing.descricaoTopo && <p className="landing-hero-description">{textValue(landing.descricaoTopo)}</p>}
            <a className="landing-button" href={whatsappUrl} target={phone ? "_blank" : undefined} rel={phone ? "noreferrer" : undefined}>Quero conhecer</a>
          </div>
          <form className="landing-hero-form" onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            const name = String(data.get("nome") || "").trim();
            const surname = String(data.get("sobrenome") || "").trim();
            const email = String(data.get("email") || "").trim();
            const message = String(data.get("mensagem") || "").trim();
            const body = `Olá! Tenho interesse em ${textValue(landing.nomeEmpreendimento)}.\nNome: ${name} ${surname}\nE-mail: ${email}\nMensagem: ${message}`;
            if (phone) window.open(`https://wa.me/${phone.startsWith("55") ? phone : `55${phone}`}?text=${encodeURIComponent(body)}`, "_blank", "noopener,noreferrer");
            else window.location.href = `mailto:?subject=${encodeURIComponent(`Interesse em ${textValue(landing.nomeEmpreendimento)}`)}&body=${encodeURIComponent(body)}`;
          }}>
            <h2>Seu nova casa aguarda.</h2>
            <p>Entre em contato e receba uma oferta exclusiva.</p>
            <div className="landing-form-name-row">
              <input name="nome" aria-label="Nome" placeholder="Digite seu nome" required />
              <input name="sobrenome" aria-label="Sobrenome" placeholder="Digite seu sobrenome" required />
            </div>
            <input type="email" name="email" aria-label="E-mail" placeholder="Digite seu e-mail" required />
            <textarea name="mensagem" aria-label="Mensagem" placeholder="Digite sua mensagem aqui..." rows="3" required />
            <button type="submit">Contato</button>
          </form>
        </div>
        <div className="landing-hero-caption">{textValue(landing.nomeEmpreendimento)}</div>
      </section>

      <section className="landing-section landing-intro" id="empreendimento">
        <p className="landing-section-kicker">Conheça</p>
        <h2>{textValue(landing.tituloConteudo1) || textValue(landing.nomeEmpreendimento)}</h2>
        {cards1.length > 0 && <div className="landing-property-list">{cards1.map((card, index) => { const cardImage = getImageUrl(card.imagem || card.imagemCard || card.foto || card.image || card.capa) || getImageUrl(gallery[index]); const price = Number(card.preco); const formattedPrice = card.preco !== null && card.preco !== undefined && card.preco !== "" && Number.isFinite(price) ? (price < 1000 ? price * 1000000 : price).toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 }) : ""; return <article className={`landing-property-row${index % 2 === 1 ? " image-right" : ""}`} key={card.id || index}>{cardImage ? <div className="landing-property-image"><img src={cardImage} alt={textValue(card.titulo || card.tituloCard || card.nome) || `Imagem ${index + 1}`} loading="lazy" /></div> : <div className="landing-property-image landing-property-image-empty" aria-hidden="true" />}<div className="landing-property-content"><h3>{textValue(card.titulo || card.tituloCard || card.nome)}</h3>{card.quartos && <strong>{textValue(card.quartos)} quartos</strong>}<p>{textValue(card.descricao || card.descricaoCard || card.texto || card.conteudo)}</p>{formattedPrice && <span className="landing-property-price">{formattedPrice}</span>}</div></article>; })}</div>}
      </section>

      {gallery.length > 0 && <section className="landing-gallery-section" id="galeria"><div className="landing-section"><p className="landing-section-kicker">Espaços e detalhes</p><h2>Galeria</h2><div className="landing-gallery">{gallery.map((item, index) => { const url = getImageUrl(item); return url ? <figure key={item.id || index}><img src={url} alt={`${textValue(landing.nomeEmpreendimento)} - imagem ${index + 1}`} loading="lazy" /></figure> : null; })}</div></div></section>}

      <section className="landing-section landing-details">
        <p className="landing-section-kicker">Mais sobre</p>
        <h2>{textValue(landing.tituloConteudo2) || "Um lugar para viver novas experiências"}</h2>
        {cards2.length > 0 && <div className="landing-cards landing-cards-secondary">{cards2.map((card, index) => { const cardImage = getImageUrl(card.imagem || card.imagemCard || card.foto || card.image || card.capa); return <article className={`landing-info-card${cardImage ? " has-card-image" : ""}`} key={card.id || index}>{cardImage && <div className="landing-info-card-image"><img src={cardImage} alt={textValue(card.titulo || card.tituloCard || card.nome) || `Imagem ${index + 1}`} loading="lazy" /></div>}<div className="landing-info-card-content">{textValue(card.titulo || card.tituloCard || card.nome) && <h3>{textValue(card.titulo || card.tituloCard || card.nome)}</h3>}<p>{textValue(card.descricao || card.descricaoCard || card.texto || card.conteudo)}</p></div></article>; })}</div>}
      </section>

      <section className="landing-contact" id="contato"><div><p className="landing-section-kicker">Fale com nossa equipe</p><h2>Seu próximo capítulo começa aqui.</h2><p>Entre em contato para receber mais informações sobre o empreendimento.</p></div><a className="landing-button landing-button-light" href={whatsappUrl} target={phone ? "_blank" : undefined} rel={phone ? "noreferrer" : undefined}>{phone ? "Conversar pelo WhatsApp" : "Tenho interesse"}</a></section>
      <footer className="landing-footer">{textValue(landing.nomeEmpreendimento)} <span>•</span> Todos os direitos reservados</footer>
    </main>
  );
};

export { getHostSubdomain };
export default LandingPage;
