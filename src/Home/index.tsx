import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useAppNavigation } from '../../hooks/navigation';
import styles from './styles';
import { Title } from '../components/Title';
import { colors } from '../utils/theme';


export default function Home() {
  const navigate = useAppNavigation()

  function navigateToDetails() {
    navigate.navigate('Details')
  }
  return (
    <Pressable
      style={styles.containerButton}
      onPress={() => navigateToDetails()}
    >
      <Title text='Navegar para tela de Detalhes'  color={colors.shape}/>
    </Pressable>
  );
}