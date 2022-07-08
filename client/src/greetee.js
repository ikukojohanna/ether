export default function Greetee(props) {
    //here props is an object passed as an argument to a function
    console.log("greettee here :)");
    console.log("props", props); // props in console so we can use them otherwise too
    //below is one example of conditional rendering
    //ifcomponent is not given prop, value for propName is "stanger"
    return <h2> Hi {props.propName || "stranger!"}</h2>;
}
