import React from 'react';
import { Pressable, View } from 'react-native';
import styles from './styles';
import { Title } from '../../components/Title';
import { colors } from '../../utils/theme';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';

export default function Reanimated() {
  const width = useSharedValue(100);
  const handlePressIncrement = () => {
    width.value = withSpring(width.value + 50);
  };
  const handlePressDecrement = () => {
    width.value = withSpring(width.value - 50);
  };
  const handlePressClear = () => {
    width.value = withSpring(100);
  };

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Animated.View
        style={{
          width,
          height: 100,
          backgroundColor: 'violet',
          borderRadius: 8,
          marginVertical:20,
        }}
      />
      <Pressable
        style={styles.containerButton}
        onPress={handlePressIncrement}
      >
        <Title text='Aumentar' color={colors.shape} />
      </Pressable>
      <Pressable
        style={styles.containerButton}
        onPress={handlePressDecrement}
      >
        <Title text='Reduzir' color={colors.shape} />
      </Pressable>
      <Pressable
        style={styles.containerButton}
        onPress={handlePressClear}
      >
        <Title text='Zerar' color={colors.shape} />
      </Pressable>
    </View>
  );
}