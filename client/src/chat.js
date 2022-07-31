import Chatrooms from "./chatrooms";

import OnlineUsers from "./onlineusers";
import { useState } from "react";
import { socket } from "./socket";
import ClickApp from "./objectsclickapp";
import { useEffect } from "react";
export default function ChatWindow(props) {
    const [channel, setChannel] = useState("");
    const [planetClicked, setPlanetClicked] = useState(false);
    //make chatrooms and handleclick dynamic!!!!!
    useEffect(() => {
        window.onpopstate = function (event) {
            alert(
                "POPSTATE location: " +
                    document.location +
                    ", state: " +
                    JSON.stringify(event.state)
            );
        };

        history.onpushstate = function (event) {
            console.log(
                " PUSHSTATE location: " +
                    document.location +
                    ", state: " +
                    JSON.stringify(event.state)
            );
            console.log("slice:::", location.pathname.slice(1));
            console.log("event state");
            if (event.state != "empty") {
                setPlanetClicked(true);
                socket.emit("join-room", event.state);
            }
            if (event.state == "empty") {
                setPlanetClicked(false);
            }
        };
    }, []);
    /*
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
    };*/
    return (
        <div>
            <div className="clickappdiv">
                <ClickApp />
            </div>
            <div id="philia"></div>
            <div id="solaris"></div>
            <div id="arakis"></div>
            <div id="lv-426"></div>
            <div id="dagobah"></div>
            <div id="vogsphere"></div>

            {planetClicked && (
                <div className="chatdiv">
                    <Chatrooms
                        userId={props.userId}
                        setChannel={setChannel}
                        channel={channel}
                    />
                    <OnlineUsers setChannel={setChannel} />
                </div>
            )}
        </div>
    );
}

/* <div className="roomsli">
                            <p onClick={handleClickGeneral}>General</p>
                            <p onClick={handleClickArakis}>Arakis</p>
                            <p onClick={handleClickSolaris}>Solaris</p>
                        </div>*/
