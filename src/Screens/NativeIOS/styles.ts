import { Dimensions, StyleSheet } from 'react-native';
import { colors } from '../../utils/theme';
const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        //alignItems: 'center',
        //justifyContent: 'center',


    },
    containerButton: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: colors.success,
        margin: 10,
        borderRadius: 8,
    },
    input: {
        backgroundColor: colors.gray,
        padding: 10,
        margin: 10,
        borderRadius:8,
        fontSize: 16,
    },
});
