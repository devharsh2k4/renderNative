import { StatusBar } from "expo-status-bar";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { theme } from "../theme";
import { ShoppingListItem } from "../components/ShoppingListItem";
import { useState } from "react";

type ShoppingListItemType = {
  id: string;
  name: string;
  completedAtTimestamp?: number;
};

const testData = new Array(1000)
  .fill(null)
  .map((_, index) => ({ id: String(index), name: String(index) }));

export default function App() {
  const [shoppingList, setShoppingList] = useState<ShoppingListItemType[]>([]);
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (value) {
      const newshoppingList = [
        { id: new Date().toTimeString(), name: value },
        ...shoppingList,
      ];
      setShoppingList(newshoppingList);
      setValue("");
    }
  };

  const handleDelete = (id: string) => {
    const newshoppingList = shoppingList.filter((item) => item.id !== id);
    setShoppingList(newshoppingList);
  };

  const handleToggleComplete = (id: string) => {
      const newshoppingList = shoppingList.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            completedAtTimestamp: item.completedAtTimestamp
              ? undefined
              : Date.now(),
          };
        }
        return item;
      });
      setShoppingList(newshoppingList);
    };
  return (
    <FlatList
      data={shoppingList}
      contentContainerStyle={styles.contentContainer}
      stickyHeaderIndices={[0]}
      ListEmptyComponent={
        <View style={styles.listEmptyContainer}>
          <Text>Add something to see</Text>
        </View>
      }
      ListHeaderComponent={
        <TextInput
          placeholder="E.g. Coffee"
          style={styles.textInput}
          value={value}
          onChangeText={setValue}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />
      }
      renderItem={({ item }) => (
        <ShoppingListItem
          name={item.name}
          key={item.id}
          onDelete={() => handleDelete(item.id)}
          onToggleComplete={() => handleToggleComplete(item.id)}
          isCompleted={Boolean(item.completedAtTimestamp)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
  },
  contentContainer: {
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
  listEmptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 18,
  },
});
