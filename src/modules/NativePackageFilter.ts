import { NativeModules } from 'react-native';
import {
  FilterTypes,
} from './@types/NativePackageFilter';

interface FilterProps {
  base64String: string;
  filter: FilterTypes;
}

interface PackageFilterModule {
  applyFilterToBase64: (data: string) => Promise<any>;
  applyFilterBlack: (data: string) => Promise<any>;
}

const { PackageFilterModule } = NativeModules;

export const applyFilterToBase64 = (data: string): Promise<any> => {
  return PackageFilterModule.applyFilterToBase64(data);
};

export const applyFilterBlack = (data: string): Promise<any> => {
  return PackageFilterModule.applyFilterBlack(data);
};

export default PackageFilterModule as PackageFilterModule;