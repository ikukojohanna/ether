//ROOT reducer
//combines all the sub-reducers into one

import { combineReducers } from "redux";

//get access to friendsAndWannabeesReducer
import friendsWannabeesReducer from "./friends/slice";

const rootReducer = combineReducers({
    friends: friendsWannabeesReducer,
});

export default rootReducer;
