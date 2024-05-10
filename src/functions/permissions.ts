
import { Camera } from 'react-native-vision-camera';

export const checkPermissionCam = async () => {
    const camPermission = await Camera.requestCameraPermission()
    console.log('checkPermissionCam:', camPermission);
    return camPermission
}

export const checkPermissionMic = async () => {
    const microphonePermission = await Camera.requestMicrophonePermission()
    console.log('checkPermissionMic:', microphonePermission);
    return microphonePermission
}


