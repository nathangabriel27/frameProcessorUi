import { NativeModules } from 'react-native';

const { PhotoFilterModule } = NativeModules;

export const applyFilter = async (filePath: string) => {
  try {
   // const base64String = await PhotoFilterModule.applyFilter(filePath);
   // console.log('Base64 Image:', base64String);
  } catch (error) {
    console.error('Error applying filter:', error);
  }
};

export const applyFilterToBase64 = async (base64String: string) => {
  try {
    const base = base64String
   // const filteredBase64String = await PhotoFilterModule.applyFilterToBase64(base);
    //console.log('Filtered Base64 Image:', filteredBase64String);
  } catch (error) {
    console.error('Error filter:', error);
  }
};
