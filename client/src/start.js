import ReactDOM from "react-dom";

//import HelloWorld from "./helloWorld";
//ON THIS PAGE WE NEED TO RENDER ANOTHER COMPONENT THAT
//represents logged out user experience

import Welcome from "./welcome";

// here we need to make a fetch request to server. to check if user is registered, or logged in
//by checking users cookiew

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
                <img id="logo" src="/logo.jpg" alt="logo" />, //get your own logo and put it in public
                document.querySelector("main")
                //location.reload()
            );
        }
    })
    .catch((err) => {
        console.log("error fetch user/id ", err);
        this.setState({
            error: true,
        });
    });

//when export without default one would write:
//import { HelloWorld } from "./helloWorld";

//injecting this element into main in index.html

//ReactDOM.render(<Welcome />, document.querySelector("main"));

//need to import from other file

//theres 2 types of components in react:
//functino components
//class components
