import React from "react";
import { Switch, Route, HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { Home, CharacterDetail } from "./";
import "./App.css";

const App = ({ store }) => (
  <Provider store={store}>
    <HashRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/character" component={CharacterDetail} />
      </Switch>
    </HashRouter>
  </Provider>
);

export default App;
