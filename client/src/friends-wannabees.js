import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { makeFriend } from "./redux/friends/slice";

//NNED TO CREATE LINK IN NAV TO GO THERE

export default function FriendsAndsWannabees() {
    //get acces to dispatch function:
    const dispatch = useDispatch();

    //friends and wannabees are in global state... need access to it here too. so we need useselector
    //use selector takes callback and object we pass to it is WHOLE OBJECT
    //filter because we need to filter out wannabees from firewnds

    //FRIENDS is what you call property in REDUX object IN ROOT REDUCER
    const wannabees = useSelector(
        (state) => state.friends.filter((friend) => !friend.accepted) // we need to define condition of accepted
    );

    //if you need different parts from global sate u can use useselector several times
    //use filter again

    const friends = useSelector(
        (state) => state.friends.filter((friend) => friend.accepted) //?
    );

    //get all of our friends and wannabees when the component mounts
    useEffect(() => {
        //step 1.. make a get request to fetch friends and wannabees
        //when get data back:
        //step 2.. dispatch an action creator and pass to it data you just got back
        //this will start the process of adding your friends and wannabees (big array of objects containing both)
        //receiveFriendsAndWannabees is the action creator
        //this needs to be defines in slice.js
        //and imported in this files
        // ----- dispatch(receiveFriendsAndWannabees(yourDataFromServer));
    }, []);

    const handleAccept = (id) => {
        //step1 make a post request to update the db
        //step2 dispatch the action to update the global state
        dispatch(makeFriend(id));
        //for make friend
        //two action creators... need to devine in slice.js}
    };

    return (
        <section>
            <h1>Friends</h1>
            {/* Display your friends */}
            {friends.map()}
            <h1>Wannabees</h1>
            {wannabees.map((wannabee) => {
                return (
                    <div key={wannabee.id}>
                        <button onClick={() => handleAccept(wannabee.id)}>
                            Accept Friendship
                        </button>
                    </div>
                );
            })}
        </section>
    );
}

//in h1 you render lists of users that are friends that want to be friends

//BBOTH of the users are actually 1 BIG ARRAY of both friends and pending firends

//JOB IS TO RENDER as 2 different lists

//CALL USE SELECTOR TWICE FOR TWO 2 LISTS?

//---------------------------- CODE FOR 9

//when u click on button... make requeset to db... and then runa ction to update reduce
//post request... for this user... accepted is true
//passing  id of person you just accepted
//similar to hot or not
//new funciton delete friendshipt? apss id
//and funciton handle accept

//reuse database of accept and delete can use from part 8
//BUT NEW BUTTON

//DB QUERY IN NOTES::::

//we are getting all friends and want ot be out friends
//we need information from 2 palces. users and friendshipts
//join ... we need accepted value fvrom friendshcips
//ON acceppted false... pleople that sent requests
//2 OR because either me or you sent request
//need to make sure that capture friendhsipts regardless of who sent request

//if you are receiving empty array... make some friends on social network
//make sure you have food amount... to test out funcitonlaity
