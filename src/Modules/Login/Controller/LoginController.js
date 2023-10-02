import { get, post, put, del,patch} from '../../../Utility/Http';
import { login, currentUser,forcePasswordChangeGet, forgotPasswordGet, changePasswordGet,updatedPasswordPatchApi } from '../Model/LoginModel';
import Config from '../../../Utility/Config';

export const loginGetApi = (data) => {
    return post(`${Config.extendedUrl}users/login?timeStamp=${(new Date()).getTime()}`, data, null).then((response) => {
        return login(response)
    });
};
export const getCurrentUser = () => {
    return get(`${Config.extendedUrlAuth}users/currentuser`,null).then((response) => {
        return currentUser(response)
    })
};

export const forcePasswordChange = (data, headers) => {
    return post(`${Config.extendedUrl}users/userforcepasswordchange`, data, headers).then((response) => {
        return forcePasswordChangeGet(response)
    })
};
export const forgotPassword = (data) => {
    return put(`${Config.extendedUrl}users/forgotpassword`, data, null).then((response) => {
        return forgotPasswordGet(response)
    })
};
export const changePassword = (data) => {
    return put(`${Config.extendedUrl}users/confirmforgotpassword`, data, null).then((response) => {
        return changePasswordGet(response)
    })
};
export const updatedPassword = (data, headers) => {    
    return patch(`${Config.extendedUrlAuth}users/changepassword`, data, headers).then((response) => {
        return updatedPasswordPatchApi(response)
    })
};


