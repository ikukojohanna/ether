//import ProfilePic from "./profilepic";
import Bio from "./bio";
import { Link } from "react-router-dom";

export default function Profile(props) {
    return (
        <div className="profilediv">
            <header>
                <Link to="/chat">Chat with other users</Link>
                <Link to="/friendswannabees">
                    <p> Friends and Wannabees</p>
                </Link>
                <Link to="/find-people">Find People</Link>
                <Link to="/logout">Logout</Link>
            </header>
            <h1>Your Profile</h1>

            <img id="profilepicProfile" src={props.imageUrl}></img>

            <h2>
                {props.first} {props.last}:
            </h2>

            <Bio
                bio={props.bio}
                setBioInBio={(arg) => props.setBioInProfile(arg)}
            />
        </div>
    );
}

//now we havre access to
//props.setBioInProfile()

//or destructuring... {first}
//update presentational from yesterdaa yto profilepic

//----- at this point profile pic needs image url
//pass down... but app cant give it to profilepic directly becasue profile is in between
//only direct child
//grandchildren of componenent.. app gives to profile... and progile gives to profilepic
//gives down first last and imageUrl

//props always signifies what doesnt belong to you but got passed down from your parents
//BE CONSISTENT ON LEFTHAND SiDE!!! of props

//for editor: first check if user has a bio
//if they dont have bio... render "add oyur bio"

//USE STATE... class component... for editor
//conditional rendering
//if

//<ProfilePic first={props.first} last={props.last} imageUrl={props.imageUrl} />;
