import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons'; 

import HomeScreen from '../screens/HomeScreen';
import ReportScreen from '../screens/ReportScreen';
import ReportsListScreen from '../screens/ReportsListScreen';
import MapScreen from '../screens/MapScreen'; 
import ReportDetailScreen from '../screens/ReportDetailScreen';

export type RootTabParamList = {
  Home: undefined;
  Report: undefined;
  List: undefined;
  Map: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const RootStack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'alert';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Report') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'List') {
            iconName = focused ? 'list' : 'list-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false, 
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'الرئيسية' }} />
      <Tab.Screen name="Report" component={ReportScreen} options={{ title: 'إبلاغ' }} />
      <Tab.Screen name="List" component={ReportsListScreen} options={{ title: 'البلاغات' }} />
      <Tab.Screen name="Map" component={MapScreen} options={{ title: 'الخريطة' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="ReportDetail"
          component={ReportDetailScreen}
          options={{ title: 'تفاصيل البلاغ' }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}