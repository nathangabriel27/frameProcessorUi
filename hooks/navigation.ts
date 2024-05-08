import { useNavigation } from '@react-navigation/native';


import {
    AppRoutesParams,
} from '../routes/routes';
import { StackNavigationProp } from '@react-navigation/stack';



export function useAppNavigation() {
    const navigation = useNavigation<StackNavigationProp<AppRoutesParams>>();
    return navigation;
}
