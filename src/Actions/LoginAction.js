import { SET_TOKEN,SWIPEABLE_ROW,PREV_OPENED_ROW,TOUCH_STATE,SET_USER_DETAILS,LEAVE_DATA } from '../Utility/AllActionTypes';

export const setToken = (value) => async (dispatch) => {
    //console.log("payload value=============",value)
    dispatch({
        type: SET_TOKEN,
        payload: value
    });
}
export const setUserDetails = (value) => async (dispatch) => {
    //console.log("payload value=============",value)
    dispatch({
        type: SET_USER_DETAILS,
        payload: value
    });
}
export const setLeaveDetails = (value) => async (dispatch) => {
    //console.log("payload value=============",value)
    dispatch({
        type: LEAVE_DATA,
        payload: value
    });
}
 
/*export const logOutApp = (value) => async (dispatch) => {
    try {
        await Auth.signOut({ global: true });
    } catch (error) {
        console.log('error signing out: ', error);
    }
    localStorage.clear();
    dispatch({
        type: AppActionTypes.LOGOUT,
        payload: value
    });
}*/