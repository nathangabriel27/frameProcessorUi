//
//  PackageTrackerModule.m
//  frameProcessorUi
//
//  Created by Nathan Gabriel Oliveira on 26/07/24.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(PackageTrackerModule, NSObject)

RCT_EXTERN_METHOD(track: (NSDictionary)data resolver: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject)

@end
