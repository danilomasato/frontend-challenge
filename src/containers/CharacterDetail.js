import React from "react";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Container } from "../components";
import { getCharacterData } from "../actions";
// import "./Character.css";
import Card from "../components/Card";

const CharacterDetail = ({ character }) => {
  return (
    <React.Fragment>
      <Container>
        <Card data={character} />
      </Container>
    </React.Fragment>
  );
};

const mapStateToProps = state => ({
  character: state.home
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getCharacterData: dispatch(getCharacterData())
    },
    dispatch
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CharacterDetail));
