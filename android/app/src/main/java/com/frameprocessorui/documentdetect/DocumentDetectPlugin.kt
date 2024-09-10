package com.frameprocessorui.documentdetect

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.YuvImage
import android.media.Image
import android.util.Log
import com.mrousavy.camera.frameprocessors.Frame
import com.mrousavy.camera.frameprocessors.FrameProcessorPlugin
import com.mrousavy.camera.frameprocessors.VisionCameraProxy
import org.tensorflow.lite.Interpreter
import org.tensorflow.lite.support.common.FileUtil
import java.io.ByteArrayOutputStream
import java.io.IOException
import java.nio.ByteBuffer
import java.nio.ByteOrder
import android.graphics.ImageFormat
import android.graphics.Rect

class DocumentDetectPlugin(proxy: VisionCameraProxy, options: Map<String, Any>?) : FrameProcessorPlugin() {

    private var interpreter: Interpreter? = null

    init {
        createInterpreter(proxy.context)
    }

    private fun createInterpreter(context: Context) {
        val tfLiteOptions = Interpreter.Options()
        interpreter = try {
            getInterpreter(context, TFLITE_MODEL_NAME, tfLiteOptions)
        } catch (e: IOException) {
            Log.e("DocumentDetectPlugin", "Erro ao carregar o modelo TFLite: ${e.message}")
            null
        }
    }

    private fun getInterpreter(context: Context, modelName: String, tfLiteOptions: Interpreter.Options): Interpreter {
        return Interpreter(FileUtil.loadMappedFile(context, modelName), tfLiteOptions)
    }

    override fun callback(frame: Frame, arguments: Map<String, Any>?): Map<String, Any> {
        val image: Image? = frame.image
        if (image == null) {
            Log.e("Erro", "Imagem não encontrada no Frame.")
            return mapOf(
                "success" to false,
                "message" to "Imagem não encontrada no Frame.",
                 "detections" to emptyList<Any>()
            )
        }

        // Converter Image para Bitmap
        val bitmap: Bitmap? = try {
            imageToBitmap(image)
        } catch (e: Exception) {
            Log.e("Erro", "Falha ao converter Image para Bitmap: ${e.message}")
            return mapOf(
                "success" to false,
                "message" to "Falha ao converter Image para Bitmap.",
                 "detections" to emptyList<Any>()
            )
        }

        if (bitmap == null) {
            return mapOf(
                "success" to false,
                "message" to "Bitmap é nulo após conversão.",
                 "detections" to emptyList<Any>()
            )
        }

        // Redimensionar bitmap para 320x320
        val scaledBitmap = Bitmap.createScaledBitmap(bitmap, 320, 320, true)

        // Converter Bitmap redimensionado para ByteBuffer
        val inputByteBuffer = convertBitmapToByteBuffer(scaledBitmap)

        // Inicializar arrays de saída com formas corretas
        val detectedBoxes = Array(64) { FloatArray(4) }
        val detectedClasses = LongArray(64)
        val detectedScores = FloatArray(64)

        // Mapa de saídas para o modelo TFLite
        val outputMap = mapOf(
            0 to detectedBoxes,
            1 to detectedClasses,
            2 to detectedScores
        )

        // Executar o modelo
        interpreter?.runForMultipleInputsOutputs(arrayOf(inputByteBuffer), outputMap)

        // Processar resultados da inferência e retornar os resultados
        return processInferenceResults(detectedBoxes, detectedClasses, detectedScores)
    }

    private fun processInferenceResults(
        boxes: Array<FloatArray>,
        detectedClasses: LongArray,
        scores: FloatArray
    ): Map<String, Any> {
        val classes = arrayOf(
            "CNH - FRENTE",
            "CNH - VERSO",
            "RG - FRENTE",
            "RG - VERSO",
            "RG NOVO - FRENTE",
            "RG NOVO - VERSO"
        )

        val results = mutableListOf<Map<String, Any>>()

        for (i in scores.indices) {
            val score = scores[i]
            if (score > 0.5) { // Filtrar apenas detecções com confiança maior que um certo limiar
                val detectedClassIndex = detectedClasses[i].toInt()
                val detectedClassName = if (detectedClassIndex in classes.indices) classes[detectedClassIndex] else "Unknown"
                val box = boxes[i].map { it.toDouble() }

                val result = mapOf(
                    "detected_class" to detectedClassName,
                    "detected_boxes" to box,
                    "detected_score" to score.toDouble()
                )

                results.add(result)
            }
        }

        return mapOf(
            "success" to true,
            "message" to "", // Sempre retorna um valor, mesmo que seja null
            "detections" to results.ifEmpty { emptyList<Any>() }  // Garante que o campo esteja definido
        )
    }

    private fun convertBitmapToByteBuffer(bitmap: Bitmap): ByteBuffer {
        val inputImage = ByteBuffer.allocateDirect(1 * 320 * 320 * 3 * 4)
        inputImage.order(ByteOrder.nativeOrder())
        inputImage.rewind()

        val intValues = IntArray(320 * 320)
        bitmap.getPixels(intValues, 0, 320, 0, 0, 320, 320)

        for (pixelValue in intValues) {
            val r = (pixelValue shr 16 and 0xFF).toFloat()
            val g = (pixelValue shr 8 and 0xFF).toFloat()
            val b = (pixelValue and 0xFF).toFloat()

            inputImage.putFloat(r)
            inputImage.putFloat(g)
            inputImage.putFloat(b)
        }

        return inputImage
    }

    private fun imageToBitmap(image: Image): Bitmap? {
        return try {
            when (image.format) {
                ImageFormat.JPEG -> {
                    val buffer = image.planes[0].buffer
                    val bytes = ByteArray(buffer.remaining())
                    buffer.get(bytes)
                    BitmapFactory.decodeByteArray(bytes, 0, bytes.size)
                }
                ImageFormat.YUV_420_888 -> {
                    val yBuffer = image.planes[0].buffer
                    val uBuffer = image.planes[1].buffer
                    val vBuffer = image.planes[2].buffer

                    val ySize = yBuffer.remaining()
                    val uSize = uBuffer.remaining()
                    val vSize = vBuffer.remaining()

                    val nv21 = ByteArray(ySize + uSize + vSize)

                    yBuffer.get(nv21, 0, ySize)
                    vBuffer.get(nv21, ySize, vSize)
                    uBuffer.get(nv21, ySize + vSize, uSize)

                    val yuvImage = YuvImage(nv21, ImageFormat.NV21, image.width, image.height, null)
                    val out = ByteArrayOutputStream()
                    yuvImage.compressToJpeg(Rect(0, 0, yuvImage.width, yuvImage.height), 100, out)
                    val imageBytes = out.toByteArray()

                    BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.size)
                }
                else -> {
                    Log.e("Erro", "Formato de imagem não suportado: ${image.format}")
                    null
                }
            }
        } catch (e: Exception) {
            Log.e("Erro", "Erro ao converter Image para Bitmap: ${e.message}")
            null
        }
    }

    companion object {
        const val TFLITE_MODEL_NAME = "model.tflite"
    }
}