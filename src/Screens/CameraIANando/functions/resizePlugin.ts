import { Frame } from 'react-native-vision-camera';

// Cache array to prevent it from being constantly allocated
const CACHE_ID = '__cachedArrayForResizer';
interface Cache {
  [key: string]: Float32Array | undefined;
}
var global: any;

function getArrayFromCache(size: number): Float32Array {
  'worklet';

  const cache: Cache = global[CACHE_ID] || {};
  if (cache[CACHE_ID] == null || cache[CACHE_ID]?.length !== size) {
    cache[CACHE_ID] = new Float32Array(size);
    global[CACHE_ID] = cache;
  }

  return cache[CACHE_ID]!;
}
/**
 * Resizes the given Frame to the given target width and height.
 * For 1920x1080 BGRA -> 192x192 RGB Frames, this takes roughly 5ms on an iPhone 11 Pro.
 */
export function resizePlugin(frame: Frame, width: number, height: number): Float32Array {
  'worklet';

  const inputBytesPerRow = frame.bytesPerRow;
  const inputWidth = frame.width;
  const inputHeight = frame.height;
  const inputPixelSize = Math.floor(inputBytesPerRow / inputWidth); // 4 for BGRA
  const padding = inputBytesPerRow - inputWidth * inputPixelSize; // on some frames there's additional padding

  const targetWidth = width;
  const targetHeight = height;
  const targetPixelSize = 3; // 3 for RGB

  const arrayData = new Uint8Array(frame.toArrayBuffer()); // Converta para Uint8Array para permitir indexação

  const outputFrame = getArrayFromCache(targetWidth * targetHeight * targetPixelSize);

  for (let y = 0; y < targetHeight; y++) {
    for (let x = 0; x < targetWidth; x++) {
      // Map destination pixel position to source pixel
      const srcX = Math.floor((x / targetWidth) * (inputWidth + padding));
      const srcY = Math.floor((y / targetHeight) * inputHeight);

      // Compute the source and destination index
      const srcIndex = (srcY * (inputWidth + padding) + srcX) * inputPixelSize;
      const destIndex = (y * targetWidth + x) * targetPixelSize; // 3 for RGB

      // Convert from BGRA to RGB
      outputFrame[destIndex] = arrayData[srcIndex + 2]; // R
      outputFrame[destIndex + 1] = arrayData[srcIndex + 1]; // G
      outputFrame[destIndex + 2] = arrayData[srcIndex]; // B
    }
  }

  return outputFrame;
}