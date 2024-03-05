import React, { useState, useRef } from "react";
import {
  TouchableOpacity,
  Button,
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";

const { width } = Dimensions.get("window");
const SPACING = 10;
const THUMB_SIZE = 80;

const IMAGES = {
  image1: require("./assets/taco.jpeg"),
  image2: require("./assets/pokebowl.jpeg"),
  image3: require("./assets/curry.jpeg"),
};

const GalleryScreen = ({ navigation }) => {
  const [images, setImages] = useState([
    { id: "1", image: IMAGES.image1 },
    { id: "2", image: IMAGES.image2 },
    { id: "3", image: IMAGES.image3 },
  ]);
  return (
    <View style={{ flex: 1, backgroundColor: "black", alignItems: "center" }}>
      <Text
        style={{
          color: "white",
          fontSize: 32,
          marginTop: 50,
          marginBottom: 25,
        }}
      >
        Custom Gallery
      </Text>
      <View style={{ flex: 1 / 2, marginTop: 20 }}>
        <Carousel
          layout="default"
          data={images}
          sliderWidth={width}
          itemWidth={width}
          renderItem={({ item, index }) => (
            <Image
              key={index}
              style={{ width: "100%", height: "100%" }}
              resizeMode="contain"
              source={item.image}
            />
          )}
        />
      </View>
    </View>
  );
};

export default GalleryScreen;
