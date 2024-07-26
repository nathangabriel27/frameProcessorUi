import { NativeModules } from 'react-native';
import {
  FilterProps,
  FilterPropsResponse
} from './@types/NativePackageFilter';

interface PackageFilterModule {
  FilterSimple: (data: FilterProps) => Promise<FilterPropsResponse>;
}

const { PackageFilterModule } = NativeModules;

export const FilterSimple = (data: FilterProps): Promise<FilterPropsResponse> => {
  return PackageFilterModule.FilterSimple(data);
};

export default PackageFilterModule as PackageFilterModule;