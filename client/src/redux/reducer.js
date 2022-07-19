//this is the ROOT reducer... combines all the midi reducers into a big one

import { combineReducers } from "redux";

//getting access to firends mini reducer
import friendsAndsWannabeesReducer from "./friends/slice";

//global state is an object
//every time we add a new sub reducer we need to add it into rootReducer

// mini reducers inside this object.
const rootReducer = combineReducers({
    friends: friendsAndsWannabeesReducer,
});

export default rootReducer;

//------------------ PART 9 -----

//new functionality: friends component
//create route in brwoser router /friends... whenever clicked render page with friends and friend requests
//component has to be built with redux

//FUNCTIONALITY PART 9

//navbar...
//inside is list of friends

//listen to click event
//UPDATE DATABASE...
//UPDATE GLOBAL STATE update redux

//step 1
//when friends component mounts... make request to server to fetch all our firends and wannabees

//step 2
//server is giong to make request to db
//db.get friends and wannabees

//step 3
//dbsend back result to server

//step 4 server sends back to friends component data

//step 5 call dispatch.. (slice.js)

//action creator.... pass it array of users we just got back rfrom serve
//return object that has a type... friends/receive friends and wannabees

// step 6-.. action will then talk to sub reducer(slice.js)
// with specific action.. changes state... taking whats in state.. making copy and replacing old version (step 7?)

// step 7
//?

//use selector allows us to pull down information from global statwe

//8grab what was done in redux... and pass it back to friends

//once we have redux and have friends information... this will be accessible from any component ANY WHERE IN our app
