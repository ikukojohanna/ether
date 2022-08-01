import { Link } from "react-router-dom";

export default function Logout() {
    function logout() {
        fetch("/logout")
            .then((resp) => resp.json())
            .then(() => {
                location.reload();
            })
            .catch((err) => {
                console.log("error in logout ", err);
            });
    }

    return (
        <div>
            <h1>this is logout component</h1>
            <h2>are you sure you want to log out?</h2>
            <Link to="/">
                <h3 className="navh3" onClick={() => logout()}>
                    Logout{" "}
                </h3>
            </Link>
        </div>
    );
}
