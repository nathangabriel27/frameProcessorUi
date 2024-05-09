import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useAppNavigation } from '../../hooks/navigation';
import styles from './styles';
import { Title } from '../../components/Title';
import { colors } from '../../utils/theme';


export default function Home() {
  const navigate = useAppNavigation()

  function navigateToRanimated() {
    navigate.navigate('Reanimated')
  }
  function navigateToCamera() {
    navigate.navigate('CameraScreen')
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
  </>

  );
}