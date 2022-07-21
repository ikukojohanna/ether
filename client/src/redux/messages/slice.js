// reducer for messages

export default function messagesReducer(messages = [], action) {
    if (action.type === "messages/received") {
        console.log(action);
        messages = action.payload.messages.messages;
    }
    //console.log("messages in messagesREDUCER", messages);
    return messages;
}

//action creators

export function messagesReceived(messages) {
    //console.log("messages in action creator", messages);
    return {
        type: "messages/received",
        payload: { messages },
    };
}

export function addNewMessage(message) {
    return {
        //...
        type: "messages/add", //change?
        payload: { message },
    };
}
