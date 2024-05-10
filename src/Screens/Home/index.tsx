import React from 'react';
import { Pressable } from 'react-native';
import { useAppNavigation } from '../../hooks/navigation';
import styles from './styles';
import { Title } from '../../components/Title';
import { colors } from '../../utils/theme';
import { checkPermissionCam, checkPermissionMic } from '../../functions/permissions';


export default function Home() {
  const navigate = useAppNavigation()

  function navigateToRanimated() {
    navigate.navigate('Reanimated')
  }
  function navigateToCamera() {
    navigate.navigate('CameraScreen')
  }
  function navigateToOCRScreen() {
    navigate.navigate('OCRSceen')
  }

  function handleCheckPermissionCam() {
    checkPermissionCam()
  }
  function handleCheckPermissionMic() {
    checkPermissionMic()
  }

  return (<>
    <Pressable
      style={styles.containerButton}
      onPress={() => navigateToRanimated()}
    >
      <Title text='Reanimated' color={colors.shape} />
    </Pressable>
    <Pressable
      style={styles.containerButton}
      onPress={() => navigateToCamera()}
    >
      <Title text='Camera Padrão' color={colors.shape} />
    </Pressable>
    <Pressable
      style={styles.containerButton}
      onPress={() => navigateToOCRScreen()}
    >
      <Title text='OCR Scren' color={colors.shape} />
    </Pressable>
    <Pressable
      style={[styles.containerButton, { backgroundColor: colors.primary }]}
      onPress={() => handleCheckPermissionCam()}
    >
      <Title text='Checar permissão Camera' color={colors.shape} />
    </Pressable>
    <Pressable
      style={[styles.containerButton, { backgroundColor: colors.primary }]}
      onPress={() => handleCheckPermissionMic()}
    >
      <Title text='Checar permissão Microfone' color={colors.shape} />
    </Pressable>
  </>

  );
}