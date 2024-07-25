package com.frameprocessorui

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Color
import android.util.Base64
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import java.io.ByteArrayOutputStream
import java.io.File

class PhotoFilterModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    
    override fun getName(): String {
        return "PhotoFilterModule"
    }

    @ReactMethod
    fun applyFilter(filePath: String, promise: Promise) {
        try {
            val imgFile = File(filePath)
            if (!imgFile.exists()) {
                promise.reject("File not found", "File at path $filePath does not exist")
                return
            }

            val bitmap = BitmapFactory.decodeFile(imgFile.absolutePath)
            val filteredBitmap = applyGrayscaleFilter(bitmap)
            val base64String = bitmapToBase64(filteredBitmap)
            
            promise.resolve(base64String)
        } catch (e: Exception) {
            promise.reject("[applyFilter] - Error applying filter", e)
        }
    }

    fun applyFilterToBase64(base64String: String, promise: Promise) {
        try {
            val decodedBytes = Base64.decode(base64String, Base64.DEFAULT)
            val bitmap = BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.size)
            val filteredBitmap = applyGrayscaleFilter(bitmap)
            val resultBase64String = bitmapToBase64(filteredBitmap)
            
            promise.resolve(resultBase64String)
        } catch (e: Exception) {
            promise.reject("[applyFilterToBase64] - Error applying filter", e)
        }
    }

    private fun applyGrayscaleFilter(original: Bitmap): Bitmap {
        val width = original.width
        val height = original.height
        val grayscaleBitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)

        for (x in 0 until width) {
            for (y in 0 until height) {
                val pixel = original.getPixel(x, y)
                val red = Color.red(pixel)
                val green = Color.green(pixel)
                val blue = Color.blue(pixel)
                val gray = (red + green + blue) / 3
                val newPixel = Color.rgb(gray, gray, gray)
                grayscaleBitmap.setPixel(x, y, newPixel)
            }
        }
        return grayscaleBitmap
    }

    private fun bitmapToBase64(bitmap: Bitmap): String {
        val byteArrayOutputStream = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream)
        val byteArray = byteArrayOutputStream.toByteArray()
        return Base64.encodeToString(byteArray, Base64.DEFAULT)
    }
}
