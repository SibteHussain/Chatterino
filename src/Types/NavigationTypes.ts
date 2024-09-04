import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

export type StackParamList = {
  Login: undefined;
  Main: undefined;
  Signup: undefined;
};

export type LoginScreenNavigationProp = StackNavigationProp<
  StackParamList,
  'Login'
>;

export type MainScreenRouteProp = RouteProp<StackParamList, 'Main'>;
