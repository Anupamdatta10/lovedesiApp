/*export const login = (loginData) => {
    return loginData.data
}*/
export const login = (loginData) => {
    let response = loginData.data;
    let loginResData = {};
    if (response) {
        if (response.success) {
            //first time new password set
            if (response.data.hasOwnProperty('challengeName') && response.data.challengeName == 'NEW_PASSWORD_REQUIRED') {
                loginResData = {
                    "success": response.success,
                    "data": {
                        "challengeName": response.data.challengeName,
                        "session": response.data.session,
                        "username": response.data.username
                    }
                }
            } else {
                loginResData = {
                    "success": response.success,
                    "data": {
                        "idToken": response.data.idToken,
                        "challengeName": response.data.challengeName,
                        "tokenType": response.data.tokenType,
                        "accessToken": response.data.accessToken,
                        "expiresIn": response.data.expiresIn,
                        "refreshToken": response.data.refreshToken,
                    }
                }
            }
        } else {
            loginResData = {
                "success": response.success,
                "message": response.message
            }
        }
    }
    return loginResData;
}

/*export const currentUser = (currentUserData) => {
    return currentUserData.data
}*/
export const currentUser = (currentUserData) => {
    let response=currentUserData.data;
    //console.log("currentUser response ===============>",response)
    let currentUserResData={};
    if(response){
        if(response.success){
            currentUserResData={
                "success":response.success,
                "data": {
                    "id": response.data.id,
                    "is_leave_validator": response.data.id==1?true:response.data.is_leave_validator,
                    "user_details": {
                      "first_name": response.data.user_details.first_name,
                      "last_name": response.data.user_details.last_name,
                      "user_email": response.data.user_details.user_email,
                      "active": response.data.user_details.active,
                      "profile_img": response.data.user_details.profile_img,
                      "role_id": response.data.user_details.role_id,
                      "role_name": response.data.user_details.role_name,
                      "contact_number": response.data.user_details.contact_number,
                    }
                }
            }
        }else{
            currentUserResData={
                "success":response.success,
                "message":response.message
            }
        }
    }
    return currentUserResData;
}

export const forcePasswordChangeGet = (forcePasswordChangeData) => {
    return forcePasswordChangeData.data
}

/*export const forgotPasswordGet = (forgotPasswordData) => {
    return forgotPasswordData.data
}*/
export const forgotPasswordGet = (forgotPasswordData) => {
    let response=forgotPasswordData.data;
    //console.log("forgotPasswordData response==============>",response)
    let resData={};
    if(response){
        if(response.success){
            resData={
                "success":response.success,
                "message":response.message
            }
        }else{
            resData={
                "success":response.success,
                "message":response.message
            }
        }
    }
    return resData;
}

/*export const changePasswordGet = (changePasswordData) => {
    return changePasswordData.data
}*/
export const changePasswordGet = (changePasswordData) => {
    let response=changePasswordData.data;
    //console.log("changePasswordData response==============>",response)
    let changePassworResdData={};
    if(response){
        if(response.success){
            changePassworResdData={
                "success":response.success,
                "message":response.message
            }
        }else{
            changePassworResdData={
                "success":response.success,
                "message":response.message
            }
        }
    }
    return changePassworResdData
}
export const rolePermissionApi = (roledata) => {   
    return roledata.data
}
export const updatedPasswordPatchApi = (data) => {   
    console.log("updatedPasswordPatchApi data====================",data)
    return data.data
}