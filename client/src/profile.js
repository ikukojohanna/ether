import ProfilePic from "./profilepic";
import Bio from "./bio";
import { Link } from "react-router-dom";

export default function Profile(props) {
    return (
        <div className="profilediv">
            <h1>Your Profile</h1>
            <h2>
                {props.first} {props.last}:{" "}
            </h2>

            <ProfilePic
                first={props.first}
                last={props.last}
                imageUrl={props.imageUrl}
            />
            <Bio
                bio={props.bio}
                setBioInBio={(arg) => props.setBioInProfile(arg)}
            />

            <Link to="/find-people">find people</Link>
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
