import React from 'react';
import styles from './styles';
import { Canvas, RoundedRect, Fill } from '@shopify/react-native-skia'
import { SharedValue } from 'react-native-reanimated';

interface Props {
    height: SharedValue<number>;
    width: SharedValue<number>;
    x: SharedValue<number>;
    y: SharedValue<number>;
}

export function BoxDelimiter({ height, width, x, y }: Props) {

    return (
        <Canvas style={styles.container}>
            <RoundedRect
                height={height}
                width={width}
                x={x}
                y={y}
                r={10}
                color={'rgba(69, 66, 228, 0.453)'}
            >
            </RoundedRect>
        </Canvas>
    );
}
