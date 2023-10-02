import React, { Component } from 'react';
import * as Animatable from 'react-native-animatable';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput
} from 'react-native';
 import { useTranslation, withTranslation } from 'react-i18next';






class ChangePasswordModalContent extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }

    }

    render() {
        const { formData } = this.state;
        let className = [styles.button];
        let loading = this.state.loading;
        const { t } = this.props;
        return (
            <>

                <View style={styles.changePassModalContent}>
                    <View style={styles.inputInner}>
                        <TextInput style={[styles.input, this.state.passwordStyle]}
                            underlineColorAndroid="transparent"
                            placeholder={t('updatepassword')}
                            placeholderTextColor="#999"
                            autoCapitalize="none"
                            textAlign='center'
                            secureTextEntry={true}
                            // onFocus={this.onFocusInputField.bind(this, "password")}
                            returnKeyLabel='Done'
                            returnKeyType='done'
                            onChangeText={(val) => this.props.handleUpdatedPasswordChange(val)}
                        />
                         {this.props.updated_passwordError != "" ?
                                    <Animatable.View animation="fadeInLeft" duration={500}>
                                        <Text style={styles.error}>{this.props.updated_passwordError}</Text>
                                    </Animatable.View>
                                    : null}
                    </View>
                    <View style={styles.inputInner}>
                        <TextInput style={[styles.input, this.state.passwordStyle]}
                            underlineColorAndroid="transparent"
                            placeholder={t('confirmupdatepassword')}
                            placeholderTextColor="#999"
                            autoCapitalize="none"
                            secureTextEntry={true}
                            //onFocus={this.onFocusInputField.bind(this, "password")}
                            returnKeyLabel='Done'
                            returnKeyType='done'
                            textAlign='center'
                            onChangeText={(val) => this.props.handleConfirmPasswordChange(val)}
                        />
                         {this.props.updated_confirm_passwordError != "" ?
                                    <Animatable.View animation="fadeInLeft" duration={500}>
                                        <Text style={styles.error}>{this.props.updated_confirm_passwordError}</Text>
                                    </Animatable.View>
                                    : null}
                    </View>
                    <View style={styles.buttonInner}>
                        <TouchableOpacity
                            style={[className, styles.elevation]}
                            underlayColor='#42A8E5'
                            onPress={this.props.updatedPassword}
                        >
                            <Text style={styles.buttonText}>{t('submit')}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.instruction}>
                        <Text style={styles.instructiontxt}> {t('instructionmsg')}</Text>
                    </View>
                </View>



            </>
        );
    }
}

//export default ChangePasswordModalContent;
export default (withTranslation()(ChangePasswordModalContent));

const styles = StyleSheet.create({

    changePassModalContent: {
        width: '100%',
       // backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        padding: 25,
        paddingTop:0,
        //height: 300,
        borderRadius:15,
        flexWrap:'wrap',
        flexDirection:'column',
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
        height: 45,

    },
    buttonInner: {
        marginTop:15,
        height:45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        width: '100%',
        position: 'relative',
        flexWrap: 'wrap',

    },
    button: {
        width: '100%',
        height: 45,
        backgroundColor: '#42A8E5',
        borderRadius: 50,
        textAlign: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

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
    instructiontxt:{
        color:'red',
        fontFamily: 'Poppins-Regular',
        margin: 0,
        padding: 0,
        fontSize:8,
        textAlign:'center',
        lineHeight:10,
    }



});
