import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Detail = ({ route }) => {
  const { flower } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      const favorites =
        JSON.parse(await AsyncStorage.getItem("favorites")) || [];
      setIsFavorite(favorites.includes(flower.name));
    };

    checkFavorite();
  }, [flower.name]);

  const toggleFavorite = async () => {
    const favorites = JSON.parse(await AsyncStorage.getItem("favorites")) || [];
    let updatedFavorites = [];
    if (favorites.includes(flower.name)) {
      updatedFavorites = favorites.filter((fav) => fav !== flower.name);
    } else {
      updatedFavorites = [...favorites, flower.name];
    }
    setIsFavorite(!isFavorite);
    await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: flower.image }} style={styles.image} />
      <Text style={styles.name}>{flower.name}</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.info}>Weight: {flower.weight}g</Text>
        <Text style={styles.info}>Rating: {flower.rating}</Text>
        <Text style={styles.info}>Price: ${flower.price}</Text>
        <Text style={styles.info}>
          Top of the week: {flower.isTopOfTheWeek ? "Yes" : "No"}
        </Text>
        <Text style={styles.info}>Color: {flower.color}</Text>
        <Text style={styles.info}>Bonus: {flower.bonus}</Text>
        <Text style={styles.info}>Origin: {flower.origin}</Text>
      </View>
      <TouchableOpacity
        onPress={toggleFavorite}
        style={styles.favoriteButtonContainer}
      >
        <Text style={styles.favoriteButton}>
          {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
export default Detail;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 280,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  infoContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    marginBottom: 20,
  },
  info: {
    fontSize: 18,
    marginBottom: 10,
    color: "#666",
  },
  favoriteButtonContainer: {
    backgroundColor: "#3498DB",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    width: "100%",
  },
  favoriteButton: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
