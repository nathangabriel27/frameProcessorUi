import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, View, Dimensions } from 'react-native';
import { Camera, useCameraDevice, useFrameProcessor } from 'react-native-vision-camera';
import { useIsFocused } from '@react-navigation/native';
import { DetectionBox, DetectionResult, DocumentDetect } from '../../modules/Packages/DocumentDetectPackage';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Worklets } from 'react-native-worklets-core';
import styles from './styles';

export default function CameraPlugin() {
  const isFocused = useIsFocused();
  const device = useCameraDevice('back');

  const top = useSharedValue<number>(0);
  const bottom = useSharedValue<number>(0);
  const left = useSharedValue<number>(0);
  const right = useSharedValue<number>(0);
  const [resultProps, setResultProps] = useState<DetectionBox>({} as DetectionBox);

  const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

  // Função para manipular as detecções usando Worklets.createRunOnJS
  const onDetected = Worklets.createRunOnJS((data: DetectionBox, frameWidth: number, frameHeight: number, orientation: string) => {
    if (data.detected_score > 0.5) {
      const [x1Norm, y1Norm, x2Norm, y2Norm] = data.detected_boxes;

      let x1, y1, x2, y2;

      // Ajuste das coordenadas com base na orientação
      if (orientation === 'landscape-left') {
        // landscape-left (90° anti-horário)
        x1 = (1 - y1Norm) * frameHeight;
        y1 = x1Norm * frameWidth;
        x2 = (1 - y2Norm) * frameHeight;
        y2 = x2Norm * frameWidth;
      } else if (orientation === 'landscape-right') {
        // landscape-right (90° horário)
        x1 = y1Norm * frameHeight;
        y1 = (1 - x1Norm) * frameWidth;
        x2 = y2Norm * frameHeight;
        y2 = (1 - x2Norm) * frameWidth;
      } else if (orientation === 'portrait-upside-down') {
        // portrait-upside-down (180°)
        x1 = (1 - x2Norm) * frameWidth;
        y1 = (1 - y2Norm) * frameHeight;
        x2 = (1 - x1Norm) * frameWidth;
        y2 = (1 - y1Norm) * frameHeight;
      } else {
        // portrait (0°)
        x1 = x1Norm * frameWidth;
        y1 = y1Norm * frameHeight;
        x2 = x2Norm * frameWidth;
        y2 = y2Norm * frameHeight;
      }

      // Ajustes para garantir que as dimensões estão corretas
      if (x1 > x2) {
        [x1, x2] = [x2, x1]; // Garantir que x1 < x2 para largura correta
      }
      if (y1 > y2) {
        [y1, y2] = [y2, y1]; // Garantir que y1 < y2 para altura correta
      }

      // Aplicar escala de acordo com a tela
      const scaleX = windowWidth / frameHeight;  // Ajustando para altura do frame no eixo X
      const scaleY = windowHeight / frameWidth;  // Ajustando para largura do frame no eixo Y

      // Aplicar escala
      x1 *= scaleX;
      y1 *= scaleY;
      x2 *= scaleX;
      y2 *= scaleY;

      // Aumentar ligeiramente a largura para garantir que ela seja suficiente
      const extraWidth = 135; // Aumentar 10 pixels
      x1 -= extraWidth / 2;
      x2 += extraWidth / 2;

      // Log para debug
      console.log('Frame Dimensions:', frameHeight, frameWidth);
      console.log('Scaled Absolute Coordinates:', x1, y1, x2, y2);
      console.log('Screen Dimensions:', windowHeight, windowWidth);
      console.log('Frame Orientation:', orientation);

      // Atualizar os valores compartilhados para coordenadas ajustadas à tela
      left.value = x1;       
      top.value = y1;        
      right.value = x2;      
      bottom.value = y2;     

      setResultProps(data); // Atualiza o estado com os dados de detecção
    } else {
      setResultProps({} as DetectionBox); // Reseta o estado se não houver detecção válida
    }
  });

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';

    const data: DetectionResult = DocumentDetect(frame);
    if (data.success && data.detections.length > 0) {
      const detection = data.detections[0];    
      onDetected(detection, frame.width, frame.height, frame.orientation);
    } else {
      onDetected({} as DetectionBox, frame.width, frame.height, frame.orientation);
    }
  }, []);

  const animatedBoxStyle = useAnimatedStyle(() => {
    const boxWidth = right.value - left.value;
    const boxHeight = bottom.value - top.value;
    return {
      position: 'absolute',
      left: withSpring(left.value),
      top: withSpring(top.value),
      width: withSpring(boxWidth),
      height: withSpring(boxHeight),
      borderColor: 'red',
      borderWidth: 2,
    };
  });

  if (device == null) return <ActivityIndicator />;

  return (
    <View style={styles.container}>
      <Camera
        style={[styles.container, StyleSheet.absoluteFill]}
        device={device}
        isActive={isFocused}
        frameProcessor={frameProcessor}
      />
      <Animated.View style={animatedBoxStyle} />
    </View>
  );
}