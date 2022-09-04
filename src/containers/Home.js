import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Container } from "../components";
import { getCharacterData } from "../actions";
import "./Home.css";
import Card from "../components/Card";

const Home = ({ character }) => {
  const [menu, setMenu] = useState([
    {
      title: "Home",
      action: "/"
    }
  ]);

  return (
    <React.Fragment>
      <Container menu={menu}>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
