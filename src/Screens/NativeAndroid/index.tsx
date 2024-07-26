import React, { useState } from 'react';
import { Dimensions, Image, Pressable, ScrollView } from 'react-native';
import styles from './styles';
import { Title } from '../../components/Title';
import { colors } from '../../utils/theme';
import ImageBase64 from './data';
import { FilterSimple } from '../../modules/NativePackageFilter';


export default function NativeAndroid() {
  const { height, width } = Dimensions.get('screen')
  const [image, setImage] = useState<string | null>(null);
  const [filterSelect, setFilterSelect] = useState<string | null>(null);

  const handleFilterPB = async () => {
    try {
      const data = await FilterSimple({data: ImageBase64, filter: 'blackAndWhite'})
      //console.log('handleFilterPB:', data);
      setImage(`data:image/jpeg;base64,${data.uri}`)
    } catch (error) {
      console.error('handleFilterPB ERROR=>>', error);
    }
  };

  const handleFilterTONSCINZA = async () => {
    try {
      const data = await FilterSimple({data: ImageBase64, filter: 'shadesGray'})
      //console.log('handleFilterTONSCINZA:', data);
      setImage(`data:image/jpeg;base64,${data.uri}`)
    } catch (error) {
      console.error('handleFilterTONSCINZA ERROR=>>', error);
    }
  };

  return (
    <ScrollView style={{ flex: 1, }}>

      <Image
        style={{ height: width - 110, }}
        source={{ uri: `data:image/jpeg;base64,${ImageBase64}` }}
        resizeMode={'contain'}
      />

      {image != null &&
        <Image
          style={{ height: width - 110 }}
          source={{ uri: image }}
          resizeMode={'contain'}
        />}

      <Title text={`Filtro : ${filterSelect === null ? 'Sem filtro' : filterSelect}`} textAlign='center' />

      <Pressable
        style={styles.containerButton}
        onPress={() => handleFilterPB()}
        onPressOut={() => setFilterSelect('Preto e branco')}
      >
        <Title text='Filtro P&B' color={colors.shape} />
      </Pressable>

      <Pressable
        style={styles.containerButton}
        onPress={() => handleFilterTONSCINZA()}
        onPressOut={() => setFilterSelect('Tons de cinza')}
      >
        <Title text='Filtro Tons de cinza' color={colors.shape} />
      </Pressable>
    </ScrollView>
  );
}