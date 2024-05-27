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
  function navigateToCameraAnimais() {
    navigate.navigate('CameraAnimais')
  }
  function navigateToOCRScreen() {
    navigate.navigate('OCRScreen')
  }
  function navigateToObjScreen() {
    navigate.navigate('CameraScreenModelObject')
  }
  function navigateToCameraTestScreen() {
    navigate.navigate('CameraTestScreen')
  }

  function handleCheckPermissionCam() {
    checkPermissionCam()
  }
  function handleCheckPermissionMic() {
    checkPermissionMic()
  }

  // {"bottom": 0.6093349456787109, "left": 0.0031332969665527344, "right": 0.9968667030334473, "top": -0.009334921836853027}
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
      <Title text='IA CNH' color={colors.shape} />
    </Pressable>
    <Pressable
      style={styles.containerButton}
      onPress={() => navigateToCameraAnimais()}
    >
      <Title text='IA Animais' color={colors.shape} />
    </Pressable>
    <Pressable
      style={styles.containerButton}
      onPress={() => navigateToObjScreen()}
    >
      <Title text='Reconhecimento Objetos' color={colors.shape} />
    </Pressable>

    <Pressable
      style={[styles.containerButton, { backgroundColor: colors.yellow }]}
      onPress={() => navigateToCameraTestScreen()}
    >
      <Title text='Camera Jordy' color={colors.shape} />
    </Pressable>
{/*     <Pressable
      style={styles.containerButton}
      onPress={() => navigateToOCRScreen()}
    >
      <Title text='OCR Scren' color={colors.shape} />
    </Pressable> */}
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