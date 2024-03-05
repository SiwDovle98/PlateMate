import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Image,
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import styles from "./styles/camera.js";

const HomeScreen = ({ navigation }) => {
  let cameraRef = useRef();
  const [hasCameraPermission, sethasCameraPermission] = useState();
  const [hasMediaLibraryPermission, sethasMediaLibraryPermission] = useState();
  const [selectedImage, setSelectedImage] = useState(null);
  const [launchCamera, setLaunchCamera] = useState(false);
  const [photo, setPhoto] = useState();
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();
      sethasCameraPermission((cameraPermission.status = "granted"));
      sethasMediaLibraryPermission((mediaLibraryPermission.status = "granted"));
    })();
  }, []);

  if (hasCameraPermission === undefined) {
    return <Text>Requesting permission...</Text>;
  } else if (!hasCameraPermission) {
    return (
      <Text>
        Persmission for camera not granted. Please change this in settings
      </Text>
    );
  }

  handleCameraLaunch = () => {
    if (launchCamera) {
      setLaunchCamera(false);
    } else {
      setLaunchCamera(true);
    }
  };

  let takePhoto = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
  };

  if (photo) {
    let sharePhoto = () => {
      shareAsync(photo.uri).then(() => setPhoto(undefined));
    };

    let savePhoto = () => {
      MediaLibrary.saveToLibraryAsync(photo.uri).then(() =>
        setPhoto(undefined)
      );
    };

    return (
      <SafeAreaView style={styles.container}>
        <Image
          style={styles.preview}
          source={{ uri: "data:image/jpg;base64," + photo.base64 }}
        />
        <Button title="Share" onPress={sharePhoto} />
        {hasMediaLibraryPermission ? (
          <Button title="Save" onPress={savePhoto} />
        ) : undefined}
        <Button title="Discard" onPress={() => setPhoto(undefined)} />
      </SafeAreaView>
    );
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return !launchCamera ? (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>PlateMate</Text>
      {selectedImage && (
        <Image
          source={{ uri: selectedImage }}
          style={{ flex: 1 }}
          resizeMode="contain"
        />
      )}

      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button title="Pick an image from camera roll" onPress={pickImage} />
        {image && (
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
        )}
      </View>
      <View style={{ marginTop: 20, marginBottom: 50 }}>
        <Button title="Open Camera" onPress={handleCameraLaunch} />
      </View>
    </View>
  ) : (
    <View style={styles.container}>
      <Camera style={styles.preview} ref={cameraRef}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleCameraLaunch}
        >
          <Icon name="close" size={30} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
          <View style={styles.captureInnerButton} />
        </TouchableOpacity>

        <StatusBar style="auto" />
      </Camera>
    </View>
  );
};

export default HomeScreen;
