import * as serviceWorker from "./serviceWorker";
import { applyMiddleware, createStore, compose } from "redux";
import App from "./containers/App";
import React from "react";
import { createRoot } from "react-dom/client";
import reducer from "./reducers";
import thunk from "redux-thunk";

const middleware = [thunk];

const composeEnhancers =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(...middleware))
);

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
    <App store={store} />
);

serviceWorker.unregister();