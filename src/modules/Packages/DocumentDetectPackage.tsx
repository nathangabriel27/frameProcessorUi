import { VisionCameraProxy, Frame } from 'react-native-vision-camera'

const plugin = VisionCameraProxy.initFrameProcessorPlugin('DocumentDetect', { model: 'fast' })

export function DocumentDetect(frame: Frame) {
  'worklet'
  if (plugin == null) {
    throw new Error("Failed to load Frame Processor Plugin!")
  }
  return plugin.call(frame)
}