import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
export default function OtherProfile() {
    const [user, setUser] = useState({});
    // const params = useParams();
    const { otherUserId } = useParams(); // otherUserId <---- this name depends
    // on what you    called this inside your
    // path of the Route in app.js
    const history = useHistory();
    console.log("history:", history);
    useEffect(() => {
        console.log("OtherProfile just rendered!");
        // 1st figure out what userId we want to fetch information for
        console.log("otherUserId:", otherUserId);

        let abort = false;
        if (!abort) {
            // 2nd make fetch to server to get data (name, profilepic and bio)
            // i.e. we would make a fetch to /api/user/15
            /* 3rd we receive our response from the server
                IF the user exists we want to put their information into state 
                (with the help of setUser),
                and our component should render the info
                IF the user does not exist we should maybe have a conditional error state
                that's capable to render a 404 or send them to their own profile
                IF the user we are trying to access is our own profile we should NOT render 
                this component but instead update our url to / to have browserRouter render
                our own user profile
            */
            // HARD CODED ASSUMPTION TO NOT USE CODE BELOW AS ACTUAL PROPER FUNCITONING LOGIC
            if (otherUserId == 5) {
                console.log(
                    "need to change UI trying to access our own profile"
                );
                history.push("/");
            }
        }
        return () => {
            abort = true;
        };
    }, []);
    return (
        <>
            <h1>OTHER PROFILE</h1>
            <h2>renders name+ bio + picture if valid user is found</h2>
            <h2>
                renders error of 404 if user could not be found or replaces the
                value of our route with /
            </h2>
            <h2>
                changes UI to editable profile if we try to access our own
                profile
            </h2>
        </>
    );
}
