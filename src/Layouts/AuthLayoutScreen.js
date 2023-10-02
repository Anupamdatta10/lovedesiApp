import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../Modules/Home/Pages/Home';
const AuthLayout = createStackNavigator();

const AuthLayoutScreen = ({ navigation }) => (

    <AuthLayout.Navigator>
        <AuthLayout.Screen
            name="Home"
            component={Home}
            options={{
                headerShown: false
            }}
        />        
        
    </AuthLayout.Navigator>
);

export default AuthLayoutScreen;