import { VisionCameraProxy, Frame } from 'react-native-vision-camera';

// Definição do tipo para os resultados da detecção
export type DetectionBox = {
  detected_class: string; // Nome da classe detectada
  detected_boxes: number[]; // Coordenadas da caixa delimitadora no formato [x1, y1, x2, y2]
  detected_score: number;   // Pontuação de confiança da detecção
};

export type DetectionResult = {
  success: boolean;               // Indica se a detecção foi bem-sucedida
  message: string;                // Mensagem de erro ou sucesso (não opcional)
  detections: DetectionBox[];     // Lista de objetos de detecção (não opcional, mas pode ser uma lista vazia)
};

const plugin = VisionCameraProxy.initFrameProcessorPlugin('DocumentDetect', { model: 'fast' });

export function DocumentDetect(frame: Frame): DetectionResult | any {
  'worklet'
  if (!plugin) {
    console.log("Failed to load Frame Processor Plugin!");
    throw new Error("Failed to load Frame Processor Plugin!");
  }

  return plugin.call(frame);
}