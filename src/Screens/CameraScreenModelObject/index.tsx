import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import styles from './styles';
import { Title } from '../../components/Title';
import { colors } from '../../utils/theme';
import { Camera, Templates, useCameraDevice, useCameraFormat, useFrameProcessor } from 'react-native-vision-camera';
import { useAppNavigation } from '../../hooks/navigation';
import { checkPermissionCam } from '../../functions/permissions';
import { useTensorflowModel } from 'react-native-fast-tflite'
import { useIsFocused } from '@react-navigation/native';
import { useResizePlugin } from 'vision-camera-resize-plugin';
import { Worklets } from 'react-native-worklets-core';
import { Skia } from "@shopify/react-native-skia"
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { BoxDelimiter } from './components/BoxDelimiter';

type DataJSProps = {
  top: number
  left: number
  bottom: number
  right: number
}

export default function CameraScreenModelObject() {
  const isFocused = useIsFocused();
  const navigate = useAppNavigation()
  const device = useCameraDevice('back')
  const format = useCameraFormat(device, Templates.FrameProcessing)
  //const modelEfficident = useTensorflowModel(require('../../assets/Models/tflite/efficientdet.tflite'))//model path
  const model = useTensorflowModel(require('../../assets/Models/tflite/mobile_object_localizer.tflite'))//model path Objetos Teste

  const actualModel = model.state === 'loaded' ? model.model : undefined
  const { resize } = useResizePlugin()

  useEffect(() => {
    if (actualModel == null) return
    console.log(`\nModel loaded! Shape:`, actualModel)
  }, [actualModel])

  const xCoords = useSharedValue<number>(100)
  const yCoords = useSharedValue<number>(300)
  const widths = useSharedValue<number>(200)
  const heights = useSharedValue<number>(200)

  const valueTop = useSharedValue<number>(0);
  const valueBottom = useSharedValue<number>(0);
  const valueLeft = useSharedValue<number>(0);
  const valueRight = useSharedValue<number>(0);

  // Largura e altura do Canvas
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  const runJsUpdateView = Worklets.createRunOnJS((data: DataJSProps) => {
    // Animated View
    valueTop.value = withSpring(data.top);
    valueBottom.value = withSpring(data.bottom);
    valueRight.value = withSpring(data.right);
    valueLeft.value = withSpring(data.left);

    //Skia
    xCoords.value = withSpring(data.bottom)
    yCoords.value = withSpring(700)
    widths.value = withSpring(150)
    heights.value = withSpring(150)
  })


  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    if (model == null) return
    if (actualModel == null || undefined) return

    const frameWidth = frame.width;
    const frameHeight = frame.height;

    const resized = resize(frame, {
      scale: { width: 192, height: 192 },
      pixelFormat: 'rgb',
      dataType: 'uint8',
    })

    // 2. Run model with given input buffer synchronously
    const outputs = actualModel?.runSync([resized])
    const detected_boxes = outputs[0]
    const detected_classes = outputs[1]
    const num_detections = outputs[2]
    const detected_scores = outputs[3]

    //console.log('Resultado detected_boxes ==>', `${detected_boxes}`);
    console.log('Resultado detected_classes ==>', `${detected_classes}`);
    //console.log('Resultado detected_scores ==>', `${detected_scores}`);
    //console.log('Resultado num_detections ==>', `${num_detections}`);


    // Conversion model
    function convertFloat32ArrayToStringArray(): any | undefined {
      const boxArr: number[] = new Array(4);
      for (let i = 0; i < detected_scores.length; i++) {
        const confidence = detected_scores[i]
        if (confidence > 0.4) {
          for (let j = 0; j < 4; j++) {
            boxArr[j] = Number(detected_boxes[j]);
          }
          const top = boxArr[3]
          const left = boxArr[0]
          const bottom = boxArr[1]
          const right = boxArr[2]
          /*  
           */
          /*           const top = 192 - (Number(boxArr[3]) * 192)
                    const left = (Number(boxArr[0]) * 192) + 10
                    const bottom = Number(boxArr[1]) * 192
                    const right = 192 - (Number(boxArr[2]) * 192) + 10 */
          //const rect = Skia.XYWHRect(left, top, right - left, bottom - top)


          const result = { bottom: bottom, left: left, right: right, top: top }
          //  / console.log('Result:', result);

          return result;
        }
      }
    }
    const data = convertFloat32ArrayToStringArray()
    runJsUpdateView(data)
  }, [actualModel]);


  const boxOverlayStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    borderWidth: 5,
    borderColor: 'red',
    top: valueTop.value,
    bottom: valueBottom.value,
    left: valueLeft.value,
    right: valueRight.value,
    zIndex: 100,
    borderRadius: 8,
  }), [actualModel]);

  if (device == null) return <ActivityIndicator />
  return (
    <View style={styles.container}>
      <Camera
        style={[styles.container, StyleSheet.absoluteFill]}
        device={device}
        isActive={isFocused}
        frameProcessor={frameProcessor}
      // format={format}
      />
      <Animated.View style={boxOverlayStyle} />
      <BoxDelimiter
        x={xCoords}
        y={yCoords}
        width={widths}
        height={heights}
      />
    </View>
  )

}