import React from 'react';
import { View, Text } from 'react-native';
import { TrackPackageResult } from '../../../modules/@types/PackageTracker';
import { Title } from '../../../components/Title';
import { colors } from '../../../utils/theme';

interface PackageDetailsProps {
  data: TrackPackageResult;
}

export const PackageDetails = ({ data }: PackageDetailsProps) => {
  return (
    <View style={{ padding: 50, backgroundColor: colors.gray }}>
      <Title text={`${data?.request?.id} is.`} />
      {data?.status === 'moving' && <Title text={`${data?.distance / 1000}/km away'`} />}
      {data?.status === 'delivered' && <Title text={`Right by your door`} />}
    </View>
  );
};