import Registration from "./registration";
import { BrowserRouter, Route } from "react-router-dom";
import Login from "./login";
import ResetPassword from "./reset";
import Logo from "./logo";

export default function Welcome() {
    return (
        <div id="welcome">
            <h1>Welcome to the</h1>
            <Logo />
            <BrowserRouter>
                <div>
                    <Route exact path="/">
                        <Registration />
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route exact path="/reset">
                        <ResetPassword />
                    </Route>
                </div>
            </BrowserRouter>
        </div>
    );
}
