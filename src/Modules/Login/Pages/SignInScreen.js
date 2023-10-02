import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Platform,
    StyleSheet,
    StatusBar,
    Alert,
    Image,
    Button,
    ImageBackground,
    ActivityIndicator,
    TouchableHighlight,
    Dimensions,
    Pressable,
    Keyboard,
    TouchableWithoutFeedback,
    LogBox,
    AsyncStorage

} from 'react-native';
import Toast from 'react-native-simple-toast';
import * as Animatable from 'react-native-animatable';
import * as LoginController from './../Controller/LoginController';
const screen = Dimensions.get("window");
const screenWidth = screen.width;
const screenheight = screen.height;
const mainContainerWidth = screenWidth - 80;
import GlobalModal from '../../../Utility/Components/GlobalModal';
import ChangePasswordModalContent from '../../Login/Components/ChangePasswordModalContent';
import Feather from 'react-native-vector-icons/Feather';
import { showMessage, hideMessage } from "react-native-flash-message";
import OrientationLoadingOverlay from 'react-native-orientation-loading-overlay';
import { useTranslation, withTranslation } from 'react-i18next';

class SignInScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: {
                username: '',
                password: '',
            },

            userNamefocused: false,
            passwordfocused: false,
            userStyle: "",
            passwordStyle: "",
            loading: false,
            //error modal flag

            messageModalflag: false,
            messageString: "",
            usernameError: '',
            passwordError: '',
            loginCredentials: {},
            selectLanguage: this.props.i18n.language,
            modalVisible: false,

            //Updated password
            updatedPasswordSession: "",
            challangeName: "",
            responseUserName: "",
            updated_password: "",
            updated_confirm_password: "",
            updated_passwordError: "",
            updated_confirm_password: "",
            passtype: true,
            passwordLock: false,
            remeamberMe:false
        }
    }

    textInputChange = async (val) => {
        const { formData } = this.state;
        formData['username'] = val;
        this.setState({
            formData,
            usernameError: ""
        })

    }
    handlePasswordChange = async (val) => {
        const { formData } = this.state;
        formData['password'] = val;

        this.setState({
            formData,
            passwordError: ""
        })
    }

    handleValidation = () => {
        let valid = true;
        const { formData } = this.state;
        const { t } = this.props;

        if (formData.username == "") {

            this.setState({
                usernameError: `${t('invalidfield')}`
            })

            valid = false;
        } else {
            this.setState({
                usernameError: ""
            })

        }


        if (formData.password == "") {
            valid = false;
            this.setState({
                passwordError: `${t('invalidfield')}`
            })
        }

        return valid;

    }

    messageModalClose = () => {
        this.setState({
            messageModalflag: false,
        })
    }

    messageModalToggel = () => {
        this.setState({ messageModalflag: !this.state.messageModalflag })
    }

    showText = () => {
        this.setState({
            passwordLock: true,
            passtype: false
        })
    }

    showPassword = () => {
        this.setState({
            passwordLock: false,
            passtype: true
        })
    }

    loginSubmit = async () => {

        if (this.handleValidation()) {
            const { formData } = this.state;
            const { t } = this.props;
            //AsyncStorage.clear();
            let data = {}
            data["username"] = formData.username
            data["password"] = formData.password
            if(this.state. remeamberMe){
                await AsyncStorage.setItem('password', formData.password);
                await AsyncStorage.setItem('username', formData.username);
            }
            //data["date"] = new Date();
            this.setState({ loading: true })
            //console.log("response====data=======", data)
            LoginController.loginGetApi(data).then((response) => {
                //console.log("response====login=======", response)

                this.setState({ loading: false })
                if (response) {
                    if (response.success) {
                        //new password set
                        if (response.data.challengeName == "NEW_PASSWORD_REQUIRED") {
                            this.setState({
                                updatedPasswordSession: response.data.session,
                                challangeName: response.data.challengeName,
                                responseUserName: response.data.username
                            }, () => {
                                this.setModalVisible(true)
                            })
                        } else {
                            this._storeData(response)
                            showMessage({
                                message: `${t('login_successfully')}`,
                                type: "info",
                            });
                        }
                    } else {
                        if (response.message == `${t('userdoesnotexist')}`) {
                            Toast.show(response.message);

                        } else {
                            Toast.show(response.message);
                        }

                    }
                }
            }).catch((error) => {
                this.setState({
                    loading: false
                })
                Toast.show(`${this.props.t('sessionexpiredmsg')}`);

            });

        } else {
            this.setState({
                loading: false
            })
        }
    }

    currentUser = (finalIdToken) => {
        const { setUserDetails, setToken } = this.props;
        let header = {
            "Authorization": finalIdToken
        }
        this.setState({
            loading: true
        })
        LoginController.getCurrentUser(header).then((userResponse) => {
            //console.log("userResponse=============",userResponse)
            this.setState({
                loading: false
            })
            if (userResponse.success) {
                this.setState({
                    loginCredentials: userResponse.data
                }, () => {
                    //redux set user details  
                    //console.log("this.state.loginCredentials============",this.state.loginCredentials)  

                    setUserDetails(this.state.loginCredentials).then(() => {
                        setToken(finalIdToken).then((res) => {
                            this._getCredencialData();
                        })
                    })

                })
            } else {
                /*logOutApp().then(
                    () => history.push("/")
                );
                Utility.toastNotifications(userResponse.message, "Error", "error")*/
            }
        }).catch(err => {
            console.log("LoginController.getCurrentUser err .....", err)
            this.setState({
                loading: false
            })
        })
    }

    getExpiryDetails = (expiresIn) => {
        var today = new Date();
        var afterAddWithToday = new Date();
        afterAddWithToday.setSeconds(afterAddWithToday.getSeconds() + (expiresIn - 900));
        let data = {};
        data["loggedInTime"] = today
        data["expiryTime"] = afterAddWithToday
        data["expiryInterval"] = expiresIn
        return data;
    }

    _storeData = async (response) => {

        //console.log("login======response===", response)

        try {
            const finalIdToken = "Bearer " + response.data.idToken;

            await AsyncStorage.setItem('finalIdToken', finalIdToken);
            await AsyncStorage.setItem('i18nextLng', this.props.i18n.language);
            await AsyncStorage.setItem('accessToken', response.data.accessToken);
            await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
            const expiresIn = this.getExpiryDetails(response.data.expiresIn)
            await AsyncStorage.setItem('loginTime', JSON.stringify(expiresIn));

            this.currentUser(finalIdToken);
            /*setToken(finalIdToken).then((res) => {                
                
            })*/


        } catch (error) {
            // Error saving data
        }
    };

    _getCredencialData = async () => {
        try {
            this.context.signIn("Home");
        } catch (error) {
            // Error saving data
        }
    };


    onFocusInputField = (event) => {
        if (event == "userName") {
            this.setState({
                userNamefocused: true,
                passwordfocused: false,
            }, () => {
                this.setState({
                    userStyle: styles.textinput_focused,
                    passwordStyle: styles.textinput_unfocused,
                })
            })
        }
        if (event == "password") {
            this.setState({
                userNamefocused: false,
                passwordfocused: true,
            }, () => {
                this.setState({
                    userStyle: styles.textinput_unfocused,
                    passwordStyle: styles.textinput_focused,
                })
            })
        }

        /*this.setState({
            style: styles.textinput_focused
        })*/
    }
    onBlurInputField = () => {

    }
    forgotPass = () => {
        //console.log("this.props=======",this.props)
        this.props.navigation.navigate('Forgotpassword');
    };

    languageChange = async (val) => {
        //console.log("this.props",this.props)
        //console.log("val===============",val)
        await AsyncStorage.setItem('i18nextLng', val)
        this.setState({
            selectLanguage: val,
            passtype: false,
            passwordLock: true
        }, () => {
            this.props.i18n.changeLanguage(val);
        })

    }

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }


    updatedPassword = () => {
        const { updated_password, updated_confirm_password, responseUserName, updatedPasswordSession, challangeName } = this.state;
        let valid = this.updatePasswordCheck();
        if (valid) {
            this.setState({
                loading: true
            })
            let header = {};
            header["session"] = updatedPasswordSession;
            let data = {
                "username": responseUserName,
                "password": updated_password,
                //session:session,
                "challengeName": challangeName
            }
            LoginController.forcePasswordChange(data, header).then((response) => {
                //console.log("====updatedPassword====",response)
                //console.log("====data====",data)
                if (response) {
                    this.setState({
                        loading: false
                    })
                    if (response.success) {
                        Toast.show(`${this.props.t('passwordchangedsuccessfully')}`)
                        this.setModalVisible(false)
                    } else {
                        this.setState({
                            loading: false
                        })
                    }
                }
            }).catch((error) => {
                this.setState({
                    loading: false
                })
                Toast.show(`${this.props.t('sessionexpiredmsg')}`);
            });
        }
    }

    updatePasswordCheck = () => {
        let valid = true;
        const { updated_password, updated_confirm_password } = this.state;
        const { t } = this.props;

        let passwordValidate = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\^$*.\[\]{}\(\)?\-“!@#%&/,><\’:;|_~`])\S{6,99}$/.test(updated_password);

        if (passwordValidate) {
            this.setState({
                updated_passwordError: ''
            })
        } else {
            valid = false;
            this.setState({
                updated_passwordError: `${t('thisfieldisinvalid')}`
            })
            // Toast.show(` Minimum length, which must be at least 6 characters but fewer than 99 characters.
            // Require numbers, Require a special character from this set: = + - ^ $ * . [ ] { } ( ) ?  ! @ # % & / \ , > < ' : ; | _ ~ ,Require uppercase letters, Require lowercase letters.`);
        }


        let CpasswordValidate = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\^$*.\[\]{}\(\)?\-“!@#%&/,><\’:;|_~`])\S{6,99}$/.test(updated_confirm_password);

        if (CpasswordValidate) {
            this.setState({
                updated_confirm_passwordError: ''
            })
        } else {
            valid = false;
            this.setState({
                updated_confirm_passwordError: `${t('thisfieldisinvalid')}`
            })
            // Toast.show(` Minimum length, which must be at least 6 characters but fewer than 99 characters.
            // Require numbers, Require a special character from this set: = + - ^ $ * . [ ] { } ( ) ?  ! @ # % & / \ , > < ' : ; | _ ~ ,Require uppercase letters, Require lowercase letters.`);
        }

        if (updated_password == updated_confirm_password && updated_password != "" && updated_confirm_password != "") {
            this.setState({
                updated_passwordError: '',
                updated_confirm_passwordError: ''
            })
        } else {
            valid = false;
            Toast.show(`${t('updatepasswordtxt')}`);

        }

        return valid;

    }

    handleConfirmPasswordChange = (val) => {
        //console.log("handleConfirmPasswordChange===========",val)
        this.setState({
            updated_confirm_password: val,
            updated_confirm_passwordError: ""
        })
    }
    handleUpdatedPasswordChange = (val) => {
        //console.log("handleUpdatedPasswordChange===========",val)
        this.setState({
            updated_password: val,
            updated_passwordError: ""
        })
    }

    calendarView = () => {
        this.props.navigation.navigate('CalendarView');
    }
    // demoNav = () => {
    //     this.props.navigation.navigate('Demopage');
    // }
    componentDidMount = () => {
        LogBox.ignoreLogs(["EventEmitter.removeListener"]);
        this.loginCredentialsSave();
    }

    loginCredentialsSave = async () => {

        console.log("await AsyncStorage.getItem('remeamberMe')",await AsyncStorage.getItem('remeamberMe'));

        let checkboxRemeamber =JSON.parse(await AsyncStorage.getItem('remeamberMe'));

        const { formData } = this.state;
        formData['username'] = formData.username == "" ? await AsyncStorage.getItem('username') : formData.username;
        formData['password'] = formData.password == "" ? await AsyncStorage.getItem('password') : formData.password;
        //let remeamberMeTemp = checkboxRemeamber==true?checkboxRemeamber:false;
        let remeamberMeTemp = true;
        this.setState({
            formData,
            remeamberMe:remeamberMeTemp
        })

    }

    pleaseRemeamberMe=async(e)=>{
        if(e){
            await AsyncStorage.setItem('remeamberMe', JSON.stringify(true));
            this.setState({
                remeamberMe:true
            })
        }else{
            await AsyncStorage.setItem('remeamberMe', JSON.stringify(false));
            this.setState({
                remeamberMe:false
            })
            await AsyncStorage.setItem('password', "");
            await AsyncStorage.setItem('username', "");
        }
        
    }

    render() {
        const { formData } = this.state;
        let className = [styles.button];
        if (formData.username != "" && formData.password != "") {
            className = [styles.button, styles.buttonActive];
        }
        let loading = this.state.loading;
        const { t } = this.props;
        // console.log("---this.props.i18n.language----", this.props.i18n.language)
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.mainContainer}>
                    {loading ?
                        <View>
                            <OrientationLoadingOverlay
                                visible={true}
                            >
                                <View>
                                    <Image
                                        source={require('../../../Utility/Public/images/spinnerloader.gif')}
                                        style={{ height: 30, resizeMode: 'contain' }} />
                                </View>
                            </OrientationLoadingOverlay>

                        </View>
                        :
                        null
                    }

                    <View style={styles.mainContainer}>


                        <View style={styles.container}>
                            {/* <Image source={require('../../../Utility/Public/images/logo.png')} style={{ height: 70, resizeMode: 'contain' }} /> */}
                            <Text>Jhantu chuma da</Text>
                            <View style={styles.innercontainer}>
                                <View style={styles.inputInner}>
                                    <TextInput style={[styles.input, this.state.userStyle]}
                                        underlineColorAndroid="transparent"
                                        placeholder={t('username')}
                                        placeholderTextColor="#babfc9"
                                        autoCapitalize="none"
                                        onChangeText={(val) => this.textInputChange(val)}
                                        //onEndEditing={(e) => this.handleValidUser(e.nativeEvent.text)}

                                        onFocus={this.onFocusInputField.bind(this, "userName")}
                                        returnKeyLabel='Done'
                                        returnKeyType='done'
                                        onSubmitEditing={() => { this.loginSubmit() }}
                                        value={formData.username}
                                    />
                                    {this.state.usernameError != "" ?

                                        <Animatable.View animation="fadeInLeft" duration={500}>
                                            <Text style={styles.error}>{this.state.usernameError}</Text>
                                        </Animatable.View>

                                        : null}


                                </View>
                                <View style={{ ...styles.inputInner, ...{ position: 'relative' } }}>
                                    <TextInput style={[styles.input, this.state.passwordStyle]}
                                        underlineColorAndroid="transparent"
                                        placeholder={t('password')}
                                        placeholderTextColor="#babfc9"
                                        autoCapitalize="none"
                                        secureTextEntry={this.state.passtype}
                                        onChangeText={(val) => this.handlePasswordChange(val)}
                                        //onEndEditing={(e) => this.handleValidPassword(e.nativeEvent.text)}
                                        onFocus={this.onFocusInputField.bind(this, "password")}
                                        returnKeyLabel='Done'
                                        returnKeyType='done'
                                        //returnKeyLabel={formData.username!="" && formData.password!="" ?"Done":null}
                                        //returnKeyType={formData.username!="" && formData.password!="" ?"done":null}
                                        onSubmitEditing={() => { this.loginSubmit() }}
                                        value={formData.password}

                                    />
                                    {!this.state.passwordLock ?
                                        <TouchableOpacity style={styles.showiconbtn} onPress={this.showText}><Feather name="eye-off" color="#999" size={14} /></TouchableOpacity>
                                        :
                                        <TouchableOpacity style={styles.showiconbtn} onPress={this.showPassword}><Feather name="eye" color="#999" size={14} /></TouchableOpacity>
                                    }
                                    {this.state.passwordError != "" ?
                                        <Animatable.View animation="fadeInLeft" duration={500}>
                                            <Text style={styles.error}>{this.state.passwordError}</Text>
                                        </Animatable.View>
                                        : null}
                                </View>
                                <View style={styles.buttonInner}>
                                    <TouchableHighlight
                                        style={[className, styles.elevation]}
                                        underlayColor='#42A8E5'
                                        onPress={() => { this.loginSubmit() }}
                                    >
                                        <Text style={styles.buttonText}>{t('login')}</Text>
                                    </TouchableHighlight>
                                </View>

                                
                                <TouchableOpacity onPress={this.forgotPass}>
                                    <Text style={styles.forgotText}>{t('forgotyourpassword?')}</Text>
                                </TouchableOpacity>
                               
                                <GlobalModal
                                    visible={this.state.modalVisible}
                                    onCancel={() => this.setModalVisible(false)}
                                    footer={false}
                                    header={true}
                                    headerTitle={t('changepassword')}
                                    body={
                                        <ChangePasswordModalContent
                                            updatedPassword={this.updatedPassword}
                                            updated_password={this.state.updated_password}
                                            updated_confirm_password={this.state.updated_confirm_password}
                                            handleConfirmPasswordChange={this.handleConfirmPasswordChange}
                                            handleUpdatedPasswordChange={this.handleUpdatedPasswordChange}
                                            updated_confirm_passwordError={this.state.updated_confirm_passwordError}
                                            updated_passwordError={this.state.updated_passwordError}
                                        />
                                    }

                                />


                            </View>
                        </View>

                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}
// SignInScreen.contextType = AuthContext;

const mapStateToProps = (globalState) => {
    return {
        token: globalState.mainReducer.token

    };
}

/*const mapDispatchToProps = (dispatch) => {
    return {
        tokenActions: (token) => dispatch(setToken(token)),
        setUserDetailsActions: (data) => dispatch(setUserDetails(data))
    }
};*

export default connect(mapStateToProps, mapDispatchToProps)(SignInScreen)*/

// export default connect(mapStateToProps, { setToken, setUserDetails })(withTranslation()(SignInScreen));
export default (withTranslation()(SignInScreen));


//export default SignInScreen;

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: '#fff',
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        padding: 0,
    },
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        width: mainContainerWidth,
    },
    innercontainer: {
        width: '100%',
        marginTop: 25,
        backgroundColor: '#fff',
        textAlign: 'center',
        paddingLeft: 15,
        paddingRight: 15,
    },
    langaugebox: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        //backgroundColor: 'red',
        marginRight: 15,
        marginTop: -15,
    },
    inputInner: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        width: '100%',
        borderRadius: 20,
        marginBottom: 15,
        position: 'relative',
        flexWrap: 'wrap',

    },
    input: {
        padding: 10,
        height: 50,
        fontSize: 13,
        borderColor: '#F5F7FA',
        borderWidth: 2,
        backgroundColor: '#fff',
        borderRadius: 20,
        color: '#243656',
        fontFamily: 'Poppins-Regular',
        textAlign: 'center',
        width: '100%',
    },
    error: {
        width: '100%',
        color: 'red',
        fontSize: 10,
        textAlign: 'center',
        fontFamily: 'Poppins-Regular',
        margin: 0,
        padding: 0,
    },
    buttonInner: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        flex: 1,
        paddingTop: 40,
        paddingBottom: 40
    },
    button: {
        width: '90%',
        height: 50,
        //fontSize: 13,
        backgroundColor: '#0070BA',
        borderRadius: 50,
        textAlign: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

    },
    elevation: {
        elevation: 12,
        shadowColor: '#0070BA',

    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
    },
    forgotText: {
        width: '100%',
        color: '#243656',
        fontSize: 13,
        lineHeight: 19,
        marginTop: 10,
        marginBottom: 20,
        textAlign: 'center',
        opacity: 0.5,
        fontFamily: 'Poppins-Regular',
    },
    errorMsgBox: {
        paddingLeft: 0,
        position: 'absolute',
        left: 4,
        bottom: -15
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 15,
        fontFamily: 'Poppins-Regular'
    },
    textinput_focused: {
        borderColor: '#F5F7FA'
    },
    textinput_unfocused: {
        borderColor: '#F5F7FA'
    },
    showiconbtn: {
        position: 'absolute',
        right: 15
    },
    loader: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 99999,
        width: screenWidth,
        height: screenheight,
    },
    innloader: {
        backgroundColor: '#fff',
        padding: 10,
    },
    sameAlign: {
        alignItems: 'center',
        alignSelf: 'center',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    checktext: {
        color: '#243656',
        opacity: 0.5,
        fontSize: 13,
        fontFamily: 'Poppins-Regular',
        paddingTop: 4,
        paddingLeft: 10
    },

});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        padding: 0,
        // fontSize: 16,
        color: '#9DA8B7',
        //width: 300,
        fontSize: 12,
        opacity: 1,
        paddingRight: 5,
        fontFamily: 'Poppins-Regular',
        height: 30,
        position: 'relative',
        zIndex: 99,
    },
    inputAndroid: {
        padding: 0,
        // fontSize: 16,
        color: '#9DA8B7',
        //width: 300,
        fontSize: 12,
        opacity: 1,
        paddingRight: 5,
        fontFamily: 'Poppins-Regular',
        //backgroundColor:'red',
        height: 30,
        position: 'relative',
        zIndex: 99,
    }
});