import { StatusBar } from "expo-status-bar";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../theme";
import { ShoppingListItem } from "../components/ShoppingListItem";


export default function App() {

 
  return (
    <View style={styles.container}>
      
     <ShoppingListItem name="tea" isCompleted={true}/>
     <ShoppingListItem name="coffee"/>
     <ShoppingListItem name="buiscuit"/>
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },



});
