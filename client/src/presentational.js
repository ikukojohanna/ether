//props get passed as arguments into funciton
//PROPS WILL ALWAYS BE AN OBJECT
// THE PROPERTY names come from left hand side of what you pass in app.sj

//OR::: DESTRUCTURING
//pull out information i care about
//export default function Presentational({first, last, imageUrl}) .. and then use {first} instead of props.first

export default function Presentational(props) {
    console.log("props, info being passsed down from app:", props);
    props.imageUrl = props.imageUrl || "default.jpg";

    return (
        <div>
            <h1>
                this component will render profilepic my name is {props.first}{" "}
                and last name is {props.last}
            </h1>
            <img className="profile-pic" src={props.imageUrl} alt="my pic" />
        </div>
    );
}
