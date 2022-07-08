import Registration from "./registration";
import { BrowserRouter, Route } from "react-router-dom";
import Login from "./login";

export default function Welcome() {
    return (
        <div id="welcome">
            <h1>Welcome</h1>
            <p>logo ?</p>
            <h1>Rooms</h1>
            <BrowserRouter>
                <div>
                    <Route exact path="/">
                        <Registration />
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                </div>
            </BrowserRouter>{" "}
        </div>
    );
}
