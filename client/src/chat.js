import { useSelector } from "react-redux";
import { socket } from "./socket";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function Chat() {
    const messages = useSelector((state) => state.messages);
    const onlineUsers = useSelector((state) => state.online);
    const chatContainerRef = useRef();

    console.log("messages in chat component", messages);
    console.log("onlineusers in chat component", onlineUsers);

    useEffect(() => {
        console.log("chatContainerRef", chatContainerRef);
        console.log("scrollTop", chatContainerRef.current.scrollTop);
        console.log("clientHeight", chatContainerRef.current.clientHeight);
        console.log("scrollHeight", chatContainerRef.current.scrollHeight);
        // on first mount and every time a new message gets added
        // we want to adjust our elements scrollTop to be the scrollHeight minus height
        // of the element, as that means we are scrolled to the bottom msg
        chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight -
            chatContainerRef.current.clientHeight;
    }, [messages]);

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
            <div className="chatdiv">
                <h1>chat</h1>

                <div className="container-chat" ref={chatContainerRef}>
                    {/* Display your friends */}
                    {messages.map((message) => {
                        return (
                            <div key={message.id}>
                                <Link to={`/user/${message.user_id}`}>
                                    <img
                                        className="messageImg"
                                        src={message.imageurl}
                                    />{" "}
                                </Link>{" "}
                                <p>
                                    {message.id}
                                    {message.first}
                                    {message.last} said: {message.message}
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
                <div className="container-online">
                    <h1>list of online users</h1>
                    {onlineUsers.map((user) => {
                        return (
                            <div key={user.id}>
                                <Link to={`/user/${user.id}`}>
                                    <img
                                        className="onlineImg"
                                        src={user.imageurl}
                                    />{" "}
                                </Link>{" "}
                                <p>
                                    {user.first}
                                    {user.last}
                                </p>
                            </div>
                        );
                    })}
                </div>
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
