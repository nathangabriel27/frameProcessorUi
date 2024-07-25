import React, { useState } from 'react';
import { Dimensions, Image, Pressable, View } from 'react-native';
import styles from './styles';
import { Title } from '../../components/Title';
import { colors } from '../../utils/theme';
import ImageBase64 from './data';
import DocumentPicker, { DocumentPickerResponse, isInProgress, types, } from 'react-native-document-picker';
import { applyFilter, applyFilterToBase64 } from '../../modules/FilterNativeModule';

export default function NativeAndroid() {
  const { height, width } = Dimensions.get('screen')
  const [image, setImage] = useState<string>('null');


  async function handleAddAttachment() {
    try {
      const pickerResult: DocumentPickerResponse = await DocumentPicker.pickSingle({
        allowMultiSelection: false,
        presentationStyle: 'fullScreen',
        type: [types.images],
        copyTo: 'documentDirectory'
      });
      console.log('pickerResult:=>', pickerResult);
      handleFilterPhoto(pickerResult.uri)
    } catch (e) {
      console.error('handleAddAttachment ERROR:', e);
    }
  }

  const handleFilterPhoto = async (uri: string) => {
    try {
      const data = await applyFilter(uri)
      console.log('handleFilterPhoto:', data);
    } catch (e) {
      console.error('handleFilterPhoto ERROR:', e);
    }
  };

  const handleFilterPhotoBase64 = async (base64: string) => {
    try {
      const data = await applyFilterToBase64(base64)
      console.log('handleFilterPhotoBase64:', data);
    } catch (error) {
      console.error('handleFilterPhotoBase64:', error);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Image
        style={{ height: width / 2, width: width / 2 }}
        source={{ uri: `data:image/jpeg;base64,${ImageBase64}` }}
        resizeMode={'contain'}
      />
      <Pressable
        style={styles.containerButton}
        onPress={() => handleFilterPhotoBase64(`data:image/jpeg;base64,${ImageBase64}`)}
      >
        <Title text='Filtro P&B' color={colors.shape} />
      </Pressable>
      <Pressable
        style={styles.containerButton}
        onPress={() => handleAddAttachment()}
      >
        <Title text='Buscar imagem na galeria' color={colors.shape} />
      </Pressable>
    </View>
  );
}