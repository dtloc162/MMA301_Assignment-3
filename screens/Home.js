import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import fetchApi from "../utils/mockapi";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

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

    const unsubscribe = navigation.addListener("focus", () => {
      loadFavorites();
      getData();
    });

    loadFavorites();
    getData();

    return unsubscribe;
  }, [navigation]);

  const toggleFavorite = async (flower) => {
    let updatedFavorites;
    if (favorites.includes(flower.name)) {
      updatedFavorites = favorites.filter((fav) => fav !== flower.name);
    } else {
      updatedFavorites = [...favorites, flower.name];
    }
    setFavorites(updatedFavorites);
    await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const result = await fetchApi.get("/category");
      setData(result.data);
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.categoryName}>{item.name}</Text>
      {item.items.map((flower) => (
        <TouchableOpacity
          key={flower.name}
          style={styles.flowerContainer}
          onPress={() => navigation.navigate("Detail", { flower })}
        >
          <Image source={{ uri: flower.image }} style={styles.flowerImage} />
          <View style={styles.flowerDetails}>
            <Text style={styles.flowerName}>{flower.name}</Text>
            <TouchableOpacity onPress={() => toggleFavorite(flower)}>
              {favorites.includes(flower.name) ? (
                <Icon name="heart" size={30} color="red" />
              ) : (
                <Icon name="heart-outline" size={30} color="red" />
              )}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  itemContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  categoryName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 15,
  },
  flowerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  flowerImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  flowerDetails: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  flowerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  icon: {
    marginLeft: 10,
  },
});
