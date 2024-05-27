import React, { useEffect } from 'react'; import { ActivityIndicator, Dimensions, Platform, Pressable, StyleSheet } from 'react-native';
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

import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

type DataJSProps = {
  top: number
  left: number
  bottom: number
  right: number
}

export default function CameraTestScreen() {
  const isFocused = useIsFocused();
  const navigate = useAppNavigation()
  const device = useCameraDevice('back')
  const format = useCameraFormat(device, Templates.FrameProcessing)
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  // Edit this model 
  const model = useTensorflowModel(require('../../assets/Models/tflite/cnhNewModel.tflite'))//model path CNH

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

  const valueTop = useSharedValue<number>(0);
  const valueBottom = useSharedValue<number>(0);
  const valueLeft = useSharedValue<number>(0);
  const valueRight = useSharedValue<number>(0);

  const runJsBoxDelimiter = Worklets.createRunOnJS((data: DataJSProps) => {
    if (data === undefined) return;
    const padding = Platform.OS === 'ios' ? -10 : +10; // Adjuste value padding 

    valueTop.value = withSpring(data.top);
    valueBottom.value = withSpring(data.bottom + padding);
    valueRight.value = withSpring(data.right + padding);
    valueLeft.value = withSpring(data.left + padding);
  })

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    if (model == null) return
    if (actualModel == null || undefined) return

    console.log(`Frame is ${frame} \n\n`)

    // Adjust
    const resized = resize(frame, {
      scale: { width: 320, height: 320 },
      pixelFormat: 'rgb',
      dataType: 'float32',
    })
    const frameWidth = frame.width;
    const frameHeight = frame.height;

    const outputs = actualModel.runSync([resized])

    const detected_locations = outputs[0]
    const detected_classes = outputs[1]
    const detected_scores = outputs[2]

    console.log('Result detected_classes ==>', `${detected_classes}`);
    //console.log('Result detected_locations ==>', `${detected_locations}`);
    //console.log('Result detected_scores ==>', `${detected_scores}`);
    //console.log('Result number_detectetions ==>', `${number_detectetions}`);


    // Conversion 
    function convertFromBox(): any | undefined {
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
        frameProcessor={frameProcessor}
      />
      {/*       <Title text={`${documentClasses[1]}`} /> */}
      <Animated.View style={boxOverlayStyle} />
    </>
  )

}