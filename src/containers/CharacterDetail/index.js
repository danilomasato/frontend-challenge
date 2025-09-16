import React, { useState, useEffect } from "react";
import { withRouter, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { Container } from "../../components";
import CardDetail from "../../components/CardDetail";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Header } from "../../components/Header";
import { TopInfo } from "../../components/TopInfo";
import { TopHeader } from "../../components/TopHeader";
import { Footer } from "../../components/Footer";

const CharacterDetail = ({ characterDetail }) => {
  const history = useHistory();

  return (
    <React.Fragment>
      <TopInfo />
        <Header />
        <TopHeader />
      <Container>
        <CardDetail data={characterDetail} />
      </Container>

      <Footer />

      <Stack className="center" direction="row" spacing={10}>
          <Button onClick={(e) => { history.push('/') } }>Voltar</Button>
      </Stack>
    </React.Fragment>
  );
};

const mapStateToProps = state => ({
  characterDetail: state.character
});

export default withRouter(connect(mapStateToProps)(CharacterDetail));