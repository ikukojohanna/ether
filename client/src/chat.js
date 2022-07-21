import { useSelector } from "react-redux";
import { socket } from "./socket";
import { useEffect } from "react";

export default function Chat() {
    const messages = useSelector((state) => state.messages);
    console.log("messages in chat", messages);

    //Says state is undefinded

    useEffect(() => {
        console.log("chat just mounted");
        console.log("messages retrieved:", messages);
        //  dispatch(messagesReceived(messages));
    }, []);

    const keyCheck = (e) => {
        // console.log("what was pressed:", e.key);
        if (e.key === "Enter") {
            e.preventDefault();
            console.log("what's the value of our input field", e.target.value);
            // time to let the server there is a new message
            socket.emit("new-message", e.target.value);
            // after emitting our msg, we clear the textarea
            e.target.value = "";
        }
    };
    return (
        <>
            <h1>Welcome to chat</h1>

            <div className="container-chat">
                {/* Display your friends */}
                {messages?.map((message) => {
                    return (
                        <div key={message.id}>
                            <p>
                                {message.id}.-
                                {message.message}
                            </p>
                        </div>
                    );
                })}
            </div>
            <div className="chatTextarea">
                <textarea
                    onKeyDown={keyCheck}
                    className="textAreaChat"
                    name="textAreaChat"
                    placeholder="Chime in, and add messages here"
                ></textarea>
            </div>
        </>
    );
}

/*
When the user hits the enter key in this <textarea> or presses a "send" button,
 a 'chatMessage' event should be emitted. This means that the socket object will have 
 to be imported so that its emit method can be called.


 <button onClick={() => this.handleSubmit()}>Submit</button>

*/
