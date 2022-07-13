import ProfilePic from "./profilepic";

export default function Profile(props) {
    return (
        <div className="container">
            <h1>this is the profile component</h1>
            <h2>my name is {props.first}</h2>
            <ProfilePic imageUrl={props.imageUrl} />
        </div>
    );
}

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
