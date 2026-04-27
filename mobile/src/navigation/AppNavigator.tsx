import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import InputScreen       from "../screens/InputScreen";
import MealPlanScreen    from "../screens/MealPlanScreen";
import ShoppingListScreen from "../screens/ShoppingListScreen";

export type RootStackParamList = {
  Input:        undefined;
  MealPlan:     undefined;
  ShoppingList: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Input"
        screenOptions={{
          headerStyle:      { backgroundColor: "#4CAF50" },
          headerTintColor:  "#fff",
          headerTitleStyle: { fontWeight: "800" },
          headerBackTitle:  "Back"
        }}
      >
        <Stack.Screen
          name="Input"
          component={InputScreen}
          options={{ title: "Meal Planner", headerShown: false }}
        />
        <Stack.Screen
          name="MealPlan"
          component={MealPlanScreen}
          options={{ title: "My Week", headerShown: false }}
        />
        <Stack.Screen
          name="ShoppingList"
          component={ShoppingListScreen}
          options={{ title: "Shopping List", headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
