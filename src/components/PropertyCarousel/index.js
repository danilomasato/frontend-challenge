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
          {!isFirstSlide && (
            <ButtonBack>
              ‹
            </ButtonBack>
          )}

          {!isLastSlide && (
            <ButtonNext>
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
   * Identifica quando o conteúdo dos slides mudou.
   *
   * Isso acontece quando a paginação troca, por exemplo:
   * página 2 -> página 1.
   *
   * Usamos os IDs dos imóveis para detectar a mudança,
   * mesmo que a quantidade de slides continue igual.
   */
  const slidesKey = slides
    .map((group) =>
      group
        .map((card) => card.id ?? card.documentId ?? '')
        .join(',')
    )
    .join('|');

  /*
   * Quando os imóveis mudarem por causa da paginação,
   * volta para o primeiro slide.
   *
   * O reset acontece somente quando o conteúdo realmente
   * muda. A lógica da altura continua independente.
   */
  useEffect(() => {
    if (carouselContext.state.currentSlide !== 0) {
      carouselContext.setStoreState({
        currentSlide: 0
      });
    }
  }, [slidesKey, carouselContext]);

  /*
   * Último slide do carrossel.
   */
  const isLastSlide =
    currentSlide === slides.length - 1;

  /*
   * No desktop, quando o último slide possui menos
   * de 4 imóveis, ele ocupa somente uma linha.
   *
   * Nesse caso reduzimos a altura de 730px para 362px.
   */
  const isLastSlideWithLessThanFourCards =
    !isMobile &&
    isLastSlide &&
    slides[currentSlide]?.length < 4;

  /*
   * Altura animada do carrossel.
   */
  const animatedHeight =
    isLastSlideWithLessThanFourCards
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