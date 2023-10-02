import { SET_TOKEN,SWIPEABLE_ROW,PREV_OPENED_ROW,TOUCH_STATE,ZPL_STATE,SET_USER_DETAILS,LEAVE_DATA } from '../Utility/AllActionTypes';
export default (state = {  "token": null,"swipRow":null,"prev_row":null,currentUserDetails:{}, leaveData:[]}, action) => {    
    switch (action.type) {        
        case SET_TOKEN:
            return { ...state, "token": action.payload };
        case SWIPEABLE_ROW:
            return { ...state, "swipRow": action.payload };
        case PREV_OPENED_ROW:
            return { ...state, "prev_row": action.payload };
        case TOUCH_STATE:
            return { ...state, "touchState": action.payload };
        case SET_USER_DETAILS:
            return { ...state, "currentUserDetails": action.payload };
        case LEAVE_DATA:
            return { ...state, "leaveData": action.payload };
        default:
            return state;
    }
};