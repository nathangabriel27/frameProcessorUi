import { Dimensions, StyleSheet } from 'react-native';
import { colors } from '../../utils/theme';
const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      shutter: {
        width: Dimensions.get("window").height * 0.1,
        height: Dimensions.get("window").height * 0.1,
      },
      camera: {
        backgroundColor: colors.success,
        padding: 20,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
      },
      control: {
        flexDirection: "row",
        position: 'absolute',
        bottom: 0,
        borderColor: "white",
        borderWidth: 0.1,
        justifyContent: 'center',
      },
      centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: colors.blackOpacity,
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
       
      },
      buttonView: {
        flexDirection: 'row',
      },
      button: {
        borderRadius: 20,
        padding: 10,
        margin: 5
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
      },
      srcImage: {
        width: Dimensions.get("window").width * 0.8,
        height: 200,
        resizeMode: "contain"
      },
      buttonInModal: {
        backgroundColor: "#2196F3",
      },
});
