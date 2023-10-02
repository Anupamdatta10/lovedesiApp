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
import OrientationLoadingOverlay from 'react-native-orientation-loading-overlay';
import { useTranslation, withTranslation } from 'react-i18next';

class Forgotpassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usernameError: "",
            username: "",
            loading: false,
            phone_number:"",
        }

    }

    forgotPassword = () => {
        const { username, phone_number } = this.state;
        if (this.validationForEmail()) {
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
                // console.log("data------------->>>>>>>>>>",data)
                LoginController.forgotPassword(data).then((response) => {
                    this.setState({ loading: false })
                    // console.log("response===================forgotPassword",response)
                    if (response.success) {
                        Toast.show(response.message);
                        // console.log("response.message===================forgotPassword",response.message)
                        //this.props.navigation.navigate('Reenterpassword', { "username": username });
                        if (username != "") {
                            this.props.navigation.navigate('Reenterpassword', { "username": username });
                        }
                        if (username == "") {
                            this.props.navigation.navigate('Reenterpassword', { "username": phone_number });
                        }
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
        const { username, phone_number } = this.state;
        let emailValidate = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(username);
        if (emailValidate || phone_number != '') {
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
        let emailValidate = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val);
        // this.setState({
        //     username: val,
        //     usernameError: ""
        // })
        if (emailValidate) {
            this.setState({
                username: val,
                usernameError: ""
            })
        } else {
            this.setState({
                phone_number: val,
                usernameError: ""
            })
        }

    }

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
                            <Image source={require('../../../Utility/Public/images/logo.png')} style={{ width: 255, height: 106, resizeMode: 'contain' }} />
                            <View style={styles.innercontainer}>
                                <Text style={styles.uptext}>{t('forgotpassmsg')}</Text>
                                <View style={styles.inputInner}>
                                    <Text style={styles.lebel}>{t('username')}</Text>
                                    <TextInput style={[styles.input, this.state.userStyle]}
                                        underlineColorAndroid="transparent"
                                        placeholder=""
                                        placeholderTextColor="#babfc9"
                                        autoCapitalize="none"
                                        returnKeyLabel='Done'
                                        returnKeyType='done'
                                        onChangeText={(val) => this.textInputChange(val)}
                                    />
                                    {this.state.usernameError != "" ?

                                        <Animatable.View animation="fadeInLeft" duration={500}>
                                            <Text style={styles.error}>{this.state.usernameError}</Text>
                                        </Animatable.View>

                                        : null}
                                </View>
                                <View style={styles.buttonInner}>
                                    <TouchableHighlight
                                        style={styles.button}
                                        underlayColor='#42A8E5'
                                    >
                                        <Text style={styles.buttonText} onPress={this.forgotPassword}>{t('resetpassword')}</Text>
                                    </TouchableHighlight>
                                </View>
                                <View style={styles.backpage}>
                                    <TouchableOpacity onPress={this.returnTologin}><Text style={styles.backpagebtnText}>{t('backmsg')}</Text></TouchableOpacity>
                                </View>
                            </View>
                        </View>

                    </View>
                </TouchableWithoutFeedback>
            </>
        );
    }
}
//Forgotpassword.contextType = AuthContext;
//export default Forgotpassword;
export default (withTranslation()(Forgotpassword));

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
        marginTop: 15,

    },
    lebel: {
        color: '#243656',
        fontFamily: 'Poppins-Regular',
        fontSize: 13,
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
        paddingTop: 30,
        paddingBottom: 40,
        //backgroundColor:'#ccc',
    },
    button: {
        width: '90%',
        height: 52,
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
        fontSize: 13,
        lineHeight: 19,
        color: '#243656',
        fontFamily: 'Poppins-Regular',
        opacity:0.5,
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
    // forgotText: {
    //     width: '100%',
    //     color: '#243656',
    //     fontSize: 13,
    //     lineHeight: 19,
    //     marginTop: 10,
    //     marginBottom: 20,
    //     textAlign: 'center',
    //     opacity: 0.5,
    //     fontFamily: 'Poppins-Regular',
    // },
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
    },
    backpagebtnText:{
        fontSize: 13,
        lineHeight: 19,
        color: '#243656',
        fontFamily: 'Poppins-Regular',
        opacity:0.5,
    }
});
