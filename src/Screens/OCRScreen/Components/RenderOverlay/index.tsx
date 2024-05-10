import React from 'react';
import { Dimensions, View, Text } from 'react-native';
/* import { OCRFrame } from 'vision-camera-ocr'; */

import { colors } from '../../../../utils/theme';
import { Title } from '../../../../components/Title';
/* 
type AndroidProps = {
    ocrData: OCRFrame;
    pixelRatio: number;
};
type IOSProps = {
    ocrData: OCRFrame;
    frameWidth: number;
    frameHeight: number;
}; */

const { width, height } = Dimensions.get('window');

export const RenderOverlayIOS = (({ ocrData, pixelRatio }: any) => {
    return (
        <>
          {/*   {ocrData?.result?.blocks.map((block, index) => {
                return (
                    <View
                        key={index}
                        style={{
                            position: 'absolute',
                            left: block.frame.x * pixelRatio,
                            top: block.frame.y * pixelRatio / 1.6,
                            backgroundColor: colors.shape,
                            borderRadius: 8,
                        }}
                    >
                        <Title text={block.text} fontSize={8} />
                    </View>
                );
            })}
        </>
    );
})

export const RenderOverlayAndroid = (({ ocrData, frameWidth, frameHeight }: any) => {
    return (
        <>
            {ocrData?.result?.blocks.map((block, index) => {
                return (
                    <View
                        key={index}
                        style={{
                            position: 'absolute',
                            left: (block.frame.x * (width / frameHeight)) - (block.frame.width / 2),
                            top: (block.frame.y * (height / frameWidth)) - (block.frame.height / 2),
                            backgroundColor: 'white',
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 10,
                                justifyContent: 'center',
                                textAlign: 'center',
                            }}
                        >
                            {block.text}
                        </Text>
                    </View>
                );
            })} */}
        </>
    );
})