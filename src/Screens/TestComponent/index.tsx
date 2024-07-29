
import React, { useState } from 'react';
import { Button, SafeAreaView, } from 'react-native';
import { FilterSimple } from 'rn-image-filter-convert';

import styles from './styles';
import ImageBase64 from '../NativeAndroid/data';

export default function TestComponent() {
  const [loading, setLoading] = useState(false);

  const applyFilter = async () => {

    try {
      const response = await FilterSimple({ data: ImageBase64, filter: 'blackAndWhite' });
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <Button
        disabled={loading}
        onPress={applyFilter}
        title="HandleFilter"
      />
    </SafeAreaView>
  );
}
