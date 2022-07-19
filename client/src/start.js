import ReactDOM from "react-dom";

//import HelloWorld from "./helloWorld";
//ON THIS PAGE WE NEED TO RENDER ANOTHER COMPONENT THAT
//represents logged out user experience

import Welcome from "./welcome";
import App from "./app";

// here we need to make a fetch request to server. to check if user is registered, or logged in
//by checking users cooki

//----------------------------------------- REDUX SETUP ------------------------------------
import { createStore, applyMiddleware } from "redux";
import * as immutableState from "redux-immutable-state-invariant";
import { composeWithDevTools } from "redux-devtools-extension";

import { Provider } from "react-redux";
import rootReducer from "./redux/reducer";

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(immutableState.default()))
);

// start.js
fetch("/user/id.json")
    .then((response) => response.json())
    .then((data) => {
        if (!data.userId) {
            //this meand that the user doesnt have a userID
            //should see welcome/registration for now
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            //this means user is logged in/registered
            //browser had right cookie.... show logo
            ReactDOM.render(
                //we have to wrap APP in our provider.. this gives access to the reader store.
                //and pass down access to store

                <Provider store={store}>
                    <App />
                </Provider>,

                //after this you have access to redux

                document.querySelector("main")
                //location.reload()
            );
        }
    })
    .catch((err) => {
        console.log("error fetch user/id ", err);
    });

//when export without default one would write:
//import { HelloWorld } from "./helloWorld";

//injecting this element into main in index.html

//ReactDOM.render(<Welcome />, document.querySelector("main"));

//need to import from other file

//theres 2 types of components in react:
//functino components
//class components
