import React, { Component } from 'react';
//import { AuthContext } from '../../../Utility/Components/context';
import * as Animatable from 'react-native-animatable';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Image,
    TouchableHighlight,
    Dimensions,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
const screen = Dimensions.get("window");
const screenWidth = screen.width;
const screenheight = screen.height;
const mainContainerWidth = screenWidth - 60;
const buttonTextWidth = mainContainerWidth - 180;

import * as LoginController from './../Controller/LoginController';
import Toast from 'react-native-simple-toast';
import AwesomeAlert from 'react-native-awesome-alerts';
import { useTranslation, withTranslation } from 'react-i18next';

// import { connect } from 'react-redux';
import {AsyncStorage} from 'react-native';
import OrientationLoadingOverlay from 'react-native-orientation-loading-overlay';

class Changepassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usernameError: "",
            username: "",
            loading: false,
            formData: {
                "user_email": this.props.currentUserDetails.user_details.user_email != '' ? this.props.currentUserDetails.user_details.user_email : this.props.currentUserDetails.user_details.contact_number,
                "current_password": "",
                "new_password": "",
                "re_new_password": ""
            }
        }

    }

    componentDidMount = () => {
		this.focusListener = this.props.navigation.addListener('focus', () => {
			this.resetData()
		})

	}
	resetData = () => {
		this.setState({
            formData: {
                "user_email": this.props.currentUserDetails.user_details.user_email != '' ? this.props.currentUserDetails.user_details.user_email : this.props.currentUserDetails.user_details.contact_number,
                "current_password": "",
                "new_password": "",
                "re_new_password": ""
            }
        })
	}


    forgotPassword = () => {
        const { username } = this.state;
        if (this.validationForEmail()) {
            try {
                let data = {}
                data['email'] = username;
                this.setState({ loading: true })
                LoginController.forgotPassword(data).then((response) => {
                    this.setState({ loading: false })
                    //console.log("response===================forgotPassword",response)
                    if (response.success) {
                        Toast.show(response.message);
                        this.props.navigation.navigate('Reenterpassword', { "username": username });
                    } else {
                        Toast.show(response.message);
                    }

                }).catch((error) => {
                    this.setState({ loading: false })
                });

            } catch (error) {
                this.setState({ loading: false })
                if (error.code == "UserNotFoundException") {
                    Toast.show(`${this.props.t('usernotfound')}`)
                } else {
                    Toast.show(error.message)
                }
            }
        }

    };
    returnTologin = () => {
        this.props.navigation.navigate('SignInScreen', {
            onGoBack: () => this.refresh(),
        });
    };

    validationForEmail = () => {
        let valid = true;
        const { username } = this.state;
        let emailValidate = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(username);
        if (emailValidate) {
            this.setState({
                usernameError: ""
            })
        } else {
            valid = false;
            this.setState({
                usernameError: `${this.props.t('pleaseentervalidemail')}`
            })
        }
        return valid;
    }

    textInputChange = (val) => {
        this.setState({
            username: val,
            usernameError: ""
        })

    }

    handleUpdatedPasswordChange = (val, type) => {
        //console.log("val=====", val);
        //console.log("type=====", type);
        let tempFormData = Object.assign({}, this.state.formData);
        if (type == 'current_password') {
            tempFormData['current_password'] = val;
        }
        if (type == 'new_password') {
            tempFormData['new_password'] = val;
        }
        if (type == 're_new_password') {
            tempFormData['re_new_password'] = val;
        }

        this.setState({
            formData: tempFormData
        }, () => {
            console.log(this.state.formData)
        })
    }

    canclePassword=()=>{
        this.props.navigation.goBack();
    }

    updatedPassword=async()=>{
        const {formData} = this.state;
        let valid = this.formValidationCheck();
        //console.log("Valid===",valid)
        if(valid){
            let data = {}
            data['pre_password'] = formData.current_password;
            data['new_password'] = formData.new_password;

            let headers={}
            headers["Authorization"] = await AsyncStorage.getItem('finalIdToken');
            headers["Accesstoken"] = await AsyncStorage.getItem('accessToken');
           
            this.setState({ loading: true })
            LoginController.updatedPassword(data,headers).then((response) => {
                this.setState({ loading: false })
                //console.log("response===================forgotPassword",response)
               if (response.success) {
                    Toast.show(response.message);
                    this.props.navigation.navigate('Home');
                    this.setState({
                        formData: {
                            "user_email": this.props.currentUserDetails.user_details.user_email != '' ? this.props.currentUserDetails.user_details.user_email : this.props.currentUserDetails.user_details.contact_number,
                            "current_password": "",
                            "new_password": "",
                            "re_new_password": ""
                        }
                    })
                } else {
                    Toast.show(response.message);
                }

            }).catch((error) => {
                this.setState({ loading: false })
            });
        }
    }

    formValidationCheck=()=>{
        const {formData} = this.state;
        const {t} = this.props;
        let valid =true;
        let passwordValidate = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\^$*.\[\]{}\(\)?\-“!@#%&/,><\’:;|_~`])\S{6,99}$/.test(formData.new_password);
        let CpasswordValidate = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\^$*.\[\]{}\(\)?\-“!@#%&/,><\’:;|_~`])\S{6,99}$/.test(formData.re_new_password);

        if(formData.current_password==""){
            valid=false;
            Toast.show(`${this.props.t('pleaseentercurrentpassword')}`)
        }else if(formData.new_password==""){
            valid=false;
            Toast.show(`${this.props.t('pleaseenternewpassword')}`)
        }else if(formData.re_new_password==""){
            valid=false;
            Toast.show(`${this.props.t('pleaseenterReenterpassword')}`)
        }else if(!passwordValidate) {
            valid = false;
            Toast.show(`${this.props.t('pleaseentercorrectpasswordformat')}`)
        } else if (!CpasswordValidate) {
            valid = false;
            Toast.show(`${this.props.t('pleaseentercorrectpasswordformat')}`)
        } else if (formData.new_password != formData.re_new_password) {
            valid = false;
            Toast.show(`${t('updatepasswordtxt')}`);
        }
        return valid;
    }

    render() {

        let loading = this.state.loading;
        const { t } = this.props;
        const { formData } = this.state;
        //console.log("t('instructionmsg')===",t('instructionmsg'))
       // console.log("formData==========",formData)
        return (
            <>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <View style={styles.mainContainer}>
                        {loading ?
                            <View>
                                {/* <AwesomeAlert
                                    show={loading}
                                    showProgress={true}
                                    title=""
                                    message=""
                                    closeOnTouchOutside={false}
                                    closeOnHardwareBackPress={false}
                                    showCancelButton={false}
                                    showConfirmButton={false}
                                    cancelText=""
                                    confirmText=""
                                    confirmButtonColor="#00ff00"
                                    cancelButtonColor="#DD6B55"
                                    onCancelPressed={() => {
                                        this.cancelAlert();
                                    }}
                                    onConfirmPressed={() => {
                                        this.confirmAlert();
                                    }}
                                /> */}
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
                        <View style={styles.container}>

                            <View style={styles.changePassContent}>
                                <View style={styles.innercontainer}>
                                    <Text style={styles.uptext}>{t('changepassword')}</Text>
                                </View>
                                <View style={styles.inputInner}>
                                    <TextInput style={[styles.input, this.state.passwordStyle]}
                                        underlineColorAndroid="transparent"
                                        placeholder={t('username')}
                                        placeholderTextColor="#243656"
                                        autoCapitalize="none"
                                        textAlign='center'
                                        // onFocus={this.onFocusInputField.bind(this, "userName")}
                                        returnKeyLabel='Done'
                                        returnKeyType='done'
                                        editable={false}
                                        value={formData.user_email}
                                        //onChangeText={(val) => this.props.handleUpdatedPasswordChange(val)}
                                    />

                                </View>
                                <View style={styles.inputInner}>
                                    <TextInput style={[styles.input, this.state.passwordStyle]}
                                        underlineColorAndroid="transparent"
                                        placeholder={t('enterCurrentPassword')}
                                        placeholderTextColor="#243656"
                                        autoCapitalize="none"
                                        textAlign='center'
                                        secureTextEntry={true}
                                        // onFocus={this.onFocusInputField.bind(this, "password")}
                                        returnKeyLabel='Done'
                                        returnKeyType='done'
                                        onChangeText={(val) => this.handleUpdatedPasswordChange(val, 'current_password')}
                                        value={formData.current_password}
                                    />

                                </View>
                                <View style={styles.inputInner}>
                                    <TextInput style={[styles.input, this.state.passwordStyle]}
                                        underlineColorAndroid="transparent"
                                        placeholder={t('enterNewPassword')}
                                        placeholderTextColor="#243656"
                                        autoCapitalize="none"
                                        secureTextEntry={true}
                                        //onFocus={this.onFocusInputField.bind(this, "password")}
                                        returnKeyLabel='Done'
                                        returnKeyType='done'
                                        textAlign='center'
                                        onChangeText={(val) => this.handleUpdatedPasswordChange(val, 'new_password')}
                                        value={formData.new_password}
                                    />

                                </View>
                                <View style={styles.inputInner}>
                                    <TextInput style={[styles.input, this.state.passwordStyle]}
                                        underlineColorAndroid="transparent"
                                        placeholder={t('reenterpassword')}
                                        placeholderTextColor="#243656"
                                        autoCapitalize="none"
                                        secureTextEntry={true}
                                        //onFocus={this.onFocusInputField.bind(this, "password")}
                                        returnKeyLabel='Done'
                                        returnKeyType='done'
                                        textAlign='center'
                                        onChangeText={(val) => this.handleUpdatedPasswordChange(val, 're_new_password')}
                                        value={formData.re_new_password}
                                    />

                                </View>
                                <View style={styles.buttonInner}>
                                    <TouchableOpacity
                                        style={[styles.elevation]}
                                        underlayColor='#42A8E5'
                                        onPress={this.updatedPassword}
                                    >
                                        <Text style={styles.buttonText}>{t('submit')}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.elevation]}
                                        underlayColor='#42A8E5'
                                        onPress={this.canclePassword}
                                    >
                                        <Text style={[styles.buttonText, styles.cancelbuttonText]}>{t('cancel')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View>
                                <Text style={styles.instructiontxt}> {t('instructionmsg')}</Text>
                            </View>
                        </View>


                    </View>

                </TouchableWithoutFeedback>
            </>
        );
    }
}
// Changepassword.contextType = AuthContext;


// const mapStateToProps = (globalState) => {
//     //console.log("globalState",globalState)
//     return {
//         token: globalState.mainReducer.token,
//         currentUserDetails: globalState.mainReducer.currentUserDetails,
//     };
// }
export default (withTranslation()(Changepassword));

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
        height: screenheight,
        justifyContent: 'center',

    },
    changePassContent: {
        width: '100%',
        backgroundColor: 'transparent',
        justifyContent: "center",
        alignItems: "center",
        padding: 25,
        paddingTop: 0,
        //height: 300,
        borderRadius: 15,
        flexWrap: 'wrap',
        flexDirection: 'column',
        borderWidth: 1,
        borderColor: '#ccc',

    },
    inputInner: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        width: '100%',
        borderRadius: 20,
        marginBottom: 5,
        position: 'relative',
        flexWrap: 'wrap',
        marginTop: 5,
        height: 45,
        color: '#243656',

    },
    buttonInner: {
        marginTop: 15,
        height: 45,
        width: '100%',
        position: 'relative',
        borderRadius: 20,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        //backgroundColor:'#ccc',
        alignItems: 'center',

    },
    elevation: {
        elevation: 20,
        shadowColor: '#52006A',
        width: buttonTextWidth,
        //backgroundColor:'red'
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
        lineHeight: 45,
        padding: 0,
        height: 45,
        borderRadius: 20,
        backgroundColor: '#0070BA',
        //display: 'flex',
        justifyContent: 'center',
        width: 120,
        marginLeft: 0,
        marginRight: 0,
        borderWidth: 1,
        borderColor: '#0070BA',
        //backgroundColor:'yellow'
    },
    cancelbuttonText: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#0070BA',
        color: '#0070BA',
        marginLeft:0,
        marginRight: 0,
    },
    input: {
        padding: 10,
        height: 45,
        fontSize: 13,
        // borderColor: '#F5F7FA',
        // borderWidth: 2,
        //backgroundColor: '#fff',
        borderRadius: 20,
        color: '#243656',
        fontFamily: 'Poppins-Regular',
        textAlign: 'center',
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
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
    instruction: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        width: '100%',
        position: 'relative',
        flexWrap: 'wrap',
        marginTop: 15,
    },
    instructiontxt: {
        color: 'red',
        fontFamily: 'Poppins-Regular',
        margin: 0,
        padding: 0,
        fontSize: 8,
        textAlign: 'center',
        lineHeight: 10,
        marginTop:10,
    },
    innercontainer: {
        width: '100%',
        marginTop: 15,
        marginBottom: 10,
        backgroundColor: '#fff',
        textAlign: 'center',

    },
    uptext: {
        textAlign: 'center',
        color: '#243656',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
    },


});
