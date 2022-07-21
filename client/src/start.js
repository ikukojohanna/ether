import ReactDOM from "react-dom";
import Welcome from "./welcome";
import App from "./app";

//----------------------------------------- Initializing IO socket------------------------------------------------------------------------
import { init } from "./socket";

//----------------------------------------- REDUX SETUP ------------------------------------------------------------------------

import { createStore, applyMiddleware } from "redux";
import * as immutableState from "redux-immutable-state-invariant";
import { composeWithDevTools } from "redux-devtools-extension";

import { Provider } from "react-redux";
import rootReducer from "./redux/reducer";
const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(immutableState.default()))
);

//------------------------------------------------------------------------------------------------------------------------------

fetch("/user/id.json")
    .then((response) => response.json())
    .then((data) => {
        if (!data.userId) {
            //injecting elements into main in index.html
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            //initialize websocket connection and pass the store to it...
            init(store);

            ReactDOM.render(
                //REDUX: wrap App in Provider to pass down accessto reader store
                <Provider store={store}>
                    <App />
                </Provider>,
                document.querySelector("main")
            );
        }
    })
    .catch((err) => {
        console.log("error fetch user/id ", err);
    });
