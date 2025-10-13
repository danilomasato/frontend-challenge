import React from "react";
import { Switch, Route, HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import Home  from "./Home";
import CharacterDetail from "./CharacterDetail";
import Contact from "./Contact";

import "./App.css";

const App = ({ store }) => (
  <Provider store={store}>
    <HashRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/imovel" component={CharacterDetail} />
        <Route exact path="/contato" component={Contact} />
      </Switch>
    </HashRouter>
  </Provider>
);

export default App;
