import React from 'react';
import { Pressable, ScrollView } from 'react-native';
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
  function navigateToCameraIANando() {
    navigate.navigate('CameraIANando')
  }
  function handleCheckPermissionCam() {
    checkPermissionCam()
  }
  function handleCheckPermissionMic() {
    checkPermissionMic()
  }
  function navigateToNativeAndroid() {
    navigate.navigate('NativeAndroid')
  }
  function navigateToNativeIOS() {
    navigate.navigate('NativeIOS')
  }
  function navigateToTestComponent() {
    navigate.navigate('TestComponent')
  }
  function navigateToCameraPlugin() {
    navigate.navigate('CameraPlugin')
  }

  return (<ScrollView>
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
      style={[styles.containerButton, { backgroundColor: colors.primary_Dark }]}
      onPress={() => navigateToCameraPlugin()}
    >
      <Title text='Plugin Document' color={colors.shape} />
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
    <Pressable
      style={[styles.containerButton, { backgroundColor: colors.progres }]}
      onPress={() => navigateToCameraIANando()}
    >
      <Title text='Camera IA Nando' color={colors.shape} />
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
    <Pressable
      style={[styles.containerButton, { backgroundColor: colors.success }]}
      onPress={() => navigateToNativeAndroid()}
    >
      <Title text='Componente nativo ANDROID' color={colors.shape} />
    </Pressable>
    <Pressable
      style={[styles.containerButton, { backgroundColor: colors.primary_Dark }]}
      onPress={() => navigateToNativeIOS()}
    >
      <Title text='Componente nativo IOS' color={colors.shape} />
    </Pressable>
    <Pressable
      style={[styles.containerButton, { backgroundColor: colors.primary_Dark }]}
      onPress={() => navigateToTestComponent()}
    >
      <Title text='Teste de componente' color={colors.shape} />
    </Pressable>
  </ScrollView>
  );
}