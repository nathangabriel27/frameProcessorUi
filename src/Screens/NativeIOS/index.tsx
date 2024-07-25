
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';

import { PackageDetails } from './components/PackageDetails';
import PackageTracker, { TrackPackageResult } from '../../modules/@types/PackageTracker';
import styles from './styles';

export default function NativeIOS() {
  const [packageId, setPackageId] = useState('WS1');
  const [verificationCode, setVerificationCode] = useState('WSROCKS');
  const [loading, setLoading] = useState(false);

  const [packageInfo, setPackageInfo] = useState<TrackPackageResult>({} as TrackPackageResult);

  const handleTrackPackage = async () => {
    try {
      setLoading(true);
      const data = await PackageTracker.track({ id: packageId, verificationCode });
      setPackageInfo(data);
      console.log('Response Module Native', data);
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Package Id"
        value={packageId}
        onChangeText={setPackageId}
      />
      <TextInput
        style={styles.input}
        placeholder="Verification Code"
        value={verificationCode}
        onChangeText={setVerificationCode}
      />

      <Button
        disabled={loading}
        onPress={handleTrackPackage}
        title="Track Package"
      />

      {loading && <ActivityIndicator />}

      {packageInfo && <PackageDetails data={packageInfo} />}
    </SafeAreaView>
  );
}
