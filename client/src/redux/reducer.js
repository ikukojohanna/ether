//ROOT reducer
//combines all the sub-reducers into one

import { combineReducers } from "redux";

//get access to friendsAndWannabeesReducer
import friendsWannabeesReducer from "./friends/slice";
import messagesReducer from "./messages/slice";
import onlineReducer from "./online/slice";

const rootReducer = combineReducers({
    friends: friendsWannabeesReducer,
    messages: messagesReducer,
    online: onlineReducer,
});

export default rootReducer;
