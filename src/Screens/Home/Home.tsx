import React from 'react';
import {
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Button,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const Home: React.FC = () => {
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [email, setEmail] = React.useState<string>('');
  const navigation = useNavigation();

  // Function to get user ID by email from Firestore
  const getUserByEmail = async (email: string): Promise<string | null> => {
    try {
      const usersRef = firestore().collection('users');
      const snapshot = await usersRef.where('email', '==', email).get();
      if (!snapshot.empty) {
        const userData = snapshot.docs[0].data();
        return userData.uid;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error retrieving user data:', error);
      return null;
    }
  };

  const handleSubmitEmail = async (): Promise<void> => {
    try {
      const userId = await getUserByEmail(email);

      if (userId) {
        navigation.navigate('Chat', {userId});
      } else {
        // Email does not exist in Firestore
        Alert.alert(
          'Email Not Found',
          'No account is associated with this email.',
        );
      }
    } catch (error) {
      console.error('Error checking email:', error);
      Alert.alert('Error', 'There was an error checking the email.');
    } finally {
      handleCloseModal();
    }
  };

  const handleOpenModal = (): void => {
    setModalVisible(true);
  };

  const handleCloseModal = (): void => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Button title="Start a new chat" onPress={handleOpenModal} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmitEmail}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseModal}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 15,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
  },
  closeButtonText: {
    color: '#0066cc',
  },
});

export default Home;
