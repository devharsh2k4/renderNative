import { Alert, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from '@expo/vector-icons/Entypo';


type Props = {
  name: string;
  isCompleted?: boolean;
  onDelete: () => void;
  onToggleComplete: () => void;
};

export function ShoppingListItem({ name, isCompleted ,onDelete,onToggleComplete}: Props) {
  const handleDelete = () => {
    Alert.alert(
      `Are you sure you want to delete ${name}`,
      " It will be deleted forever",
      [
        {
          text: "yes",
          onPress: () => onDelete(),
          style: "destructive",
        },
        {
          text: "no",
          onPress: () => console.log("cancel"),
          style: "cancel",
        },
      ]
    );
  };
  return (
    <Pressable onPress={onToggleComplete}
      style={[
        styles.itemContainer,
        isCompleted ? styles.completedContainer : undefined,
      ]}
    >
     <View style = {styles.row}>
     <Entypo name={isCompleted ? "check" : "circle"} size={24} color={isCompleted ? theme.colorGrey : theme.colorCerulean} />
      <Text
        style={[styles.itemText, isCompleted ? styles.itemText : undefined]}
      >
        {name}
      </Text>
     </View>
      <TouchableOpacity onPress={handleDelete}>
        <AntDesign name="closecircle" size={24} color={isCompleted ? theme.colorGrey : theme.colorRed} />
      </TouchableOpacity>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colorCerulean,
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  completedContainer: {
    backgroundColor: theme.colorLightGrey,
    borderBottomColor: theme.colorLightGrey,
  },
  completedText: {
    textDecorationLine: "line-through",
    textDecorationColor: theme.colorGrey,
    color: theme.colorGrey,
  },
  itemText: {
    fontSize: 18,
    fontWeight: "200",
    flex: 1,
  },
  row: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    flex: 1,
  },
});
