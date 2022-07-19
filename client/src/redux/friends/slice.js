/*

//src/redux/friends/slice.js
import { useEffect } from "react";
import { makeFriend } from "./redux/friends/slice";
//other imports too

// a mini reducer that handles changes to the global state - but only specific to the friends component

//friends=[] is PROPERTY INSIDE GLOBAL STATE
// we are using default parameter her
//if u run and undefined, add empty array to start with

//action... object that describes the change we want to make

//big array of objects. each object will represent one instance... friends, accepted true, not friends, accepted false(request pending)
export default function friendsAndsWannabeesReducer(friends = [], action) {
    //everything we do inside of here has to make copy of objects and arrays
    if (action.type === "friends-and-wannabees/accept") {
        const newFriendsWannabees = friends
            .map //do your mapping here
            //check if the id of ANY of the users matches the id of the yuser you just lciked
            //if it does, copy that user and changes its accepted wvalue to true
            ();

        return newFriendsWannabees;
    } //can call whatever you want

    return friends;
}

//watch out because we can export default twice... so to impornt we need curly brackets
//this is action creator:
export function makeFriend(id) {
    return {
        type: "friends-and-wannabees/accept",
        payload: { id },
    };
}

//now we wnat main reducer to have access to this

//------------------------------- // HOW TO AVOID MUTATION - 3 methods TO USE INSIDE REDUCER!!!

/*
var obj = {
    name: "Layla",
};

//1- spread operator. works for objects and arrays
var newObj = { ...obj };

//clone and add somothing on top of it
var newObj = { ...obj, last: "arias" };

var arr = [1, 2, 3];
var newArr = [...arr];
var newArr = [...arr, 4];
*/
//2- MAP - works ONLY on arrays
//useful for cloning, looping and changing each element in the array
//just a loop!
//by default it returns A NEW ARRAY

//3- FILTER - also AND ARRAY METHOD
//great for removing things from an array
//also a loop that creates copy of the array you are looping over
//and then removes things from the copy

// NEXT STEPS 9

//recuder action type?

//------------ redux dev tools allow us to see our state
//i can see action being kicked off
//see action what is happening and payload inside
