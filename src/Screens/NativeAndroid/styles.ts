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
        width: width - 50,
        backgroundColor: colors.success,
        marginHorizontal: 10,
        padding: 20,
        borderRadius: 8,
    },
});
