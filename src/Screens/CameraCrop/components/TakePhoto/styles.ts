import { Dimensions, StyleSheet } from 'react-native';
import { colors } from '../../../../utils/theme';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        zIndex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    main: {
        position: 'absolute',
        width: width,
        height: height,
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    box: {
        width: '75%',
        height: width * 0.6,
        borderWidth: 6,
        borderColor: colors.success,
        alignSelf: 'center',
        alignContent: 'center',
        borderRadius: 8,
    },
    options: {
        position: 'absolute',
        zIndex: 3,
        paddingRight: 20,
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
});
