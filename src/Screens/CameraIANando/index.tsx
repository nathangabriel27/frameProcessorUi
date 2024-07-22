import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Platform, Pressable, StyleSheet, Text } from 'react-native';
import styles from './styles';
import { Title } from '../../components/Title';
import { colors } from '../../utils/theme';
import { Camera, Templates, useCameraDevice, useCameraFormat, useFrameProcessor } from 'react-native-vision-camera';
import { useAppNavigation } from '../../hooks/navigation';
import { useTensorflowModel } from 'react-native-fast-tflite'
import { useIsFocused } from '@react-navigation/native';
import { useResizePlugin } from 'vision-camera-resize-plugin';
import { Worklets } from 'react-native-worklets-core';

import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

type DataJSProps = {
  top: number;
  left: number;
  bottom: number;
  right: number;
  classBox: number;
}

export default function CameraIANando() {
  const isFocused = useIsFocused();
  const navigate = useAppNavigation()
  const device = useCameraDevice('back')
  const format = useCameraFormat(device, Templates.FrameProcessing)
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  // Edit this model 
  const model = useTensorflowModel(require('../../assets/Models/tflite/cnh2.tflite'))//model path CNH

  const actualModel = model.state === 'loaded' ? model.model : undefined
  const { resize } = useResizePlugin()

  useEffect(() => {
    if (actualModel == null) return
    console.log(`\nModel loaded! Shape:`, actualModel)
  }, [actualModel])

  const documentClasses: { [key: number]: string } = {
    0: "3X4",
    1: "CNH_FRENTE_ANTIGA",
    2: "CNH_VERSO_ANTIGA",
    3: "CNH_COMPLETA_ANTIGA",
    4: "CNH_FRENTE_NOVA",
    5: "CNH_VERSO_NOVA",
    6: "CNH_COMPLETA_NOVA",
  };

  const RETURN_BOX_CONFIDENCE_VALUE = 0.60;
  const DOCUMENT_DETECTED_CONFIDENCE_VALUE = 0.7;

  const xCoords = useSharedValue<number>(0)
  const yCoords = useSharedValue<number>(0)
  const widths = useSharedValue<number>(0)
  const heights = useSharedValue<number>(0)
  const classBox = useSharedValue<number>(0)

  const valueTop = useSharedValue<number>(0);
  const valueBottom = useSharedValue<number>(0);
  const valueLeft = useSharedValue<number>(0);
  const valueRight = useSharedValue<number>(0);

  const runJsBoxDelimiter = Worklets.createRunOnJS((data: DataJSProps) => {
    if (data === undefined) return;
    const padding = Platform.OS === 'ios' ? -20 : +20; // Adjuste value padding 

    classBox.value = data.classBox;

    valueTop.value = withSpring(data.top);
    valueBottom.value = withSpring(data.bottom);
    valueRight.value = withSpring(data.right);
    valueLeft.value = withSpring(data.left);

    xCoords.value = withSpring(data.bottom);
    yCoords.value = withSpring(data.left);
    widths.value = withSpring(200);
    heights.value = withSpring(200);
  })

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    if (model == null) return
    if (actualModel == null || undefined) return
    //console.log(`\n\nFrame is ${frame} \n\n`)

    // Adjust
    const resized = resize(frame, {
      scale: { width: 320, height: 320 },
      pixelFormat: 'rgb',
      dataType: 'float32',
    })
    const frameWidth = frame.width;
    const frameHeight = frame.height;

    const outputs = actualModel.runSync([resized])

    const detected_scores = outputs[0]
    const detected_locations = outputs[1]
    const number_detectetions = Number(outputs[2])
    const detected_classes = outputs[3]

    //console.log(`Result detected_scores(${detected_scores.length}) ==>\n`, `${detected_scores}`);
    console.log(`Result detected_locations(${detected_locations.length}) ==>\n`, `${detected_locations}`);
    //console.log(`Result number_detectetions(${number_detectetions}) ==>`, `${number_detectetions}`);
    //console.log(`Result detected_classes(${detected_classes}) ==>`, `${detected_classes}\n\n`);


    // Conversion 
    function convertFromBox(): any | undefined {
      const results = [];

      for (let i = 0; i < number_detectetions; i++) {
        const score = Number(detected_scores[i]); // Score passando a posicao do item.
        if (score > DOCUMENT_DETECTED_CONFIDENCE_VALUE) {// Valida se o score e suficiente para continuar.
          const detectedClass = Number(detected_classes[i]);
         
          const detectedLocation = detected_locations.slice(i * 4, (i * 4) + 4);
          const [ymin, xmin, ymax, xmax] = detectedLocation;

          const top = Number(xmin) * screenHeight
          const bottom = screenHeight - (Number(xmax) * screenHeight)
          const left = screenWidth - (Number(ymax) * screenWidth)
          const right = Number(ymin) * screenWidth

          results.push({
            class: documentClasses[detectedClass],
            score: (score * 100).toFixed(2),
            location: { top, left, bottom, right },
          });
        }
      }
    //  console.log(results);

      //console.log(`Classe: ${results[0].class}\n${(results[0]?.score * 100).toFixed(2)}% =>`, results[0]?.location?.top);
      if (results.length === 0) return
      return results[0].location
    }


    const data = convertFromBox()
    runJsBoxDelimiter(data)
  }, [actualModel]);

  const boxOverlayStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    borderWidth: 3,
    borderRadius: 8,
    borderColor: 'red',
    top: valueTop.value,
    bottom: valueBottom.value,
    left: valueLeft.value,
    right: valueRight.value,
    zIndex: 100,
  }), [actualModel]);

  if (device == null) return <ActivityIndicator />
  return (
    <>
      <Camera
        style={[StyleSheet.absoluteFill,
          //{ width: 720, height: 1280}
        ]}
        device={device}
        isActive={isFocused}
        format={format}
        frameProcessor={frameProcessor}
        fps={30}
      />
      <Animated.View style={boxOverlayStyle} >
        <Text>{`${documentClasses[classBox.value]}`}</Text>
      </Animated.View>
      {/*  <BoxDelimiter
        x={xCoords}
        y={yCoords}
        width={widths}
        height={heights}
      /> */}
    </>
  )

}