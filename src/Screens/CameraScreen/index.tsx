import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import styles from './styles';
import { Title } from '../../components/Title';
import { colors } from '../../utils/theme';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { useAppNavigation } from '../../hooks/navigation';
import { checkPermissionCam } from '../../functions/permissions';

export default function CameraScreen() {
  const navigate = useAppNavigation()
  const device = useCameraDevice('back')


  function navigateGoBack() {
    navigate.goBack()
  }

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
        isActive={true}
      />
    </>
  )

}