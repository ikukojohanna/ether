import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function FindPeople() {
    console.log("find people component here");

    const [searchUsers, setsearchUsers] = useState("");
    const [recentUsers, setRecentUsers] = useState([]);

    useEffect(() => {
        //this loads when component mounts
        //useEffect second argument....empty array to make it only happen once... can also put id...

        fetch("/recent-users")
            .then((resp) => resp.json()) //sending response from server to client side
            .then((data) => {
                console.log("response from fetch /recent-users", data);
                //here use async await
                //STOPPPEDDD HERE WEITERMACHEN
                setRecentUsers(data);
                //all the properties of data become direct properties of "this"
                //if anything is changed it data it will automatically be updated... UI will update to reflect the changes
                //leads to faster, smoother user experience
            });

        console.log(`"${searchUsers}" has been rendered!`);
    }, []);

    //here fetch request to match users to input

    return (
        <div>
            <h1>FIND PEOPLE COMPONENT</h1>

            <Link to="/">back to your profile</Link>

            <strong>{searchUsers}</strong>

            <input
                onChange={(e) => setsearchUsers(e.target.value)}
                value={searchUsers}
                placeholder="search for people"
            />

            {recentUsers &&
                recentUsers.map((recentUser, idx) => {
                    return (
                        <div key={idx}>
                            <img src={recentUser.imageurl} />
                            <h3>
                                {recentUser.first}
                                {recentUser.last}
                            </h3>
                        </div>
                    );
                })}
        </div>
    );
}

/*    {this.recentUsers &&
                this.recentUsers.map((recentUser, i) => {
                    // console.log("country", country);
                    // console.log("i", i);
                    return <li key={i}>{recentUser}</li>;
                })} 
                
                
                 {this.recentUsers.map((user) => (
                <div key={user.id}> </div>
            ))}*/
