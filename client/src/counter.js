//class components:

//classes as constructor functions "in disguise"
//just different syntax
//that's why all the classes ahve a constructor funtion
//blueprints for creating objects
//classes allow us to generate the same type of object

//not used anymore (since 2019) but still important to know because pre 2019 was used a lot

import { Component } from "react"; //always import component or react from react

//Counter = name of class component
export default class Counter extends Component {
    constructor(props) {
        //passing props here and in super will allow us to access it through "this" later on
        super(props); // because we're building on top of existing class
        //super() is to access our parent's class constructor function
        this.state = {
            // state object. because thats the reason we use class
            count: 0, // adding property to state object
        };
        //we EXPLICITELY bind "this" from here and tell our incrementCount
        //method that its value is "this" is the one from up here
        //because otherwise it generates its own meaning of this (which is undefined)
        this.incrementCount = this.incrementCount.bind(this);
    }

    //another way of binding would be warpping it in function expression IN JSX
    //without explicit binding oF "this"
    // <button> onClick={() => this.incrementCount()}</button>
    //but less good for larger projects because it generate a new function everytime

    incrementCount() {
        console.log("the user wants to increment COunt");
        //in react we need to use a method to interact with STATE
        //specialfunction called: setState... allows me to update state object
        this.setState({
            //in order for this to work we have to BIND(this) in state
            count: this.state.count + 1,
        });
    }

    render() {
        console.log("props passed to counter:_", this.props);
        return (
            <div>
                <h1>favFood prop val: {this.props.favFood}</h1>

                <h1>jsx element created by the class component</h1>
                <h2>current count is {this.state.count}</h2>
                <button onClick={this.incrementCount}>
                    CLick me to count up
                </button>
            </div>
        );
    }
}

//export default Counter;
//also possible
