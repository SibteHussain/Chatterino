import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {setUUID} from '../../GlobalState/UserSlice';
import {StackParamList} from '../../Types/NavigationTypes.ts';

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<StackParamList>>();
  const dispatch = useDispatch();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async () => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      const user = userCredential.user;
      if (user) {
        const userId = user.uid;
        dispatch(setUUID(userId));
        Alert.alert('Success', 'You are logged in!');
        navigation.reset({
          index: 0,
          routes: [{name: 'Main'}],
        });
        navigation.navigate('Main');
      }
    } catch (error: any) {
      if (error.code === 'auth/invalid-email') {
        Alert.alert('Error', 'That email address is invalid!');
      } else if (error.code === 'auth/user-not-found') {
        Alert.alert('Error', 'No user found with that email.');
      } else if (error.code === 'auth/wrong-password') {
        Alert.alert('Error', 'Wrong password.');
      } else {
        Alert.alert('Error', error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={'#000000'}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={'#000000'}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    textAlign: 'center',
    color: '#000000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#fff',
    color: '#000000',
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default LoginScreen;
