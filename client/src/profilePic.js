//props get passed as arguments into funciton
//PROPS WILL ALWAYS BE AN OBJECT
// THE PROPERTY names come from left hand side of what you pass in app.sj

//OR::: DESTRUCTURING
//pull out information i care about
//export default function Presentational({first, last, imageUrl}) .. and then use {first} instead of props.first
//import Uploader from "./uploader";

export default function ProfilePic(props) {
    console.log("props, info being passsed down from app:", props);
    //props.imageUrl = props.imageUrl || "/default.jpg";

    return (
        <div>
            <img
                className="profile-pic"
                src={props.imageUrl}
                alt={props.first + props.last}
                onClick={() => props.passDownToggleModal()}
            />
        </div>
    );
}

//on click in img?
// onClick={modalCallback ? () => modalCallback() : null}
