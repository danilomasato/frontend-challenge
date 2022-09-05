import React from "react";
import { withRouter, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { Container } from "../../components";
import CardDetail from "../../components/CardDetail";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const CharacterDetail = ({ characterDetail }) => {
  const history = useHistory();

  return (
    <React.Fragment>
      <Container>
        <CardDetail data={characterDetail} />
      </Container>

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