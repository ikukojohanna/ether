//APP.js is ENTRY POINT
//logged in experience.

import { BrowserRouter, Route } from "react-router-dom";
import FindPeople from "./findPeople";
import { Component } from "react";
import Logo from "./logo";
import Uploader from "./uploader";
import OtherProfile from "./otherProfile";
import FriendsAndsWannabees from "./friends-wannabees";
import Chat from "./chat";

import ProfilePic from "./profilepic";
import Profile from "./profile";
export default class App extends Component {
    constructor() {
        super();
        this.state = {
            //here is where url prop goes
            first: "Random",
            last: "Name",
            imageUrl: "https", // going to be string
            //once we have information we pass it down to procile pic component
            uploaderIsVisible: false,
            bio: "",
        };
    }

    //lycle cycle method from react: "componentdidmount"... works with classes
    //its going to automatically run WHEN component first renders

    componentDidMount() {
        console.log("app mounted");

        fetch("/user")
            .then((resp) => resp.json())
            .then((data) => {
                console.log("result from fetch/user", data);
                console.log("first", data.userData.first);
                console.log("last", data.userData.last);
                console.log("imgURL", data.userData.imageurl);

                this.setState({
                    first: data.userData.first,
                    last: data.userData.last,
                    imageUrl: data.userData.imageurl,
                    bio: data.userData.bio,
                });
            })
            .catch((err) => {
                console.log("error in fetch/user:  ", err);
            });

        //here fetch request to get infos users
        //this information is living in state of app
        //the profile pic componentn will need access to information of url of pic so it can render it
        // but the information lives in app
        //so we have to pass information ot child

        // WITH PROPS: parents passes information down to childern
        //syntax changes
        //prop we want to pass down is the pic URL
    }

    toggleModal() {
        console.log("togglemodal is runnin");
        //easy way to say ... if true do flase... if false do true... always do opposite
        this.setState({ uploaderIsVisible: !this.state.uploaderIsVisible });
    }
    setProfilePic(arg) {
        console.log("methos is running in app and arg is passed to it: ", arg);

        this.setState({
            imageUrl: arg,
        });
    }

    setBio(officialBio) {
        console.log("setbio has been triggered");
        this.setState({
            bio: officialBio,
        });
    }

    render() {
        return (
            <div className="appdiv">
                <h1>Welcome to the</h1>
                <Logo />

                <ProfilePic
                    first={this.state.first}
                    last={this.state.last}
                    imageUrl={this.state.imageUrl}
                    passDownToggleModal={() => {
                        this.toggleModal();
                    }}
                />

                <BrowserRouter>
                    <div>
                        <Route path="/chat">
                            <Chat />
                        </Route>

                        <Route exact path="/">
                            <Profile
                                first={this.state.first}
                                last={this.state.last}
                                imageUrl={this.state.imageUrl}
                                id={this.state.id}
                                image={this.state.image}
                                onClick={this.showUploader}
                                bio={this.state.bio}
                                setBioInProfile={(arg) => {
                                    this.setBio(arg);
                                }}
                            />
                        </Route>
                        <Route path="/find-people">
                            <FindPeople />
                        </Route>
                        <Route path="/user/:otherUserId">
                            <OtherProfile />
                        </Route>
                        <Route path="/friendswannabees">
                            <FriendsAndsWannabees />
                        </Route>
                    </div>
                </BrowserRouter>

                {this.state.uploaderIsVisible && (
                    <Uploader
                        passDownToggleModal={() => {
                            this.toggleModal();
                        }}
                        setProfilePic={(arg) => this.setProfilePic(arg)}
                    />
                )}
            </div>
        );
    }
}
