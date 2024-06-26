import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import fetchApi from "../utils/mockapi";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Favorite = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const loadFavorites = async () => {
      const favs = await AsyncStorage.getItem("favorites");
      setFavorites(favs ? JSON.parse(favs) : []);
    };

    const getData = async () => {
      try {
        const result = await fetchApi.get("/category");
        setData(result.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const focusListener = navigation.addListener("focus", () => {
      loadFavorites();
      getData();
    });

    loadFavorites();
    getData();

    return () => {
      navigation.removeListener("focus", focusListener);
    };
  }, [navigation]);

  const confirmRemoveFavorite = (name) => {
    Alert.alert(
      "Remove Favorite",
      "Are you sure you want to remove this flower from your favorites?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          onPress: () => removeFavorite(name),
        },
      ]
    );
  };

  const removeFavorite = async (name) => {
    const updatedFavorites = favorites.filter((fav) => fav !== name);
    setFavorites(updatedFavorites);
    await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const confirmRemoveAllFavorites = () => {
    Alert.alert(
      "Remove All Favorites",
      "Are you sure you want to remove all favorite flowers?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove All",
          onPress: () => removeAllFavorites(),
        },
      ]
    );
  };

  const removeAllFavorites = async () => {
    setFavorites([]);
    await AsyncStorage.setItem("favorites", JSON.stringify([]));
  };

  const favoriteOrchids = data.flatMap((category) =>
    category.items.filter((item) => favorites.includes(item.name))
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (favoriteOrchids.length === 0) {
    return (
      <View style={styles.noFavoritesContainer}>
        <Text style={styles.noFavoritesText}>No favorite items selected.</Text>
      </View>
    );
  }

  const renderOrchid = ({ item }) => (
    <View style={styles.orchidItem}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Detail", { flower: item })}
        style={styles.orchidInfo}
      >
        <Image source={{ uri: item.image }} style={styles.image} />
        <Text style={styles.orchidName}>{item.name}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => confirmRemoveFavorite(item.name)}>
        <Text style={styles.favoriteIcon}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.removeAllButton}
        onPress={confirmRemoveAllFavorites}
      >
        <Text style={styles.removeAllText}>Remove All</Text>
      </TouchableOpacity>
      <FlatList
        data={favoriteOrchids}
        keyExtractor={(item) => item.name}
        renderItem={renderOrchid}
      />
    </View>
  );
};

export default Favorite;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  orchidItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  orchidInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 10,
  },
  orchidName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  favoriteIcon: {
    fontSize: 16,
    color: "#ffffff",
    backgroundColor: "#3498DB",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
    overflow: "hidden",
  },
  noFavoritesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noFavoritesText: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
  },
  removeAllButton: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#3498DB",
    borderRadius: 5,
    alignItems: "center",
  },
  removeAllText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
