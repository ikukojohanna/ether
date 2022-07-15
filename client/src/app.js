//logged in experience. someone who logged in or just registered
//APP:JS IS ENTRY POINT
//we want to render information about user... we have userIc
//the second app.js loads i want to talk to server again and request every information about user
//fetch request to users
//lycle cycle method from react: "componentdidmount"... works with classes
//its going to automatically run WHEN component first renders

//part 4... 3 components that live inside app.js
//1- profile pic - default image if just registered.  - function component because no state, no life cycle
//2- uploader - initially hidden. when we click on profile piucture  becomes visible
//3-make logo as own component

//
import { BrowserRouter, Route } from "react-router-dom";
import FindPeople from "./findPeople";
import { Component } from "react";
import Logo from "./logo";
import Uploader from "./uploader";

//import { BrowserRouter } from "react-router-dom";
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
        //easy way to say ... if true do flase... if false dso true... always do opposite
        this.setState({ uploaderIsVisible: !this.state.uploaderIsVisible });
    }
    //nmethodinApp
    setProfilePic(arg) {
        console.log("methos is running in app and arg is passed to it: ", arg);
        //this method will be upload picture funcitonality
        //fn expects you to pass it something
        //when it gets it... it updates state

        this.setState({
            imageUrl: arg,
        });
    }

    setBio(officialBio) {
        console.log("setbio has been triggered");
        this.setState({
            bio: officialBio,
        });
        // this funciton is in charge of receiving official bio from bio editior
        //and updating its state with it
        //watch with props... this.props.funciton (this.props.fucntion in class component... props.funciont in funtion component)
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

//syntax to pass down information in props:
/*
 for part 5:
  
    <ProfilePic
                    first={this.state.first}
                    last={this.state.last}
                    imageUrl={this.state.imageUrl}
                />
               <Profile
                    first={this.state.first}
                    last={this.state.last}
                    imageUrl={this.state.imageUrl}
                />
*/

/*
 */
//BUT !!!!!!!!! h2 onlcik..... should be image... that that lives INSIDE REPRESENRTATIONAL... profile pic component
//YOU WANT TO LISTEN FOR CLICK event on picture... so pass togglemodal as a prop to profile pic component

//---------------------- PART 5
// <profile /> is CONTAINER for update bio stuff,

//------------------------------ PART 6....
//problem with browser router
//use switch? the second that switch finds component that matches its  path
//it goes with that and wont go on to find another component to render
//not the same as switch in js
//switch is our low level protection to ONLY RENDER one route. and not all of them
//dont put jsx elements inside swith?

//
//WHENEver you have path that is universally true... like / in front
//all of the paths with / in it will ge trendered.

//------------------------------ HOOKS

//dont use in loops, conditionals or nested functions

//always calll them on the top scope of your function

//hooks give functions the life cycle methods, and state( and other things) that we usually had in calsses
//every Hook starts with keyword use... lowercase

/*


     <ProfilePic
         first={this.state.first}
         last={this.state.last}
         imageUrl={this.state.imageUrl}
     />;*/
/*   <BrowserRouter>
                    <div>
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
                    </div>
                </BrowserRouter>
*/
