import Chatrooms from "./chatrooms";
//import Profile from "./profile";
import OnlineUsers from "./onlineusers";
import { useState } from "react";
import { socket } from "./socket";
import ClickApp from "./objectsclickapp";
import { useEffect } from "react";
import { Link } from "react-router-dom";
export default function ChatWindow(props) {
    const [channel, setChannel] = useState("");
    const [planetClicked, setPlanetClicked] = useState(false);
    const [profileClicked, setProfileClicked] = useState(false);
    useEffect(() => {
        history.onpushstate = function (event) {
            //   console.log("slice:::", location.pathname.slice(1));
            // console.log("event state", event.state);

            if (event.state == "logoutwin") {
                console.log("logout was clicked");
                setPlanetClicked(false);
            }
            if (event.state == "profilewin") {
                console.log("profilewin was clicked");
                setProfileClicked(true);
            }
            if (event.state == "empty") {
                setPlanetClicked(false);
                setProfileClicked(false);
            }
            if (
                event.state == "arrakis" ||
                event.state == "solaris" ||
                event.state == "philia" ||
                event.state == "lv-426" ||
                event.state == "vogsphere" ||
                event.state == "dagobah"
            ) {
                setPlanetClicked(true);
                socket.emit("join-room", event.state);
            }
        };
    }, []);

    return (
        <div>
            <div className="clickappdiv">
                <ClickApp />
            </div>
            {profileClicked && (
                <h1>
                    {" "}
                    <Link to="/profile">
                        <h3 className="navh3">My Profile</h3>
                    </Link>
                </h1>
            )}
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
