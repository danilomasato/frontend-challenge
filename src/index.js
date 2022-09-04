import * as serviceWorker from "./serviceWorker";
import { applyMiddleware, createStore, compose } from "redux";
import App from "./containers/App";
import React from "react";
import ReactDOM from "react-dom";
import reducer from "./reducers";
import thunk from "redux-thunk";

const middleware = [thunk];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducer,
  /* preloadedState, */ composeEnhancers(applyMiddleware(...middleware))
);

ReactDOM.render(<App store={store} />, document.getElementById("root"));

serviceWorker.unregister();
