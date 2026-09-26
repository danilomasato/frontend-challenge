import React, { useState, useEffect, useContext } from 'react';
import "../Card/Card.css";
import { Container } from "../../components";
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
  CarouselContext
} from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import PropertyCard from "../PropertyCard";

/*
 * SVG usado como destaque visual atrás dos botões
 * do carrossel desktop.
 *
 * O SVG original fica no lado direito (Next).
 * No lado esquerdo (Prev), usamos o mesmo SVG
 * espelhado horizontalmente.
 */
const carouselGlowSvg = `
<svg width="520" height="700" viewBox="0 0 520 700" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient
      id="glow"
      cx="0"
      cy="0"
      r="1"
      gradientUnits="userSpaceOnUse"
      gradientTransform="translate(455 350) rotate(90) scale(260 300)"
    >
      <stop offset="0" stop-color="#1687E8" stop-opacity="0.13"/>
      <stop offset="0.45" stop-color="#1687E8" stop-opacity="0.055"/>
      <stop offset="1" stop-color="#1687E8" stop-opacity="0"/>
    </radialGradient>

    <linearGradient
      id="curve"
      x1="100"
      y1="100"
      x2="500"
      y2="600"
      gradientUnits="userSpaceOnUse"
    >
      <stop stop-color="#1687E8" stop-opacity="0"/>
      <stop offset="0.5" stop-color="#1687E8" stop-opacity="0.11"/>
      <stop offset="1" stop-color="#7656D9" stop-opacity="0"/>
    </linearGradient>

    <filter
      id="blur"
      x="-30%"
      y="-30%"
      width="160%"
      height="160%"
    >
      <feGaussianBlur stdDeviation="22"/>
    </filter>
  </defs>

  <ellipse
    cx="470"
    cy="350"
    rx="230"
    ry="260"
    fill="url(#glow)"
    filter="url(#blur)"
  />

  <path
    d="M520 105C410 125 335 195 350 290C365 385 465 405 520 350"
    stroke="url(#curve)"
    stroke-width="2"
    stroke-linecap="round"
  />

  <path
    d="M520 155C435 175 385 225 397 292C409 360 475 378 520 340"
    stroke="#1687E8"
    stroke-opacity="0.045"
    stroke-width="1.5"
    stroke-linecap="round"
  />

  <path
    d="M520 540C425 515 370 455 382 390"
    stroke="#7656D9"
    stroke-opacity="0.035"
    stroke-width="2"
    stroke-linecap="round"
  />
</svg>
`;

const svgToDataUri = (svg) =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

const carouselGlowBackground = svgToDataUri(carouselGlowSvg);

const CarouselControls = ({
  isMobile,
  slidesLength
}) => {

  const carouselContext = useContext(CarouselContext);

  const [currentSlide, setCurrentSlide] = useState(
    carouselContext.state.currentSlide
  );

  useEffect(() => {
    const handleChange = () => {
      setCurrentSlide(carouselContext.state.currentSlide);
    };

    carouselContext.subscribe(handleChange);

    return () => {
      carouselContext.unsubscribe(handleChange);
    };
  }, [carouselContext]);

  const isFirstSlide = currentSlide === 0;
  const isLastSlide = currentSlide >= slidesLength - 1;

  return (
    <>
      {isMobile ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '8px',
            height: '38px',
            minHeight: '38px',
            margin: '0 0 8px 0',
            padding: '0 4px 0 0',
            position: 'relative',
            width: 'auto',
            zIndex: 100
          }}
        >

          {/* BOTÃO BACK MOBILE */}
          <ButtonBack
            aria-label="Imóveis anteriores"
            disabled={isFirstSlide}
            style={{
              width: '34px',
              height: '34px',
              minWidth: '34px',
              maxWidth: '34px',
              padding: 0,
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: '50%',
              background: isFirstSlide
                ? 'rgba(245, 245, 245, 0.72)'
                : 'rgba(255, 255, 255, 0.92)',
              color: isFirstSlide ? '#999' : '#1976d2',
              fontFamily: 'Arial, sans-serif',
              fontSize: '23px',
              fontWeight: 300,
              lineHeight: 1,
              boxShadow: isFirstSlide
                ? 'none'
                : '0 2px 7px rgba(0, 0, 0, 0.08)',
              backdropFilter: 'blur(5px)',
              WebkitBackdropFilter: 'blur(5px)',
              cursor: isFirstSlide ? 'default' : 'pointer',
              opacity: isFirstSlide ? 0.28 : 1,
              transition:
                'transform 0.18s ease, background-color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease'
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                lineHeight: 1,
                transform: 'translateY(-1px)'
              }}
            >
              ‹
            </span>
          </ButtonBack>

          {/* BOTÃO NEXT MOBILE */}
          <ButtonNext
            aria-label="Próximos imóveis"
            disabled={isLastSlide}
            style={{
              width: '34px',
              height: '34px',
              minWidth: '34px',
              maxWidth: '34px',
              padding: 0,
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: '50%',
              background: isLastSlide
                ? 'rgba(245, 245, 245, 0.72)'
                : 'rgba(255, 255, 255, 0.92)',
              color: isLastSlide ? '#999' : '#1976d2',
              fontFamily: 'Arial, sans-serif',
              fontSize: '23px',
              fontWeight: 300,
              lineHeight: 1,
              boxShadow: isLastSlide
                ? 'none'
                : '0 2px 7px rgba(0, 0, 0, 0.08)',
              backdropFilter: 'blur(5px)',
              WebkitBackdropFilter: 'blur(5px)',
              cursor: isLastSlide ? 'default' : 'pointer',
              opacity: isLastSlide ? 0.28 : 1,
              transition:
                'transform 0.18s ease, background-color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease'
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                lineHeight: 1,
                transform: 'translateY(-1px)'
              }}
            >
              ›
            </span>
          </ButtonNext>
        </div>
      ) : (
        <>
          {/* 
           * GLOW ESQUERDO / PREV
           *
           * IMPORTANTE:
           * O SVG original possui o brilho concentrado
           * no lado direito.
           *
           * Por isso usamos backgroundPosition: right center
           * antes de espelhar o elemento horizontalmente.
           *
           * Resultado:
           * SVG aparece na esquerda da viewport,
           * com a mesma aparência do SVG direito,
           * porém invertido horizontalmente.
           */}
          {!isFirstSlide && (
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: 'calc((100vw - 100%) / -2)',
                top: '0',
                width: '300px',
                height: '100%',
                backgroundImage: `url("${carouselGlowBackground}")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right center',
                backgroundSize: 'auto 100%',
                transform: 'scaleX(-1)',
                transformOrigin: 'center center',
                pointerEvents: 'none',
                zIndex: 0
              }}
            />
          )}

          {/* 
           * GLOW DIREITO / NEXT
           *
           * SVG original.
           */}
          {!isLastSlide && (
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                right: 'calc((100vw - 100%) / -2)',
                top: '0',
                width: '300px',
                height: '100%',
                backgroundImage: `url("${carouselGlowBackground}")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right center',
                backgroundSize: 'auto 100%',
                pointerEvents: 'none',
                zIndex: 0
              }}
            />
          )}

          {/* BOTÃO BACK DESKTOP */}
          {!isFirstSlide && (
            <ButtonBack
              aria-label="Imóveis anteriores"
              style={{
                zIndex: 10
              }}
            >
              ‹
            </ButtonBack>
          )}

          {/* BOTÃO NEXT DESKTOP */}
          {!isLastSlide && (
            <ButtonNext
              aria-label="Próximos imóveis"
              style={{
                zIndex: 10
              }}
            >
              ›
            </ButtonNext>
          )}
        </>
      )}
    </>
  );
};

const CarouselContent = ({
  slides,
  carouselHeight,
  isMobile
}) => {

  const carouselContext = useContext(CarouselContext);

  const [currentSlide, setCurrentSlide] = useState(
    carouselContext.state.currentSlide
  );

  useEffect(() => {
    const handleChange = () => {
      setCurrentSlide(carouselContext.state.currentSlide);
    };

    carouselContext.subscribe(handleChange);

    return () => {
      carouselContext.unsubscribe(handleChange);
    };
  }, [carouselContext]);

  /*
   * Identifica quando os imóveis mudaram por causa
   * da troca de página da paginação.
   */
  const slidesKey = slides
    .map((group) =>
      group
        .map((card) => card.id ?? card.documentId ?? '')
        .join(',')
    )
    .join('|');

  /*
   * Quando a página muda, volta o carrossel para
   * o primeiro slide.
   */
  useEffect(() => {
    if (carouselContext.state.currentSlide !== 0) {
      carouselContext.setStoreState({
        currentSlide: 0
      });
    }
  }, [slidesKey, carouselContext]);

  const isLastSlide =
    currentSlide === slides.length - 1;

  /*
   * Regra de altura:
   *
   * DESKTOP:
   * último slide com menos de 4 itens = 362px
   *
   * MOBILE:
   * último slide com menos de 2 itens = 362px
   *
   * Nos demais casos mantém a altura original.
   */
  const isLastSlideWithReducedHeight =
    isLastSlide &&
    (
      (!isMobile && slides[currentSlide]?.length < 4) ||
      (isMobile && slides[currentSlide]?.length < 2)
    );

  const animatedHeight =
    isLastSlideWithReducedHeight
      ? '362px'
      : carouselHeight;

  return (
    <Container
      className="home carousel-wrapper"
      style={{
        position: 'relative',
        height: animatedHeight,
        marginBottom: isMobile ? '30px' : '',
        transition: 'height 0.35s ease'
      }}
    >
      <Slider
        style={{
          position: 'relative',
          zIndex: 1,
          height: animatedHeight,
          transition: 'height 0.35s ease'
        }}
      >
        {slides.map((group, index) => (
          <Slide
            key={index}
            index={index}
          >
            <div className="cards-grid">
              {group.map((card, index) => (
                <PropertyCard
                  key={card.id}
                  card={card}
                  count={index}
                />
              ))}
            </div>
          </Slide>
        ))}
      </Slider>

      {!isMobile && slides.length > 1 && (
        <CarouselControls
          isMobile={isMobile}
          slidesLength={slides.length}
        />
      )}
    </Container>
  );
};

const PropertyCarousel = ({ title, items }) => {

  const [isMobile, setIsMobile] = useState(
    window.innerWidth <= 1024
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const Root = styled('div')(({ theme }) => ({
    width: '100%',
    ...theme.typography.body2,
    color: (theme.vars || theme).palette.text.secondary,
    position: 'relative',
    '& > :not(style) ~ :not(style)': {
      marginTop: theme.spacing(2),
    },
  }));

  const chunkArray = (array, size = 6) => {
    const chunks = [];

    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }

    return chunks;
  };

  const itemsPerSlide = isMobile ? 2 : 6;

  const slides = chunkArray(
    items,
    itemsPerSlide
  );

  const carouselHeight = !isMobile
    ? title === "Lançamentos"
      ? "360px"
      : "730px"
    : "730px";

  return (
    <>
      {isMobile ? (
        <CarouselProvider
          naturalSlideWidth={400}
          naturalSlideHeight={342}
          totalSlides={slides.length}
          visibleSlides={1}
          step={1}
        >
          <Root>

            {slides.length > 1 && (
              <CarouselControls
                isMobile={isMobile}
                slidesLength={slides.length}
              />
            )}

            <Divider className="divider">
              <Chip
                className="divider-chip"
                label={title}
                size="small"
              />
            </Divider>

          </Root>

          <CarouselContent
            slides={slides}
            carouselHeight={carouselHeight}
            isMobile={isMobile}
          />
        </CarouselProvider>
      ) : (
        <>
          <Root>

            <Divider className="divider">
              <Chip
                className="divider-chip"
                label={title}
                size="small"
              />
            </Divider>

          </Root>

          <CarouselProvider
            naturalSlideWidth={400}
            naturalSlideHeight={342}
            totalSlides={slides.length}
            visibleSlides={1}
            step={1}
          >
            <CarouselContent
              slides={slides}
              carouselHeight={carouselHeight}
              isMobile={isMobile}
            />
          </CarouselProvider>
        </>
      )}
    </>
  );
};

export default PropertyCarousel;