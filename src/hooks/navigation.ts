import { useNavigation } from '@react-navigation/native';

import { StackNavigationProp } from '@react-navigation/stack';
import { AppRoutesParams } from '../routes/routes';


export function useAppNavigation() {
    const navigation = useNavigation<StackNavigationProp<AppRoutesParams>>();
    return navigation;
}
