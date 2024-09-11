import React from 'react';
import { Pressable, View } from 'react-native';
import styles from '../../styles';
import { Title } from '../../../../components/Title';

type Props = {
    action: () => void;
};

export const TakePhoto = (({ action }: Props) => {
    return (
        <View style={styles.control}>
            <View style={styles.shutter}>
                <Pressable
                    style={styles.camera}
                    onPressIn={() => console.log("on press in take Photo")}
                    onPressOut={action} // Ação para tirar a foto
                >
                    <Title text='TIRAR FOTO' />
                </Pressable>
            </View>
        </View>
    )
})