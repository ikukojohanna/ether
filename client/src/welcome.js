import Registration from "./registration";
import { BrowserRouter, Route } from "react-router-dom";
import Login from "./login";
import ResetPassword from "./reset";
import Logo from "./logo";
import FiberTry from "./fibertry";

export default function Welcome() {
    return (
        <div id="welcome">
            <h1>Welcome to the</h1>
            <Logo />
            <FiberTry />
            <BrowserRouter>
                <Route exact path="/">
                    <Registration />
                </Route>
                <Route path="/login">
                    <Login />
                </Route>
                <Route exact path="/reset">
                    <ResetPassword />
                </Route>
            </BrowserRouter>
        </div>
    );
}
