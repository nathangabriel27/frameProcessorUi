import * as React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, Dimensions, Pressable, View, Modal, Text, Image } from 'react-native';
import { Camera, useCameraDevice, useFrameProcessor, type Orientation } from 'react-native-vision-camera';
import { Worklets, useSharedValue } from 'react-native-worklets-core';
import { type CropRegion, crop, rotateImage } from 'vision-camera-cropper';
import { Title } from '../../components/Title';

export default function App() {
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [hasPermission, setHasPermission] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [imageData, setImageData] = useState<undefined | string>(undefined);
  const setImageDataJS = Worklets.createRunOnJS(setImageData);
  const [frameWidth, setFrameWidth] = useState(1080);
  const [frameHeight, setFrameHeight] = useState(1920);
  const [cropRegion, setCropRegion] = useState({
    left: 0,
    top: 0,
    width: 100,
    height: 100
  });
  const cropRegionShared = useSharedValue<undefined | CropRegion>(undefined);
  const frameWidthShared = useSharedValue(1080);
  const frameHeightShared = useSharedValue(1920);
  const taken = useSharedValue(false);
  const shouldTake = useSharedValue(false);
  const [isFront, setIsFront] = React.useState(false);
  const back = useCameraDevice("back");
  const front = useCameraDevice("front");

  const updateFrameSize = (width: number, height: number) => {
    if (width != frameWidthShared.value && height != frameHeightShared.value) {
      frameWidthShared.value = width;
      frameHeightShared.value = height;
      setFrameWidth(width);
      setFrameHeight(height);
      if (orientation == "portrait") {
        updateCropRegion({ width: height, height: width });
      } else {
        updateCropRegion({ width: width, height: height });
      }
    }
  }

  const updateCropRegion = (size?: { width: number, height: number }) => {
    if (!size) {
      size = getFrameSize();
    }
    let region;
    if (size.width > size.height) {
      let regionWidth = 0.7 * size.width;
      let desiredRegionHeight = regionWidth / (85.6 / 54);
      let height = Math.ceil(desiredRegionHeight / size.height * 100);
      region = {
        left: 15,
        width: 70,
        top: 10,
        height: height
      };
    } else {
      let regionWidth = 0.8 * size.width;
      let desiredRegionHeight = regionWidth / (85.6 / 54);
      let height = Math.ceil(desiredRegionHeight / size.height * 100);
      region = {
        left: 10,
        width: 80,
        top: 20,
        height: height
      };
    }
    setCropRegion(region);
    cropRegionShared.value = region;
    console.log(region)
  }

  const updateFrameSizeJS = Worklets.createRunOnJS(updateFrameSize);
  const frameProcessor = useFrameProcessor((frame) => {
    'worklet'
    //console.log(frame.width+"x"+frame.height);
    updateFrameSizeJS(frame.width, frame.height);
    if (taken.value == false && shouldTake.value == true && cropRegionShared.value != undefined) {
      console.log(cropRegionShared.value);
      const result = crop(frame, { cropRegion: cropRegionShared.value, includeImageBase64: true });
      console.log(result);
      if (result.base64) {
        setImageDataJS("data:image/jpeg;base64," + result.base64);
        taken.value = true;
      }
      shouldTake.value = false;
    }
  }, [])

  useEffect(() => {
    (async () => {
      console.log("mounted");
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
      setIsActive(true);
      updateCropRegion();
    })();
  }, []);

  useEffect(() => {
    updateCropRegion();
  }, [frameWidth, frameHeight]);


  const getFrameSize = (): { width: number, height: number } => {
    let width: number, height: number;
    if (orientation == 'portrait') {
      width = frameHeight;
      height = frameWidth;
    } else {
      width = frameWidth;
      height = frameHeight;
    }
    return { width: width, height: height };
  }

  const renderImage = () => {
    if (imageData != undefined) {
      return (
        <Image style={styles.srcImage}
          source={{ uri: imageData }}
        />
      );
    }
    return null;
  }

  const rotateTakenImage = async () => {
    console.log("rotate")
    if (imageData) {
      console.log("hasimage")
      let rotated = await rotateImage(removeDataURLHead(imageData), 90);
      setImageData("data:image/jpeg;base64," + rotated);
    }
  }

  const removeDataURLHead = (dataURL: string) => {
    return dataURL.substring(dataURL.indexOf(",") + 1, dataURL.length);
  }

  return (
    <SafeAreaView style={styles.container}>
      {back != null && front != null &&
        hasPermission && (
          <>
            <Camera
              style={StyleSheet.absoluteFill}
              isActive={isActive}
              device={isFront ? front : back}
              //  format={isFront ? frontFormat : backFormat}
              frameProcessor={frameProcessor}
              resizeMode='contain'
            />

            <View style={styles.control}>
              <View style={styles.shutter}>

                <Pressable
                  style={styles.camera}
                  onPressIn={() => {
                    console.log("on press in ")
                  }}
                  onPressOut={() => {
                    shouldTake.value = true;
                  }}
                >
                  <Title text='TIRAR FOTO' />
                </Pressable>
              </View>
            </View>

            <Modal
              animationType="slide"
              transparent={true}
              visible={(imageData != undefined)}
              supportedOrientations={['portrait', 'landscape']}
              onRequestClose={() => {
                setImageData(undefined);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  {renderImage()}
                  <View style={styles.buttonView}>
                    <Pressable
                      style={[styles.button, styles.buttonInModal]}
                      onPress={() => {
                        setImageData(undefined);
                        taken.value = false;
                      }}
                    >
                      <Text style={styles.textStyle}>Rescan</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.button, styles.buttonInModal]}
                      onPress={() => {
                        rotateTakenImage();
                      }}
                    >
                      <Text style={styles.textStyle}>Rotate</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Modal>
          </>)}
    </SafeAreaView>
  );
}

const getWindowWidth = () => {
  return Dimensions.get("window").width;
}

const getWindowHeight = () => {
  return Dimensions.get("window").height;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutter: {
    width: getWindowHeight() * 0.1,
    height: getWindowHeight() * 0.1,
  },
  camera: {
    position: 'absolute',
    backgroundColor: '#faa',
    margin: 10,
    left: 10,
    bottom: getWindowHeight() * 0.01,
    height: getWindowHeight() * 0.08,
    width: getWindowHeight() * 0.08,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  control: {
    flexDirection: "row",
    position: 'absolute',
    bottom: 0,
    height: getWindowHeight() * 0.1,
    width: "100%",
    alignSelf: "flex-start",
    borderColor: "white",
    borderWidth: 0.1,
    backgroundColor: "rgba(171, 158, 158, 0.7)",
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttonView: {
    flexDirection: 'row',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    margin: 5
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonInModal: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  srcImage: {
    width: getWindowWidth() * 0.7,
    height: 100,
    resizeMode: "contain"
  },
});