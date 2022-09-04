import React from "react";
import { Switch, Route, HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { Home } from "./";
import "./App.css";

const App = ({ store }) => (
  <Provider store={store}>
    <HashRouter>
      <Switch>
        <Route exact path="/" component={Home} />
      </Switch>
    </HashRouter>
  </Provider>
);

export default App;
