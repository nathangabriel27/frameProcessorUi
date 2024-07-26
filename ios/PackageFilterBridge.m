//
//  PackageFilterBridge.m
//  frameProcessorUi
//
//  Created by Nathan Gabriel Oliveira on 26/07/24.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(PackageFilterModule, NSObject)

RCT_EXTERN_METHOD(applyFilterBlack:(NSString)base64 resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(applyFilterToBase64:(NSString)base64 resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

@end
