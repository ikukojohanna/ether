//slice file that will be responsible for any change made inside friend component

//don't use buttons from part 8 because they are local state. IN THIS COMPONENT THEY ARE REDUX.
//MAKE NEW BUTTONS

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
//query that gives back friends and wannabees.... given by andrea
//gives back large object with all infos

//NEED TO CReATE ROUTE IN APP:JS FOR THIS COMPONENT!! in order to work
export default function FriendsAndsWannabees() {
    const dispatch = useDispatch();

    //friends and wannabees are in global state... need access to it here too. so we need useselector
    //use selector takes callback and object we pass to it is WHOLE OBJECT
    //filter because we need to filter out wannabees from firewnds


    //FRIENDS is what you call property in REDUX object IN ROOT REDUCER
    const wannabees = useSelector(
        (state) => state.friends.filter(!friend.accepted) // we need to define condition of accepted
    );

    //if you need different parts from global sate u can use useselector several times
    //use filter again

    const friends = useSelector((state) =>
        state.friends.filter(friend.accepted) //?
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
    dispatch(makeFriend(id));¨
    //for make friend
//two action creators... need to devine in slice.js}



    return (
        <section>
            <h1>Friends and wannabees component with redux</h1>


            {/**display friends here */}
            <h1> wannabees component with redux</h1>

{wannabees && wannabees.map(wannabee) => {
    return (
        <div key={wanna.id}>
            <button onClick={() => handleAccept(wannabee.id)}>Accept friedshipt</button>
        </div>
    );
}}

            
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
