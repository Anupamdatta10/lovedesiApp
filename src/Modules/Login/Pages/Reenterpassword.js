import React, { Component } from 'react';
// import { AuthContext } from '../../../Utility/Components/context';
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
const mainContainerHeight = screenheight - 84;
const holidyPageTopPart = 84;
const holidyPageBottomPart = mainContainerHeight - holidyPageTopPart;
import * as LoginController from './../Controller/LoginController';
import Toast from 'react-native-simple-toast';
import AwesomeAlert from 'react-native-awesome-alerts';
import { useTranslation, withTranslation } from 'react-i18next';

import OrientationLoadingOverlay from 'react-native-orientation-loading-overlay';

class Reenterpassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            username: "",
            passwordResetCode: "",
            password: "",
            retypePassword: "",

            usernameError: "",
            passwordResetCodeError: "",
            passwordError: "",
            retypePasswordError: "",
            phone_number:"",
        }

    }

    componentDidMount = () => {
        // this.setState({
        //     username: this.props.route.params.username
        // })
        if (this.props.route.params.hasOwnProperty('username') && this.props.route.params.username != "") {
            this.setState({
                username: this.props.route.params.username
            })
        }
        if (this.props.route.params.hasOwnProperty('phone_number') && this.props.route.params.phone_number != "") {
            this.setState({
                phone_number: this.props.route.params.phone_number
            })
        }
    }


    textInputVarificationChange = (val) => {
        this.setState({
            passwordResetCode: val,
            passwordResetCodeError: ""
        })
    }

    textInputNewPasswordChange = (val) => {
        this.setState({
            password: val,
            passwordError: ""
        })
    }

    textInputreNewPasswordChange = (val) => {
        this.setState({
            retypePassword: val,
            retypePasswordError: ""
        })
    }

    requestForNewPassword = () => {
        const { username, passwordResetCode, password, phone_number } = this.state;
        if (this.validationForPasswordChange()) {
            try {
                let data = {}
                //data['email'] = username;
                if (username != "") {
                    data['username'] = username;
                }
                if (username == "") {
                    data['username'] = phone_number;
                }

                data['password'] = password;
                data['confirmmation_code'] = passwordResetCode;
                this.setState({ loading: true })
                LoginController.changePassword(data).then((response) => {
                    this.setState({ loading: false })
                    if (response.success) {
                        Toast.show(response.message);
                        this.props.navigation.navigate('SignInScreen');
                    } else {
                        Toast.show(response.message);
                    }
                }).catch((error) => {
                    this.setState({ loading: false })
                });

            } catch (error) {
                if (error.code == "UserNotFoundException") {
                    Toast.show(`${this.props.t('usernotfound')}`)
                } else {
                    Toast.show(error.message)
                }
            }
        }

    }

    validationForPasswordChange = () => {
        let valid = true;
        const { passwordResetCode, password, retypePassword } = this.state;
        if (password == "") {
            valid = false;
            this.setState({
                passwordError: `${this.props.t('pleaseenterpassword')}`
            })
        } else {
            this.setState({
                passwordError: ""
            })
        }
        if (retypePassword == "") {
            valid = false;
            this.setState({
                retypePasswordError: `${this.props.t('pleaseretypepassword')}`
            })
        } else {
            this.setState({
                retypePasswordError: ""
            })
        }
        if ((password != "" && retypePassword != "") && password != retypePassword) {
            valid = false;
            this.setState({
                retypePasswordError: `${this.props.t('passworddoesnotmatch')}`,
                passwordError: `${this.props.t('passworddoesnotmatch')}`
            })
        }
        if (passwordResetCode == "") {
            valid = false;
            this.setState({
                passwordResetCodeError: `${this.props.t('pleaseenterverificationcode')}`
            })
        } else {
            this.setState({
                passwordResetCodeError: ""
            })
        }
        return valid;
    }

    forgotPassword = () => {
        const { username, phone_number } = this.state;
        try {
            let data = {}
            //data['email'] = username;
            if (username != "") {
                data['username'] = username;
            }
            if (username == "") {
                data['username'] = phone_number;
            }
            this.setState({ loading: true })
            LoginController.forgotPassword(data).then((response) => {
                this.setState({ loading: false })
                //console.log("response===================forgotPassword", response)
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

    };




    render() {
        let loading = this.state.loading;
        const { t } = this.props;
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
                            <Image source={require('../../../Utility/Public/images/logo.png')} style={{ width: 255, height: 65, resizeMode: 'contain' }} />
                            <View style={styles.innercontainer}>
                                <View style={styles.inputInner}>
                                    <TextInput style={[styles.input, this.state.userStyle]}
                                        underlineColorAndroid="transparent"
                                        placeholder={t('emailaddress')}
                                        placeholderTextColor="#243656"
                                        autoCapitalize="none"
                                        returnKeyLabel='Done'
                                        returnKeyType='done'
                                        //value={this.state.username}
                                        editable={false}
                                        value={this.state.username != "" ? this.state.username : this.state.phone_number}
                                    />
                                </View>
                                <View style={styles.inputInner}>
                                    <TextInput style={[styles.input, this.state.userStyle]}
                                        underlineColorAndroid="transparent"
                                        placeholder={t('varificationcode')}
                                        placeholderTextColor="#243656"
                                        autoCapitalize="none"
                                        returnKeyLabel='Done'
                                        returnKeyType='done'
                                        onChangeText={(val) => this.textInputVarificationChange(val)}
                                    />
                                    {this.state.passwordResetCodeError != "" ?

                                        <Animatable.View animation="fadeInLeft" duration={500}>
                                            <Text style={styles.error}>{this.state.passwordResetCodeError}</Text>
                                        </Animatable.View>

                                        : null}
                                </View>
                                <View style={styles.inputInner}>
                                    <TextInput style={[styles.input, this.state.passwordStyle]}
                                        underlineColorAndroid="transparent"
                                        placeholder={t('newpassword')}
                                        placeholderTextColor="#243656"
                                        autoCapitalize="none"
                                        secureTextEntry={true}
                                        //onFocus={this.onFocusInputField.bind(this, "password")}
                                        returnKeyLabel='Done'
                                        returnKeyType='done'
                                        onChangeText={(val) => this.textInputNewPasswordChange(val)}
                                    />
                                    {this.state.passwordError != "" ?

                                        <Animatable.View animation="fadeInLeft" duration={500}>
                                            <Text style={styles.error}>{this.state.passwordError}</Text>
                                        </Animatable.View>

                                        : null}
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
                                        onChangeText={(val) => this.textInputreNewPasswordChange(val)}
                                    />
                                    {this.state.retypePasswordError != "" ?

                                        <Animatable.View animation="fadeInLeft" duration={500}>
                                            <Text style={styles.error}>{this.state.retypePasswordError}</Text>
                                        </Animatable.View>

                                        : null}
                                </View>

                                <View style={styles.buttonInner}>
                                    <TouchableHighlight
                                        style={styles.button}
                                        underlayColor='#42A8E5'
                                    >
                                        <Text style={styles.buttonText} onPress={this.requestForNewPassword}>{t('changepassword')}</Text>
                                    </TouchableHighlight>
                                </View>

                                <View style={styles.backpage}>
                                    <TouchableHighlight><Text onPress={this.forgotPassword}>{t('resendvarificationcode')}</Text></TouchableHighlight>
                                </View>
                            </View>
                        </View>

                    </View>
                </TouchableWithoutFeedback>
            </>
        );
    }
}
// Reenterpassword.contextType = AuthContext;
//export default Reenterpassword;
export default (withTranslation()(Reenterpassword));
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
        marginTop: 10,
        backgroundColor: '#fff',
        textAlign: 'center',
        paddingLeft: 15,
        paddingRight: 15,


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
        marginTop: 10,

    },
    lebel: {
        color: '#243656',
        fontFamily: 'Poppins-Regular',
        fontSize: 13,
    },
    input: {
        padding: 10,
        height: 45,
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
        paddingBottom: 40,
        //backgroundColor:'#ccc',
    },
    button: {
        width: '90%',
        height: 47,
        //fontSize: 13,
        backgroundColor: '#42A8E5',
        borderRadius: 50,
        textAlign: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

    },
    uptext: {
        textAlign: 'left',
    },
    elevation: {
        elevation: 20,
        shadowColor: '#52006A',
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
        opacity: 0.5
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
    backpage: {
        display: 'flex',
        alignItems: 'center',
        color: '#243656',
    },


});
