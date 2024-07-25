import React, { useState } from 'react';
import { Dimensions, Image, Pressable, ScrollView, View } from 'react-native';
import styles from './styles';
import { Title } from '../../components/Title';
import { colors } from '../../utils/theme';
import ImageBase64 from './data';
import DocumentPicker, { DocumentPickerResponse, isInProgress, types, } from 'react-native-document-picker';

import PackageFilterModule from '../../modules/NativePackageFilter';

export default function NativeAndroid() {
  const { height, width } = Dimensions.get('screen')
  const [image, setImage] = useState<string | null>(null);


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
      //const data = await applyFilter(uri)
      console.log('handleFilterPhoto:',);
    } catch (e) {
      console.error('handleFilterPhoto ERROR:', e);
    }
  };

  const handleFilterPhotoBase64 = async (base64: string) => {
    try {
      const data = await PackageFilterModule.applyFilterToBase64(base64)
      console.log('handleFilterPhotoBase64 request:', data);
      setImage(`data:image/jpeg;base64,${data}`)
    } catch (error) {
      console.error('handleFilterPhotoBase64:', error);
    }
  };

  const handleFilterPB = async () => {
    try {
      const data = await PackageFilterModule.applyFilterBlack(ImageBase64)
      //console.log('handleFilterPB:', data);
      setImage(`data:image/jpeg;base64,${data}`)
    } catch (error) {
      console.error('handleFilterPB ERROR=>>', error);
    }
  };

  const handleFilterTONSCINZA = async () => {
    try {
      const data = await PackageFilterModule.applyFilterToBase64(ImageBase64)
      //console.log('handleFilterTONSCINZA:', data);
      setImage(`data:image/jpeg;base64,${data}`)
    } catch (error) {
      console.error('handleFilterTONSCINZA ERROR=>>', error);
    }
  };

  return (
    <ScrollView style={{ flex: 1, }}>
{/*       <Pressable
        style={styles.containerButton}
        onPress={() => handleAddAttachment()}
      >
        <Title text='Buscar imagem na galeria' color={colors.shape} />
      </Pressable> */}

      <Image
        style={{ height: width -110,}}
        source={{ uri: `data:image/jpeg;base64,${ImageBase64}` }}
        resizeMode={'contain'}
      />

      {image != null &&
        <Image
          style={{ height: width -110 }}
          source={{ uri: image }}
          resizeMode={'contain'}
        />}
      <Pressable
        style={styles.containerButton}
        onPress={() => handleFilterPB()}
      >
        <Title text='Filtro P&B' color={colors.shape} />
      </Pressable>

      <Pressable
        style={styles.containerButton}
        onPress={() => handleFilterTONSCINZA()}
      >
        <Title text='Filtro Tons de cinza' color={colors.shape} />
      </Pressable>
{/* 
      <Pressable
        style={styles.containerButton}
        onPress={() => handleFilterPhotoBase64(`${ImageBase64}`)}
      >
        <Title text='Lista de filtros' color={colors.shape} />
      </Pressable> */}
    </ScrollView>
  );
}