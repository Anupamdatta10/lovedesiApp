import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from '../Modules/Login/Pages/SignInScreen';
import Forgotpassword from '../Modules/Login/Pages/Forgotpassword.js';
import Reenterpassword from '../Modules/Login/Pages/Reenterpassword.js';
const DefaultLayout = createStackNavigator();
const DefaultLayoutScreen = ({ navigation }) => (
    <DefaultLayout.Navigator>       
        <DefaultLayout.Screen
            name="SignInScreen"
            component={SignInScreen} 
            options={{
               headerShown:false
            }}
        />    
        <DefaultLayout.Screen
            name="Forgotpassword"
            component={Forgotpassword}
            options={{
                headerShown: false
            }}
        />   
        <DefaultLayout.Screen
            name="Reenterpassword"
            component={Reenterpassword}
            options={{
                headerShown: false
            }}
        />  

    </DefaultLayout.Navigator>
);

export default DefaultLayoutScreen;