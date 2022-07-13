import { Component } from "react";
import { Link } from "react-router-dom";

export default class Login extends Component {
    constructor() {
        super();
        this.state = { error: false };
    }

    handleChange(e) {
        console.log(e.target.value);

        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log("this.state:", this.state)
        );
    }

    handleSubmit() {
        console.log("submit was pressed");
        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log("data from POST/login: ", data);

                if (data.success) {
                    location.reload();
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((err) => {
                console.log("error handleSubmit ", err);
                this.setState({
                    error: true,
                });
            });
    }

    render() {
        return (
            <div className="logindiv">
                <h1>Login</h1>

                {this.state.error && (
                    <h1 className="error">Something went wrong, try again.</h1>
                )}

                <input
                    type="email"
                    name="email"
                    placeholder="email"
                    onChange={(e) => this.handleChange(e)}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="password"
                    onChange={(e) => this.handleChange(e)}
                />
                <button onClick={() => this.handleSubmit()}>Login</button>

                <Link to="/">
                    <p> Click here to sign up</p>
                </Link>

                <Link to="/reset">Reset Password</Link>
            </div>
        );
    }
}
