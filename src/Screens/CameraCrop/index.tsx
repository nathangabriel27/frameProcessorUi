import * as React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, Modal } from 'react-native';
import { Camera, useCameraDevice, useFrameProcessor } from 'react-native-vision-camera';
import { Worklets, useSharedValue } from 'react-native-worklets-core';
import { crop, CropRegion } from 'vision-camera-cropper';
import styles from './styles';
import { BodyModal } from './components/BodyModal';
import { TakePhoto } from './components/TakePhoto';

interface Dimensions {
  left: number;
  top: number;
  width: number;
  height: number;
  maxWidth?: number;
  maxHeight?: number;
};

interface DimensionsFunc {
  left: number;
  top: number;
  width: number;
  height: number;
  maxWidth: number;
  maxHeight: number;
};

export default function CameraCrop() {
  const [hasPermission, setHasPermission] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const back = useCameraDevice("back");

  const [imageData, setImageData] = useState<undefined | string>(undefined);
  const setImageDataJS = Worklets.createRunOnJS(setImageData);
  const shouldTake = useSharedValue(false); // Controle de tirar a foto
  const cropRegionShared = useSharedValue<undefined | CropRegion>(undefined);

  // Check permissão da câmera
  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
      setIsActive(true);
    })();
  }, []);

  // Função para ajustar e converter dimensões para percentuais
  const adjustAndConvertDimensions = ({ left, top, width, height, maxWidth, maxHeight }: DimensionsFunc) => {
    let region;
  
    // Garantir que a largura e altura não ultrapassem o limite do frame
    const adjustedWidth = Math.min(width, maxWidth);  // Limitar largura ao frame
    const adjustedHeight = Math.min(height, maxHeight);  // Limitar altura ao frame
  
    // Centralizar horizontalmente e verticalmente
    const centeredLeft = (maxWidth - adjustedWidth) / 2;
    const centeredTop = (maxHeight - adjustedHeight) / 2;
  
    // Verificação para que não ultrapasse os limites
    const finalLeft = Math.max(0, centeredLeft); 
    const finalTop = Math.max(0, centeredTop);
  
    // Converter para percentuais
    region = {
      left: (finalLeft / maxWidth) * 100,
      top: (finalTop / maxHeight) * 100,
      width: (adjustedWidth / maxWidth) * 100,
      height: (adjustedHeight / maxHeight) * 100,
    };
  
    console.log('Adjusted region (final, centered):', region);
    cropRegionShared.value = region;
  };

  const adjustAndConvertDimensionsJS = Worklets.createRunOnJS(adjustAndConvertDimensions);

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet'

    const frameWidth = frame.width;  // Largura real do frame processado
    const frameHeight = frame.height; // Altura real do frame processado
  
    // Coordenadas fornecidas dinamicamente (scaled absolute coordinates), mantendo as originais
    const originalLeft = 42;
    const originalTop = 327;
    const originalRight = 351;
    const originalBottom = 671;
  
    // Calcular as dimensões do recorte (inteiras)
    const cropDimensions = {
      left: originalLeft,
      top: originalTop,
      width: originalRight - originalLeft,
      height: originalBottom - originalTop,
      maxWidth: frameWidth,
      maxHeight: frameHeight
    };

    // Ajustar e converter para percentuais, aplicando a escala
    adjustAndConvertDimensionsJS(cropDimensions);

// Aplicar o recorte
if (shouldTake.value === true && cropRegionShared.value != undefined) {
  console.log('cropRegionShared=>', cropRegionShared.value);
  try {
    const result = crop(frame, {
      cropRegion: cropRegionShared.value,
      includeImageBase64: true,
    });

    if (result && result.base64) {
      setImageDataJS("data:image/jpeg;base64," + result.base64);
    }
  } catch (e) {
    console.log('Erro ao tentar realizar o recorte:', e);
  }
  shouldTake.value = false;
}
}, []);

  return (
    <SafeAreaView style={styles.container}>
      {back != null && hasPermission && (
        <>
          <Camera
            style={StyleSheet.absoluteFill}
            isActive={isActive}
            device={back}
            frameProcessor={frameProcessor}
            resizeMode='contain'
          />
          <TakePhoto action={() => shouldTake.value = true} />

          <Modal
            animationType="slide"
            transparent={true}
            visible={(imageData != undefined)}
            supportedOrientations={['portrait', 'landscape']}
            onRequestClose={() => setImageData(undefined)}
          >
            <BodyModal
              imageData={imageData}
              actionCleanImage={() => setImageData(undefined)}
              actionNewImage={(newImage) => setImageData(newImage)}
            />
          </Modal>
        </>
      )}
    </SafeAreaView>
  );
}