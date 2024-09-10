import VisionCamera
import TensorFlowLite

@objc(DocumentDetectFrameProcessor)
public class DocumentDetectFrameProcessor: FrameProcessorPlugin {
    private var interpreter: Interpreter?

    // Função para inicializar o interpretador e carregar o modelo .tflite
  func initializeInterpreter() -> [String: String] {
      let functionName = "initializeInterpreter"
      
      guard let modelPath = Bundle.main.path(forResource: "model", ofType: "tflite") else {
          return [functionName: "Failed to load model file"]
      }

      do {
          let interpreter = try Interpreter(modelPath: modelPath)
          try interpreter.allocateTensors()
          self.interpreter = interpreter
          return [functionName: "Model loaded and tensors allocated successfully"]
      } catch {
          return [functionName: "Failed to create interpreter: \(error.localizedDescription)"]
      }
  }

  func extractPixelBuffer(from frame: Frame) -> CVPixelBuffer? {
      // Tenta extrair o CVPixelBuffer do CMSampleBuffer
      guard let pixelBuffer = CMSampleBufferGetImageBuffer(frame.buffer) else {
          return nil
      }

      // Sucesso na extração do CVPixelBuffer
      return pixelBuffer
  }

  func convertPixelBufferToInputTensor(_ pixelBuffer: CVPixelBuffer) -> Data? {
      let width = 320
      let height = 320

      // Bloqueia o endereço base do buffer
      CVPixelBufferLockBaseAddress(pixelBuffer, .readOnly)
      defer { CVPixelBufferUnlockBaseAddress(pixelBuffer, .readOnly) }

      guard let baseAddress = CVPixelBufferGetBaseAddress(pixelBuffer) else {
          return nil
      }

      let bytesPerRow = CVPixelBufferGetBytesPerRow(pixelBuffer)
      var inputData = Data(capacity: width * height * 3 * MemoryLayout<Float>.size)

      for y in 0..<height {
          let rowPointer = baseAddress.advanced(by: y * bytesPerRow).assumingMemoryBound(to: UInt8.self)
          for x in 0..<width {
              let pixelOffset = x * 4

              // Extraindo os valores RGB como Float
              var r = Float(rowPointer[pixelOffset]) / 255.0
              var g = Float(rowPointer[pixelOffset + 1]) / 255.0
              var b = Float(rowPointer[pixelOffset + 2]) / 255.0

              // Adicionando os valores ao Data de forma segura
              withUnsafeBytes(of: &r) { inputData.append(contentsOf: $0) }
              withUnsafeBytes(of: &g) { inputData.append(contentsOf: $0) }
              withUnsafeBytes(of: &b) { inputData.append(contentsOf: $0) }
          }
      }

      return inputData
  }
  
  func runInference(with inputData: Data) -> [String: Any] {
      let functionName = "runInference"
      
      guard let interpreter = interpreter else {
          return [functionName: "Interpreter not initialized"]
      }

      // Verifique o tamanho dos dados
      print("Tamanho de inputData: \(inputData.count)") // Esperado: 1,228,800 bytes

      do {
          // Tentar copiar os dados para o tensor de entrada
          do {
              try interpreter.copy(inputData, toInputAt: 0)
          } catch {
              print("Erro ao copiar dados para o tensor de entrada: \(error)")
              return [functionName: "Erro ao copiar dados: \(error.localizedDescription)"]
          }

          // Executa a inferência
          try interpreter.invoke()

          // Obtém as saídas do modelo
          let outputTensorBoxes = try interpreter.output(at: 0)
          let outputTensorClasses = try interpreter.output(at: 1)
          let outputTensorScores = try interpreter.output(at: 2)

          // Extraindo os resultados como arrays de Float32 ou Int64, conforme apropriado
          let boxes: [Float32] = outputTensorBoxes.data.toArray(type: Float32.self)
          let classes: [Int64] = outputTensorClasses.data.toArray(type: Int64.self)
          let scores: [Float32] = outputTensorScores.data.toArray(type: Float32.self)

          return [
              functionName: "Inference executed successfully",
              "boxes": boxes,
              "classes": classes,
              "scores": scores
          ]
      } catch {
          print("Erro ao executar a inferência: \(error)")
          return [functionName: "Failed to run inference: \(error.localizedDescription)"]
      }
  }
  
  public override func callback(_ frame: Frame, withArguments arguments: [AnyHashable : Any]?) -> Any? {
      var results: [String: Any] = [:]

      // Passo 1: Inicializar o interpretador
        let initResult = initializeInterpreter()
        results.merge(initResult) { (_, new) in new }

      // Passo 2: Extrair o CVPixelBuffer do frame
        if let pixelBuffer = extractPixelBuffer(from: frame) {
          
      // Passo 3: Converter o CVPixelBuffer para o formato esperado pelo modelo
        guard let inputData = convertPixelBufferToInputTensor(pixelBuffer) else {
          results["convertPixelBufferToInputTensor"] = "Failed to convert CVPixelBuffer to input tensor"
            return results
          }
          results["convertPixelBufferToInputTensor"] = "Input tensor created successfully"

      // Passo 4: Executar a inferência no modelo
        let inferenceResult = runInference(with: inputData)
        results.merge(inferenceResult) { (_, new) in new }
      } else {
        results["extractPixelBuffer"] = "Failed to extract CVPixelBuffer"
      }

      // Retornar o objeto finalizado com todos os resultados
      return results
  }

}

extension Data {
    func toArray<T>(type: T.Type) -> [T] {
        let count = self.count / MemoryLayout<T>.stride
        return self.withUnsafeBytes {
            Array(UnsafeBufferPointer<T>(start: $0.baseAddress!.assumingMemoryBound(to: T.self), count: count))
        }
    }
}
