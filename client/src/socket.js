import { io } from "socket.io-client";
import { messagesReceived } from "./redux/messages/slice.js";

export let socket; // let because at this point socket is undefined and ii'm going to have to create a connection

//sockets have access to redux store object. passed as argument for following function
export const init = (store) => {
    console.log("running init for sockets", store);
    if (!socket) {
        socket = io.connect();
        //listening evvent on client side
        socket.on("last-10-messages", (msgs) => {
            console.log("server just emitted last 10 message", msgs);
            // time to dispatch an action messages/received would be a good one
            // pass to action creator the messages your server emitted

            store.dispatch(messagesReceived(msgs));
            // dispatch(messagesReceived(msgs));
        });
    }

    /*
    socket.on("add-new-message", (msg) => {
        console.log("server just emitted a new msg to add", msg);
        // time to dispatch an ection message/addNew would be a good one
        // pass to action the object containing the message, and the user info
        // of the author
    });*/
};

//JAVASCRIPT SOLUTION TO DISCPLAYING MESSAGES IN ORDER
//WITH REFS.....
//refs used when I ACTIVELY WANT TO INTERACT WITH THE DOM
//for manipulations like this necessary
//expose element's reference TO code and actively interact with it
