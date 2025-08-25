import React from "react";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Container } from "../../components";
import { getArticles } from "../../actions";
import "./Home.css";
import Card from "../../components/Card";
import Pagination from "../../components/Pagination";

const Home = ({ character }) => {
  return (
    <React.Fragment>
      <Container>
        <Card data={character}  />
      </Container>
      
      <Pagination data={character}  />
    </React.Fragment>
  );
};

const mapStateToProps = state => ({
  character: state.home
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getArticles: dispatch(getArticles())
    },
    dispatch
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
