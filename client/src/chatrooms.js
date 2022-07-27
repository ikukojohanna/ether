import { useSelector } from "react-redux";
import { socket } from "./socket";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function Chatrooms() {
    const messages = useSelector((state) => state.messages);
    const onlineUsers = useSelector((state) => state.online);
    const rooms = useSelector((state) => state.rooms);

    const chatContainerRef = useRef();
    /*
    const rooms = [
        { name: "general" },
        { name: "Arakis" },
        { name: "Solaris" },
    ];*/

    //console.log("messages in chat component", messages);
    //console.log("onlineusers in chat component", onlineUsers);
    console.log("rooms in chat component", rooms);
    console.log("rooms.room in chat component", rooms.room);

    useEffect(() => {
        // on first mount and every time a new message gets added
        // we want to adjust our elements scrollTop to be the scrollHeight minus height
        // of the element, as that means we are scrolled to the bottom msg

        chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight -
            chatContainerRef.current.clientHeight;
    }, [messages, rooms]);

    const keyCheck = (e) => {
        // console.log("what was pressed:", e.key);
        if (e.key === "Enter") {
            e.preventDefault();
            //  console.log("what's the value of our input field", e.target.value);
            // time to let the server there is a new message
            console.log("rooms.room inside keycheck", rooms.room);

            const keyCheckObject = {
                message: e.target.value,
                room: rooms.room,
            };

            console.log("keyCheckObject", keyCheckObject);
            socket.emit("new-message", keyCheckObject);
            // after emitting our msg, we clear the textarea
            e.target.value = "";
        }
    };

    return (
        <>
            <div className="container-chat" ref={chatContainerRef}>
                {messages.map((message) => {
                    return (
                        <div className="chatline" key={message.id}>
                            <Link to={`/user/${message.user_id}`}>
                                <img
                                    className="messageImg"
                                    src={message.imageurl || "/default.png"}
                                />
                            </Link>

                            <div className="chattext">
                                <p className="chatname">
                                    {message.first} {message.last}
                                </p>
                                <p className="chatmessage">{message.message}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="chatright">
                <div className="container-online">
                    <div className="titleandspot">
                        <h2> WELCOME TO {rooms.room} CHATROOM!</h2>
                        <h2>Other online users:</h2>
                    </div>

                    <div className="onlineusersdiv">
                        {onlineUsers.map((user) => {
                            return (
                                <div className="onlineuserli" key={user.id}>
                                    <Link to={`/user/${user.id}`}>
                                        <img
                                            className="onlineImg"
                                            src={user.imageurl}
                                        />{" "}
                                        <div className="ring-container">
                                            <div className="ringring"></div>
                                            <div className="circle"></div>
                                        </div>
                                    </Link>{" "}
                                    <p>
                                        {user.first} {user.last}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <textarea
                    onKeyDown={keyCheck}
                    className="textAreaChat"
                    name="textAreaChat"
                    placeholder="Your message..."
                ></textarea>
            </div>
        </>
    );
}

/* {rooms.map((room) => {
                        return (
                            <div className="channel" key={room.name}>
                                <p onClick={handleRoomClick()}>{room.name}</p>
                            </div>
                        );
                    })}*/

/*
   {rooms.room && (
                    <div className="chatline" key={rooms.messages}>
                        {rooms.messages}
                    </div>
                )}
*/
