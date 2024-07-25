import { NativeModules } from 'react-native';
import {
  FilterTypes,
} from './@types/NativePackageFilter';

export interface FilterProps {
  base64String: string;
  filter: FilterTypes;
}

export interface PackageFilterModule {
  applyFilterToBase64: (data: string) => Promise<any>;
  applyFilterBlack: (data: string) => Promise<any>;
}

export default NativeModules.PackageFilterModule as PackageFilterModule;
