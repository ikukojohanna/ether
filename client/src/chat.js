import Chatrooms from "./chatrooms";

import OnlineUsers from "./onlineusers";
import { useState } from "react";
import { socket } from "./socket";

export default function ChatWindow(props) {
    const [channel, setChannel] = useState("");

    const handleClickGeneral = () => {
        console.log("General has been clicked");
        socket.emit("join-room", "general");
    };

    const handleClickArakis = () => {
        console.log("Arakis has been clicked");
        socket.emit("join-room", "arakis");
    };
    const handleClickSolaris = () => {
        console.log("Solaris has been clicked");
        socket.emit("join-room", "solaris");
    };
    return (
        <div className="chatElement">
            <div className="chatdiv">
                <div className="container-rooms">
                    <h2>Chatrooms</h2>
                    <p onClick={handleClickGeneral}>General</p>
                    <p onClick={handleClickArakis}>Arakis</p>
                    <p onClick={handleClickSolaris}>Solaris</p>
                </div>
                <Chatrooms
                    userId={props.userId}
                    setChannel={setChannel}
                    channel={channel}
                />
                <OnlineUsers setChannel={setChannel} />
            </div>
        </div>
    );
}
