
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

export const checkPermissionCam = async () => {
    console.log('Check permission');
    const camPermission = await Camera.requestCameraPermission()
    const microphonePermission = await Camera.requestMicrophonePermission()
}


