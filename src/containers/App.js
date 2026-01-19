import React from "react";
import { Switch, Route, BrowserRouter, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import Home  from "./Home";
import CharacterDetail from "./CharacterDetail";
import Contact from "./Contact";
import About from "./About";
import Register from "./Register";
import "./App.css";

const App = ({ store }) => (
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route exact path="/" component={Home} />
        <Route exact path="/imovel/:id/:id" component={CharacterDetail} />
        <Route exact path="/contato" component={Contact} />
        <Route exact path="/sobre-nos" component={About} />
        <Route exact path="/Register" component={Register} />
      </Routes>
    </BrowserRouter>
  </Provider>
);

export default App;
