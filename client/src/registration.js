import { Component } from "react";

export default class Registration extends Component {
    constructor() {
        super();
        this.state = { error: false };
        // this.handleChange = this.handleChange.bind(this); (other optin instead of arrow function)
    }

    //to do:
    //1- render 3 input fields and button - done
    //2- capture user input and store in state - done
    //3 when submit, send data to server
    //4 error--- conditionally render error message
    //5 if goes well show logo

    handleChange(e) {
        //  console.log("handleChange is running - user is typeing in the input field" );
        console.log(e.target.value);
        //setting something to state is an asychronus process

        //we need to BIND "this"
        //ARROW FUNCTIONS KEEP THE MEANING OF "THIS"
        this.setState(
            {
                //this way we make left side DYNAMIC.. instead of writing if first, if last, etc
                [e.target.name]: e.target.value,
            },
            () => console.log("this.state:", this.state)
        );
    }

    handleSubmit() {
        console.log("submit was pressed");
        fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log("data from POST/register: ", data);

                if (data.success) {
                    location.reload();
                } else {
                    this.setState({
                        error: true,
                    });
                }
                //to do: if registration was not successful: render error conditionally
                //if was successful: reload
                // with: location.reload();
            })
            .catch((err) => {
                console.log("error handleSubmit ", err);
                this.setState({
                    error: true,
                });
            });
    }
    //input name so we can access it in req.body

    render() {
        return (
            <div>
                <h1>This is the registration component</h1>

                {this.state.error && (
                    <h1 className="error">Something went wrong, try again.</h1>
                )}
                <input
                    type="text"
                    name="first"
                    placeholder="first"
                    onChange={(e) => this.handleChange(e)}
                />
                <input
                    type="text"
                    name="last"
                    placeholder="last"
                    onChange={(e) => this.handleChange(e)}
                />
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
                <button onClick={() => this.handleSubmit()}>Submit</button>
            </div>
        );
    }
}
