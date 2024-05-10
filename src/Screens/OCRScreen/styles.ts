import { Dimensions, StyleSheet } from 'react-native';
import { colors } from '../../utils/theme';
const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    containerButton: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: colors.success,
        margin: 10,
        borderRadius: 8,
    },
    camera: {
        width: width,
        height: height - 30
    },
});
