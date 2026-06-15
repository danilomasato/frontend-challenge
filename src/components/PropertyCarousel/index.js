import React, { useState, useEffect } from 'react';
import "../Card/Card.css";
import { Container } from "../../components";
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import PropertyCard from "../PropertyCard";

const PropertyCarousel = ({ title, items }) => {

  const Root = styled('div')(({ theme }) => ({
    width: '100%',
    ...theme.typography.body2,
    color: (theme.vars || theme).palette.text.secondary,
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

  const slides = chunkArray(items, 6);

  if (!items.length) return null;

  return (
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

      <Container className="home" style={{ height: items.length <= 3 ? '360px' : '720px' }}>
        <CarouselProvider
          naturalSlideWidth={400}
          naturalSlideHeight={342}
          totalSlides={slides.length}
          visibleSlides={1}
          step={1}
        >
          <Slider style={{ height: items.length <= 3 ? '360px' : '720px' }}>
            {slides.map((group, index) => (
              <Slide key={index} index={index}>
                <div className="cards-grid">
                  {group.map((card, index)=> (
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

          {slides.length > 1 && (
            <>
              <ButtonBack>‹</ButtonBack>
              <ButtonNext>›</ButtonNext>
            </>
          )}
        </CarouselProvider>
      </Container>
    </>
  );
};

export default PropertyCarousel;
