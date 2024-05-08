import React from 'react';
import { Pressable, Text, View } from 'react-native';
import styles from './styles';
import { Title } from '../components/Title';
import { colors } from '../utils/theme';
import { useAppNavigation } from '../../hooks/navigation';


export default function Details() {
  const navigate = useAppNavigation()

  function navigateGoBack() {
    navigate.goBack()
  }
  return (
    <Pressable
      style={styles.containerButton}
      onPress={() => navigateGoBack()}
    >
      <Title text='Votlar para Home' color={colors.shape} />
    </Pressable>
  );
}