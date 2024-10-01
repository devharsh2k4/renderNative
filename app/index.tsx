import { StatusBar } from "expo-status-bar";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { theme } from "../theme";
import { ShoppingListItem } from "../components/ShoppingListItem";
import { useState } from "react";

type ShoppingListItemType ={
  id:string,
  name:string
}

const initialList: ShoppingListItemType[] = [
  {id: "1", name: "tea"},
  {id: "2", name: "coffee"},
  {id: "3", name: "biscuit"},
]

export default function App() {
  const [shoppingList,setShoppingList] = useState<ShoppingListItemType[]>(initialList)
  const [value, setValue] = useState("");

  const handleSubmit = () =>{
    if(value){
     const newshoppingList = [
      {id: new Date().toTimeString(),name:value},
      ...shoppingList,
     ];
     setShoppingList(newshoppingList)
     setValue("")
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} stickyHeaderIndices={[0]}>
      <TextInput
        placeholder="E.g. Coffee"
        style={styles.textInput}
        value={value}
        onChangeText={setValue}
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
      />

     {shoppingList.map(item =>(
      <ShoppingListItem  name={item.name} key={item.id}/>
     ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding:12,
  },
  contentContainer:{
    paddingBottom: 24,
  },

  textInput: {
    borderColor: theme.colorLightGrey,
    borderWidth: 2,
    padding: 12,
    marginHorizontal: 12,
    marginBottom: 12,
    fontSize: 18,
    borderRadius: 50,
    backgroundColor: theme.colorWhite,
  },
});
