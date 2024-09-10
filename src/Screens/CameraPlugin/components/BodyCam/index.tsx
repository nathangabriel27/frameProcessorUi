import React from 'react';
import { Platform, View } from 'react-native';
import Animated, { SharedValue, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import styles from './styles';
import { ISharedValue } from 'react-native-worklets-core';

type Props = {
    borderDetectValue: boolean;
    rightValue: number;
    leftValue: number;
    topValue: number;
    bottomValue: number;
    rightAndroid: SharedValue<number>;
    isObjectDetected: boolean;
};

export type OptionsDetectorCam = 'face' | 'ocr' | 'border';

export const BodyCam = (({borderDetectValue, rightValue, leftValue, topValue, bottomValue, rightAndroid, isObjectDetected }: Props) => {

    const valueTop = useSharedValue<number>(0);
    const valueBottom = useSharedValue<number>(0);
    const valueLeft = useSharedValue<number>(0);
    const valueRight = useSharedValue<number>(0);

    valueTop.value = rightValue
    valueBottom.value = leftValue
    valueLeft.value = topValue
    valueRight.value = bottomValue

    const boxOverlayStyle = useAnimatedStyle(() => ({
        position: 'absolute',
        borderWidth: 3,
        borderColor: isObjectDetected ? 'green' : 'red',
        top: valueTop.value,
        bottom: valueBottom.value,
        left: valueLeft.value,
        right: valueRight.value,
        zIndex: 100,
    }), [rightAndroid]);

    return (
        <View style={styles.container}>

            <View style={styles.main}>
                {borderDetectValue && (
                    Platform.OS === 'ios'
                        ? <View style={[styles.box, { borderColor: 'green' , borderStyle:  'solid'}]} />
                        : <Animated.View style={boxOverlayStyle} />
                )}
            </View>

        </View>
    )
})