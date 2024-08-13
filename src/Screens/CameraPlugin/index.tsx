import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import styles from './styles';
import { Camera, useCameraDevice, useFrameProcessor } from 'react-native-vision-camera';
import { useIsFocused } from '@react-navigation/native';
import { DocumentDetect } from '../../modules/Packages/DocumentDetectPackage';
import { useResizePlugin } from 'vision-camera-resize-plugin';

export default function CameraPlugin() {
  const isFocused = useIsFocused();
  const device = useCameraDevice('back')
  const { resize } = useResizePlugin()

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    const data = DocumentDetect(frame)

    console.log(`Return FrameProcessor =>`, data)
  }, []);


  if (device == null) return <ActivityIndicator />
  return (
    <View style={styles.container}>
      <Camera
        style={[styles.container, StyleSheet.absoluteFill]}
        device={device}
        isActive={isFocused}
        frameProcessor={frameProcessor}
      />
    </View>
  )

}