import Config from './Config'
import axios from 'axios';
import {AsyncStorage} from 'react-native';
import { useTranslation, withTranslation } from 'react-i18next';
// import { connect, useDispatch } from 'react-redux';
import Toast from 'react-native-simple-toast';

export const get = (url, data, header = "global") => {
  return new Promise(async (resolve, reject) => {
    let apiBaseUrl = `${Config.baseURL}${url}`;

    //console.log("apiBaseUrl==",apiBaseUrl)
    //console.log("header==",header)
    //console.log("await getHeaders(header, url)==",await getHeaders(header, url))
    axios.get(apiBaseUrl, {
      params: data,
      headers: await getHeaders(header, url)
    }).then((response) => {
      resolve(response);
    }).catch((error) => {
      console.error("..........=============............", error)
      // errorHandlingBlock(error)
      reject(error);
    })
  });
}
export const post = (url, data, header = "global") => {
  return new Promise(async (resolve, reject) => {
    let apiBaseUrl = `${Config.baseURL}${url}`;
    console.log("await getHeaders(header, url)============",await getHeaders(header, url))
    axios.post(apiBaseUrl, data, { headers: await getHeaders(header, url) }).then((response) => {
      resolve(response);
    }).catch((error) => {
      // errorHandlingBlock(error)
      reject(error);
    })
  });
}
export const patch = (url, data, header = "global") => {
  return new Promise(async (resolve, reject) => {
    let apiBaseUrl = `${Config.baseURL}${url}`;
    console.log("apiBaseUrl==", apiBaseUrl)
    console.log("header==", header)
    console.log("await getHeaders(header, url)==", await getHeaders(header, url))
    axios.patch(apiBaseUrl, data, { headers: await getHeaders(header, url) }).then((response) => {
      resolve(response);
    }).catch((error) => {
      // errorHandlingBlock(error)
      reject(error);
    })
  });
}
export const put = (url, data, header = "global") => {
  return new Promise(async (resolve, reject) => {
    let apiBaseUrl = `${Config.baseURL}${url}`;
    axios.put(apiBaseUrl, data, { headers: await getHeaders(header, url) }).then((response) => {
      resolve(response);
    }).catch((error) => {
      // errorHandlingBlock(error)
      reject(error);
    })
  });
}
export const del = (url, data, header = "global") => {
  return new Promise(async (resolve, reject) => {
    let apiBaseUrl = `${Config.baseURL}${url}`;
    axios.delete(apiBaseUrl, {
      data: data,
      headers: await getHeaders(header, url)
    }).then((response) => {
      resolve(response);
    }).catch((error) => {
      //errorHandlingBlock(error)
      reject(error);
    })
  });
}

export const getHeaders = async (header, path = "") => {
  checkExpiryOfToken()
  let headers = {};
  //console.log("await AsyncStorage.getItem('i18nextLng')===========",await AsyncStorage.getItem('i18nextLng'))
  headers['language'] = await AsyncStorage.getItem('i18nextLng') ? await AsyncStorage.getItem('i18nextLng') : "en";
  headers['platform'] = 'App';
  if (header == null) {
    //console.log(1)
    //headers['language'] = await AsyncStorage.getItem('i18nextLng');
     headers['language'] = await AsyncStorage.getItem('i18nextLng') ? await AsyncStorage.getItem('i18nextLng') : "en";
  } else if (header == "global") {
    //console.log(2)
    //console.log("await AsyncStorage.getItem('finalIdToken')",await AsyncStorage.getItem('finalIdToken'))
    headers["Authorization"] = await AsyncStorage.getItem('finalIdToken');
  } else if (Object.keys(header).length > 0) {
    //console.log(3)
    if (path == `${Config.extendedUrl}users/userforcepasswordchange`) {
      //console.log(4)
      Object.keys(header).map((key, idx) => {
        headers[key] = header[key];
      })
    } else if (path == `${Config.extendedUrlAuth}users/singout`) {
      //console.log(5)
      await AsyncStorage.setItem('i18nextLng', 'en');
      headers["Authorization"] = await AsyncStorage.getItem('finalIdToken');
      headers["Accesstoken"] = await AsyncStorage.getItem('accessToken');
    } else if (path == `${Config.extendedUrlAuth}users/changepassword`) {
      //console.log(6)
      headers["Authorization"] = await AsyncStorage.getItem('finalIdToken');
      headers["Accesstoken"] = await AsyncStorage.getItem('accessToken');
    }
  }

  return headers
};

export const checkExpiryOfToken = async () => {
  let value = JSON.parse(await AsyncStorage.getItem('loginTime'));
  let currentDateTime = new Date();
  const expiryTime = new Date(value.expiryTime)
  const loggedInTime = new Date(value.loggedInTime)
  const expiryInterval = value.expiryInterval
  if (expiryTime != "") {
    let deltaDifference = ((currentDateTime == "" ? 0 : currentDateTime) - (loggedInTime == "" ? 0 : loggedInTime)) / 1000
    if (currentDateTime >= expiryTime && (deltaDifference <= expiryInterval)) {
      refershToken()
    }
  }

};

export const refershToken = () => {
  let res = new Promise(async (resolve, reject) => {
    let header = {};
    header["Authorization"] = await AsyncStorage.getItem('finalIdToken');
    let apiBaseUrl = `${Config.baseURL}${Config.extendedUrl}auth/users/refreshtoken`;
    let data = {}
    data["refreshToken"] = await AsyncStorage.getItem('refreshToken');
    console.log("refreshToken=========data", refreshToken)
    axios.patch(apiBaseUrl, data, { headers: header }).then((response) => {
      resolve(response);
    }).catch((error) => {
      //console.log("error=============", error)
      logoutApp()
      //reject(error);
    })
  });
  res.then(async (result) => {
    //console.log("result===>", result.data)
    let finalResponse = result.data
    if (finalResponse.success) {
      const finalIdToken = finalResponse.data.tokenType + ' ' + finalResponse.data.idToken;
      const accessToken = finalResponse.data.accessToken;

      var today = new Date();
      var afterAddWithToday = new Date();
      afterAddWithToday.setSeconds(afterAddWithToday.getSeconds() + (expiresIn - 900));
      let data = {};
      data["loggedInTime"] = today
      data["expiryTime"] = afterAddWithToday
      data["expiryInterval"] = expiresIn

      await AsyncStorage.setItem('finalIdToken', finalIdToken);
      await AsyncStorage.setItem('accessToken', accessToken);
      const expiresIn = data;
      await AsyncStorage.setItem('loginTime', JSON.stringify(expiresIn));

    } else {
      //Utility.toastNotifications(finalResponse.message, "Error", "error")
      Toast.show("Session Expired", "Error", "error")
      logoutApp()
    }
  })

};

export const logoutApp = () => {
  const dispatch = useDispatch();
  let logoutRes = new Promise(async (resolve, reject) => {
    await AsyncStorage.setItem('i18nextLng', 'en');
    let header = {};
    header["Authorization"] = await AsyncStorage.getItem('finalIdToken');
    header["Accesstoken"] = await AsyncStorage.getItem('accessToken');
    let apiBaseUrl = `${Config.baseURL}${Config.extendedUrlAuth}users/singout`;
    axios.delete(apiBaseUrl, {
      data: {},
      headers: header
    }).then((response) => {
      resolve(response);
    }).catch((error) => {
      //errorHandlingBlock(error)
      reject(error);
    })
  });
  dispatch({ type: "SET_TOKEN", payload: null });
  dispatch({ type: "SET_USER_DETAILS", payload: {} });
  dispatch({ type: "LEAVE_DATA", payload: [] });
}