import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import styles from './styles';
import { Title } from '../../components/Title';
import { colors } from '../../utils/theme';
import { Camera, useCameraDevice, useFrameProcessor } from 'react-native-vision-camera';
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

export default function CameraScreen() {
  const isFocused = useIsFocused();
  const navigate = useAppNavigation()
  const device = useCameraDevice('back')

  //const modelEfficident = useTensorflowModel(require('../../assets/Models/tflite/efficientdet.tflite'))//model path
  //const model = useTensorflowModel(require('../../assets/Models/tflite/cnhModel.tflite'))//model path CNH
  //const model = useTensorflowModel(require('../../assets/Models/tflite/cnhNewModel.tflite'))//model path CNH
  const model = useTensorflowModel(require('../../assets/Models/tflite/cnh2.tflite'))//model path CNH
  //  const model =  useTensorflowModel(require('../../assets/Models/tflite/cnhModelCoreML.mlmodel'), 'core-ml')  //model path CNH

  //const model = useTensorflowModel(require('../../assets/Models/tflite/mobile_object_localizer.tflite'))//model path Objetos Teste

  const actualModel = model.state === 'loaded' ? model.model : undefined
  const { resize } = useResizePlugin()

  useEffect(() => {
    if (actualModel == null) return
    console.log(`\nModel loaded! Shape:`, actualModel)
  }, [actualModel])

  const documentClasses: { [key: number]: string } = {
    0: "CNH - FRENTE",
    1: "CNH - VERSO",
    2: "RG - FRENTE",
    3: "RG - VERSO",
    4: "RG NOVO - FRENTE",
    5: "RG NOVO - VERSO"
  };

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

  const runJsFunction = Worklets.createRunOnJS((data: DataJSProps) => {
    //console.log('\n Outputs');

    valueTop.value = data.right;
    valueBottom.value = data.top;
    valueRight.value = data.bottom;
    valueLeft.value = data.left;

    xCoords.value = withSpring(data.left)
    yCoords.value = withSpring(data.bottom)
    widths.value = withSpring(data.right)
    heights.value = withSpring(data.top)
    /*
    if (data === undefined) return

    xCoords.value = convertNormalizedToAbsolute(data.left, screenWidth),
    yCoords.value = convertNormalizedToAbsolute(data.top, screenHeight),
    widths.value = convertNormalizedToAbsolute(data.bottom - data.right, screenWidth),
    heights.value = convertNormalizedToAbsolute(data.top - data.left, screenHeight)

     data.map(box => {
      const [y1, x1, y2, x2] = box.split(',').map(parseFloat); // Corrigindo a ordem das coordenadas
      xCoords.value = convertNormalizedToAbsolute(x1, screenWidth),
        yCoords.value = convertNormalizedToAbsolute(y1, screenHeight),
        widths.value = convertNormalizedToAbsolute(x2 - x1, screenWidth),
        heights.value = convertNormalizedToAbsolute(y2 - y1, screenHeight)
      }) 
      console.log('width ', screenWidth)
      console.log('Left ', data.left)
      console.log('right ', data.right)
      console.log('Result ', data.left + data.right)
      */

  })


  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    if (model == null) return
    if (actualModel == null || undefined) return

    //console.log(`Frame is ${frame}\n\n`)
    const frameWidth = frame.width;
    const frameHeight = frame.height;

    const resized = resize(frame, {
      scale: { width: 320, height: 320 },
      pixelFormat: 'rgb',
      dataType: 'uint8',
    })

    // 2. Run model with given input buffer synchronously
    const outputs = actualModel.runSync([resized])

    const detected_boxes = outputs[0]
    const detected_classes = outputs[1]
    const detected_scores = outputs[2]

    //console.log('Result detected_boxes ==>', `${detected_boxes}`);
    console.log('Result detected_classes ==>', `${detected_classes}`);
    //console.log('Result detected_scores ==>', `${detected_scores}`);


    // Conversion model
    function convertFloat32ArrayToStringArray(): any | undefined {
      const boxArr: number[] = new Array(4);
      for (let i = 0; i < detected_scores.length; i++) {
        //console.log('Value detect', detected_scores[i]);
        if (detected_scores[i] >= 0.90) {
          console.log('\n\nValue detect', detected_scores[i] >= 0.90);
        }


        const from = Number(detected_scores[i])
        const to = Number(detected_scores[i + 1])

        const confidence = detected_boxes[from + 2]

        const left = Math.floor((Number(detected_boxes[i + 1]) * frameWidth))
        const bottom = Math.floor((Number(detected_boxes[i]) * frameHeight)) //esse
        const right = Math.floor((Number(detected_boxes[i + 1]) * frameWidth)) //esse
        const top = Math.floor((Number(detected_boxes[i]) * frameHeight))
        const dataReturn = { bottom, left, right, top }
        //console.log('Result:', dataReturn);
        return dataReturn

      }
      /*       for (let i = 0; i < detected_scores.length; i++) {
              //console.log('detected_boxes:', detected_boxes);
              for (let j = 0; j < 4; j++) {
                boxArr[j] = Number(detected_boxes[j]);
              }
              const left = Math.floor((boxArr[0] * frameWidth))
              const bottom = Math.floor((boxArr[1] * frameHeight)) //esse
              const right = Math.floor((frameWidth - (boxArr[2] * frameWidth))) //esse
              const top = Math.floor((frameHeight - (boxArr[3] * frameHeight)))
              const dataReturn = { bottom, left, right, top }
              console.log('Resultado', dataReturn);
              return dataReturn
            } */
    }
    const data = convertFloat32ArrayToStringArray()
    runJsFunction(data)
  }, [actualModel]);

  /* console.log('dataReturn:', detected_boxes[i] > 0.09);
  for (let j = 0; j < 4; j++) {
    boxArr[j] = detected_boxes[i][j];
  }
  const position = Number(detected_classes[i])
  const detectedClass = documentClasses[position]
 
  const left = Math.floor((boxArr[0] * frameWidth))
  const bottom = Math.floor((boxArr[1] * frameHeight)) //esse
  const right = Math.floor((frameWidth - (boxArr[2] * frameWidth))) //esse
  const top = Math.floor((frameHeight - (boxArr[3] * frameHeight)))
 
  const dataReturn = { bottom, left, right, top }
  console.log('dataReturn:', dataReturn);
  return dataReturn; */
  /*       for (let i = 0; i < detected_boxes.length; i++) {
  
          const top = Math.floor(frameHeight - (Number(detected_boxes[i]) * frameHeight))
          const left = Math.floor(Number(detected_boxes[i + 1]) * frameWidth)
          const bottom = Math.floor(Number(detected_boxes[i + 2]) * frameHeight)
          const right = Math.floor(frameWidth - (Number(detected_boxes[i + 3]) * frameWidth))
  
  
          const dataReturn = { bottom, left, right, top }
  
  
          return dataReturn;
        } */

  // const data = convertFloat32ArrayToStringArray()
  //console.log('dataReturn:', data);


  //runJsFunction(data)

  /* 
  for (let i = 0; i < detected_boxes.length; i++) {
    const confidence = detected_scores[i];
    // we're more than 40% confident that this is an object - draw it!

    const top = Number(detected_boxes[i]);
    console.log('confidence top', Math.floor(screenHeight - (top * screenHeight)))

    const left = Number(detected_boxes[i + 1]);
    const bottom = Number(detected_boxes[i + 2]);
    const right = Number(detected_boxes[i + 3]);
    console.log('out', Math.floor(top * screenHeight));
    //console.log(left, top, right - left, bottom - top) 
    const data2 = {
      top: Math.floor(screenHeight - (top * screenHeight)),
      bottom: Math.floor(screenHeight - (top * screenHeight))
    }
    runJsFunction(data2)
  }
      //console.log(`Frame is outputs`, outputs[0])
      const detected_boxes = outputs[0]
      const detected_classes = outputs[1]
      const detected_scores = outputs[2]
  
      for (let i = 0; i < detected_scores.length; i++) {
        const confidence = detected_scores[i]
  
        const ClassNumber = detected_classes[i]
        const convertedClass: number = typeof ClassNumber === 'bigint' ? Number(ClassNumber) : ClassNumber;
        console.log('Tipo de documento', `${documentClasses[convertedClass]}`)
  
  
        if (confidence > 0.4) {
          console.log('confidence', confidence)
  
          const top = detected_boxes[i]
          const left = detected_boxes[i + 1]
          const bottom = detected_boxes[i + 2]
          const right = detected_boxes[i + 3]
        }
        // console.log(boxTop, boxLeft, boxBottom, boxRight);
      } */

  // Conversion model
  /*     function convertFloat32ArrayToStringArray(floatArray: Float32Array | any): DataResult | undefined {
        const boxArr: number[] = new Array(4);
        for (let i = 0; i < floatArray.length; i++) {
          for (let j = 0; j < 4; j++) {
            boxArr[j] = floatArray[i][j];
          }
          console.log('boxArr', boxArr);
  
  
          const detectedClass: string = documentClasses[0];
  
          const left: number = Math.floor(boxArr[0] * screenWidth); //X
          const bottom: number = Math.floor(boxArr[1] * screenHeight); //Y
          const right: number = Math.floor(screenWidth - (boxArr[2] * screenWidth)); //w
          const top: number = Math.floor(screenHeight - (boxArr[3] * screenHeight));//h
  
          const dataReturn = { bottom, left, right, top, detectedClass }
  
          console.log('dataReturn:', dataReturn);
  
          return dataReturn;
        }
      } */
  /*     const data = convertFloat32ArrayToStringArray(outputs)
  
  
      runJsFunction(data) */


  const boxOverlayStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    borderWidth: 3,
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
      <Pressable
        style={styles.containerButton}
        onPress={() => checkPermissionCam()}
      >
        <Title text='Solicitar permissão' color={colors.shape} />
      </Pressable>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused}
        frameProcessor={frameProcessor}
      />
      <Title text={`${documentClasses[1]}`} />
      <Animated.View style={boxOverlayStyle} />
      <BoxDelimiter
        x={xCoords}
        y={yCoords}
        width={widths}
        height={heights}
      />
    </>
  )

}