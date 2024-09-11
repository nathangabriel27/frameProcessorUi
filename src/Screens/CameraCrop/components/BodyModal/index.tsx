import React from 'react';
import { Image, Pressable, View } from 'react-native';

import styles from '../../styles';
import { Title } from '../../../../components/Title';
import { rotateImage } from 'vision-camera-cropper';

type Props = {
    actionCleanImage: () => void;
    actionNewImage: (image: string) => void
    imageData: string | undefined;
};

export const BodyModal = (({ actionCleanImage, actionNewImage, imageData }: Props) => {

    const rotateTakenImage = async () => {
        console.log("rotate")
        if (imageData) {
            console.log("hasimage")
            let rotated = await rotateImage(removeDataURLHead(imageData), 90);
            actionNewImage("data:image/jpeg;base64," + rotated);
        }
    }

    const removeDataURLHead = (dataURL: string) => {
        return dataURL.substring(dataURL.indexOf(",") + 1, dataURL.length);
    }

    const renderImage = () => {
        if (imageData != undefined) {
            return (
                <Image style={styles.srcImage}
                    source={{ uri: imageData }}
                />
            );
        }
        return null;
    }

    return (
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
                {renderImage()}
                <View style={styles.buttonView}>
                    <Pressable
                        style={[styles.button, styles.buttonInModal]}
                        onPress={() => actionCleanImage()}
                    >
                        <Title text='Rescan' />
                    </Pressable>
                    <Pressable
                        style={[styles.button, styles.buttonInModal]}
                        onPress={rotateTakenImage}
                    >
                        <Title text='Rotate' />
                    </Pressable>
                </View>
            </View>
        </View>
    )
})