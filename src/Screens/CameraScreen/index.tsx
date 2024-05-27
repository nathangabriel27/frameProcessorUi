import React, { useEffect, useState } from 'react'; import { ActivityIndicator, Dimensions, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import styles from './styles';
import { Title } from '../../components/Title';
import { colors } from '../../utils/theme';
import { Camera, Templates, useCameraDevice, useCameraFormat, useFrameProcessor, useSkiaFrameProcessor } from 'react-native-vision-camera';
import { useAppNavigation } from '../../hooks/navigation';
import { checkPermissionCam } from '../../functions/permissions';
import { useTensorflowModel, TensorflowModel } from 'react-native-fast-tflite'
import { useIsFocused } from '@react-navigation/native';
import { useResizePlugin } from 'vision-camera-resize-plugin';
import { Worklets } from 'react-native-worklets-core';
import { Skia, Canvas } from "@shopify/react-native-skia"
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { BoxDelimiter } from './components/BoxDelimiter';
import { resizePlugin } from './functions/resizePlugin';

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
  const format = useCameraFormat(device, Templates.FrameProcessing)
  //const model = useTensorflowModel(require('../../assets/Models/tflite/efficientdet.tflite'))//model path
  //const model = useTensorflowModel(require('../../assets/Models/tflite/cnhModel.tflite'))//model path CNH
  const model = useTensorflowModel(require('../../assets/Models/tflite/cnhNewModel.tflite'))//model path CNH
  //const model = useTensorflowModel(require('../../assets/Models/tflite/cnh2.tflite'))//model path CNH
  //const model = useTensorflowModel(require('../../assets/Models/tflite/cnhModelCoreML.mlmodel'), 'core-ml')//model path CNH
  //const model = useTensorflowModel(require('../../assets/Models/tflite/mobile_object_localizer.tflite'))//model path Objetos Teste
  //const model = useTensorflowModel(require('../../assets/Models/tflite/obj-detect.tflite'))//model path Objetos Teste 2 

  const actualModel = model.state === 'loaded' ? model.model : undefined
  const { resize } = useResizePlugin()

  useEffect(() => {
    if (actualModel == null) return
    console.log(`\nModel loaded! Shape:`, actualModel)
  }, [actualModel])

  const documentClasses: { [key: number]: string } = {
    0: "0   CNH - FRENTE",
    1: "1   CNH - VERSO",
    2: "2   RG - FRENTE",
    3: "3   RG - VERSO",
    4: "4   RG NOVO - FRENTE",
    5: "5   RG NOVO - VERSO"
  };

  const RETURN_BOX_CONFIDENCE_VALUE = 0.60;
  const DOCUMENT_DETECTED_CONFIDENCE_VALUE = 0.7;

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
    if (data === undefined) return;

    const padding = 10; // Ajuste o valor do padding conforme necessário

    valueTop.value = withSpring(data.top);
    valueBottom.value = withSpring(data.bottom + 10);
    valueRight.value = withSpring(data.right + 10);
    valueLeft.value = withSpring(data.left + 10);

    xCoords.value = withSpring(data.left);
    yCoords.value = withSpring(data.top + 10);
    widths.value = withSpring(screenWidth - (data.left - data.right));
    heights.value = withSpring(screenHeight - (data.bottom - data.top));
  })

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    if (model == null) return
    if (actualModel == null || undefined) return

    //console.log(`Frame is ${frame} \n\n`)
    const resized = resize(frame, {
      scale: { width: 320, height: 320 },
      pixelFormat: 'rgb',
      dataType: 'float32',
    })
    //const resized = resizePlugin(frame, 320, 320)
    const outputs = actualModel.runSync([resized])

    const detected_locations = outputs[0]
    const detected_classes = outputs[1]
    const detected_scores = outputs[2]


    //console.log('Result detected_locations ==>', `${detected_locations}`);
    console.log('Result detected_classes ==>', `${detected_classes}`);
    //console.log('Result detected_scores ==>', `${detected_scores}`);
    // console.log('Result number_detectetions ==>', `${number_detectetions}`);
    const frameWidth = frame.width;
    const frameHeight = frame.height;

    /* 

    const resized = resize(frame, {
      scale: { width: 320, height: 320 },
      pixelFormat: 'rgb',
      dataType: 'float32',
    })

    // 2. Run model with given input buffer synchronously
    const outputs = actualModel.runSync([resized])

    const detected_boxes = outputs[0]
    const detected_classes = outputs[1]
    const detected_scores = outputs[2] */

    //console.log('Result detected_boxes ==>', `${detected_boxes}`);
    //console.log('Result detected_classes ==>', `${detected_classes}`);
    //console.log('Result detected_scores ==>', `${detected_scores}`);


    // Conversion model
    function convertFloat32ArrayToStringArray(): any | undefined {
      for (let i = 0; i < detected_locations.length; i += 4) {
        const confidence = detected_scores[0]
        if (confidence > DOCUMENT_DETECTED_CONFIDENCE_VALUE) {
          // 4. Draw a red box around the detected object!

          const top = Number(detected_locations[0]) * screenHeight
          const left = Number(detected_locations[1]) * screenWidth
          const bottom = screenHeight - (Number(detected_locations[2]) * screenHeight)
          const right = screenWidth - (Number(detected_locations[3]) * screenWidth)


          const box = { top, left, right, bottom };
          //console.log('box', box);
          return box
        }
      }

      for (let i = 0; i < detected_scores.length; i++) {
        // const detectedDcumentClass = documentClasses[Number(detected_classes[i])]
        // console.log(detectedDcumentClass);
        /*         
                if (detected_scores[i] >= DOCUMENT_DETECTED_CONFIDENCE_VALUE) {
                  for (let j = 0; j < 4; j++) {
                    boxArr[j] = detected_boxes[i][j];
                  }
                  const detectedDcumentClass = documentClasses[Number(detected_classes[i])]
        
                    int left = (int)(boxArr[0] * SCREEN_WIDTH);
                    int bottom = (int)(boxArr[1] * SCREEN_HEIGHT); //esse
                    int right = (int)(SCREEN_WIDTH - (boxArr[2] * SCREEN_WIDTH)); //esse
                    int top = (int)(SCREEN_HEIGHT - (boxArr[3] * SCREEN_HEIGHT));
        
                    Bitmap originalCroppedBitMap = cropImage(
                    bitmap,
                    (int)((boxArr[0] * bitmap.getWidth()) + 10),
                    (int)((boxArr[1] * bitmap.getHeight()) + 5),
                    (int)((boxArr[2] * bitmap.getWidth()) + 10),
                    (int)((boxArr[3] * bitmap.getHeight()) + 5)
                  );
        
        
                } */
      }
      /* 
            for (let i = 0; i < detected_scores.length; i++) {
              const top = Number(detected_boxes[i]) * frameWidth
              const left = Number(detected_boxes[i + 1])
              const bottom = Number(detected_boxes[i + 2])
              const right = Number(detected_boxes[i + 3]) */
      // console.log(left, top, right - left, bottom - top)


      /* 
                let highestScore = 0;
                  let highestIndex = -1;
            
                  for (let i = 0; i < detected_scores.length; i++) {
                    console.log(`Score [${i}]:`, detected_scores[i]);
                    if (detected_scores[i] > highestScore) {
                      highestScore = Number(detected_scores[i]);
                      highestIndex = i;
                    }
                  }
            
                  if (highestIndex !== -1 && highestScore >= DOCUMENT_DETECTED_CONFIDENCE_VALUE) {
                    const boxArr = detected_boxes[highestIndex]; */

      // Verificar e corrigir valores das caixas delimitadoras
      /*       const [yMin, xMin, yMax, xMax] = boxArr.map(coord => Math.max(0, Math.min(1, coord)));
        
            const left = xMin * frame.width;
            const top = yMin * frame.height;
            const right = frame.width - (xMax * frame.width);
            const bottom = frame.height - (yMax * frame.height);
    
              // Retornar os resultados
              const box = { top, left, right, bottom };
    
    
              console.log('box', box);
              return {
                top,
                left,
                right,
                bottom
              }; 
              
            }
            */
    }
    const data = convertFloat32ArrayToStringArray()
    runJsFunction(data)
    /*    
   */
  }, [actualModel]);

  /* 
  console.log('dataReturn:', detected_boxes[i] > 0.09);
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
  return dataReturn;
   */
  /*       
  for (let i = 0; i < detected_boxes.length; i++) {
  
          const top = Math.floor(frameHeight - (Number(detected_boxes[i]) * frameHeight))
          const left = Math.floor(Number(detected_boxes[i + 1]) * frameWidth)
          const bottom = Math.floor(Number(detected_boxes[i + 2]) * frameHeight)
          const right = Math.floor(frameWidth - (Number(detected_boxes[i + 3]) * frameWidth))
  
  
          const dataReturn = { bottom, left, right, top }
  
  
          return dataReturn;
        } 
        */

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
      }
*/

  // Conversion model
  /*    
   function convertFloat32ArrayToStringArray(floatArray: Float32Array | any): DataResult | undefined {
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
      } 
      */
  /*     const data = convertFloat32ArrayToStringArray(outputs)
  
  
      runJsFunction(data) */


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
      <Pressable
        style={styles.containerButton}
        onPress={() => checkPermissionCam()}
      >
        <Title text='Solicitar permissão' color={colors.shape} />
      </Pressable>
      <Camera
        style={[StyleSheet.absoluteFill,
          //{ width: 720, height: 1280}
        ]}
        device={device}
        isActive={isFocused}
        format={format}
        //fps={30}
        //pixelFormat="rgb"
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