//
//  PackageFilterModule.swift
//  frameProcessorUi
//
//  Created by Nathan Gabriel Oliveira on 26/07/24.
//

import Foundation
import UIKit

@objc(PackageFilterModule)
class PackageFilterModule: NSObject {
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
  
  @objc
  func applyFilterBlack(_ base64: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let image = decodeBase64ToImage(base64) else {
      reject("ERROR", "Invalid base64 string", nil)
      return
    }
    let filteredImage = applyBlackAndWhiteFilter(image: image)
    let base64String = encodeImageToBase64(image: filteredImage)
    resolve(base64String)
  }
  
  @objc
  func applyFilterToBase64(_ base64: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let image = decodeBase64ToImage(base64) else {
      reject("ERROR", "Invalid base64 string", nil)
      return
    }
    let filteredImage = applyGrayscaleFilter(image: image)
    let base64String = encodeImageToBase64(image: filteredImage)
    resolve(base64String)
  }
  
  private func decodeBase64ToImage(_ base64: String) -> UIImage? {
    guard let data = Data(base64Encoded: base64) else { return nil }
    return UIImage(data: data)
  }
  
  private func encodeImageToBase64(image: UIImage) -> String {
    guard let imageData = image.jpegData(compressionQuality: 1.0) else { return "" }
    return imageData.base64EncodedString()
  }
  
  private func applyBlackAndWhiteFilter(image: UIImage) -> UIImage {
    let context = CIContext(options: nil)
    let filter = CIFilter(name: "CIPhotoEffectMono")
    let ciImage = CIImage(image: image)
    filter?.setValue(ciImage, forKey: kCIInputImageKey)
    guard let outputImage = filter?.outputImage else { return image }
    guard let cgImage = context.createCGImage(outputImage, from: outputImage.extent) else { return image }
    return UIImage(cgImage: cgImage)
  }
  
  private func applyGrayscaleFilter(image: UIImage) -> UIImage {
    let context = CIContext(options: nil)
    let filter = CIFilter(name: "CIPhotoEffectTonal")
    let ciImage = CIImage(image: image)
    filter?.setValue(ciImage, forKey: kCIInputImageKey)
    guard let outputImage = filter?.outputImage else { return image }
    guard let cgImage = context.createCGImage(outputImage, from: outputImage.extent) else { return image }
    return UIImage(cgImage: cgImage)
  }
}
