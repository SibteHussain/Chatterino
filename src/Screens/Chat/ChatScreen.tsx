import React, {useState, useEffect, FC} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

interface Message {
  id: string;
  text: string;
  createdAt: FirebaseFirestore.Timestamp;
  userId: string;
}

const ChatScreen: FC<{route: {params: {userId: string}}}> = ({route}) => {
  const {userId} = route.params;
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .where('users', 'array-contains', auth().currentUser?.uid)
      .onSnapshot(snapshot => {
        const fetchedMessages: Message[] = [];
        snapshot.forEach(doc => {
          fetchedMessages.push({id: doc.id, ...doc.data()} as Message);
        });
        setMessages(fetchedMessages);
      });

    return () => unsubscribe();
  }, []);

  const handleSend = async () => {
    if (message.trim().length > 0) {
      await firestore()
        .collection('chats')
        .add({
          text: message,
          createdAt: firestore.FieldValue.serverTimestamp(),
          userId: auth().currentUser?.uid,
          users: [auth().currentUser?.uid, userId],
        });
      setMessage('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.button} onPress={handleSend}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  messageContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
  },
});

export default ChatScreen;
