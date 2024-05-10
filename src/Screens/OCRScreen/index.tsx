import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, LayoutChangeEvent, PixelRatio, Platform, Pressable } from 'react-native';
import styles from './styles';
import { Title } from '../../components/Title';
import { Camera, useCameraDevice, useFrameProcessor } from 'react-native-vision-camera';

import { runOnJS, useSharedValue } from 'react-native-reanimated';
import { RenderOverlayIOS } from './Components/RenderOverlay';
import { useIsFocused } from '@react-navigation/native';

export default function OCRScreen() {
  const isFocused = useIsFocused();
  const device = useCameraDevice('back')
  const cameraRef = useRef<Camera>(null);
  const [isActive, setIsActive] = useState<boolean>(false);
  const frameWidth = useSharedValue<number>(1);
  const frameHeight = useSharedValue<number>(1);
  const [ocrDetect, setOcrDetect] = useState<boolean>(true);
  const ocrFrameValue = useSharedValue<number>(0);
  const [pixelRatio, setPixelRatio] = useState<number>(1);

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
      console.log('Frame');
    
    /*
    const scannedOcr = scanOCR(frame); 
     frameWidth.value = frame.width;
    frameHeight.value = frame.height;
    runOnJS(setOcrData)(scannedOcr);
    */
  }, [ocrFrameValue]);


  if (device == null) return <ActivityIndicator />
  return (
    <>
      <Pressable style={{ position: 'absolute' }}>
        <Title text='OCR' />
      </Pressable>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        device={device}
        torch={'off'}
        isActive={isFocused}
        frameProcessor={frameProcessor}
        onLayout={(event: LayoutChangeEvent) => {
          setPixelRatio(
            event.nativeEvent.layout.width /
            PixelRatio.getPixelSizeForLayoutSize(
              event.nativeEvent.layout.width
            )
          );
        }}
      />
      {/*       {ocrDetect && (
        Platform.OS === 'ios'
          ? <RenderOverlayIOS pixelRatio={pixelRatio} ocrData={ocrData} />
          : <RenderOverlayAndroid ocrData={ocrData} frameHeight={frameHeight.value} frameWidth={frameWidth.value} />
      )} */}
    </>
  )

}