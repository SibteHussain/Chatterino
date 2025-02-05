import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import RootNavigator from './src/Navigators/RootNavigator';
import {Provider} from 'react-redux';
import store from './src/GlobalState/Store';
import firestore from '@react-native-firebase/firestore';
import PushNotification from 'react-native-push-notification';
import {Platform} from 'react-native';

function App(): React.JSX.Element {
  const createNotificationChannel = () => {
    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: 'default-channel-id',
          channelName: 'Default Channel',
          channelDescription: 'A default channel',
          soundName: 'default',
          importance: 4,
          vibrate: true,
        },
        created => console.log(`Notification channel created: ${created}`),
      );
    }
  };

  createNotificationChannel();
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .orderBy('createdAt', 'desc')
      .limit(1)
      .onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
          const message = doc.data();
          triggerNotification(message);
        });
      });
    const triggerNotification = (message: any) => {
      PushNotification.localNotification({
        channelId: 'default-channel-id',
        title: 'New Message',
        message: message.text || 'You have a new message',
      });
    };

    return () => unsubscribe();
  }, []);
  return (
    // <SafeAreaView style={backgroundStyle}>
    //   <StatusBar
    //     barStyle={isDarkMode ? 'light-content' : 'dark-content'}
    //     backgroundColor={backgroundStyle.backgroundColor}
    //   />
    //   <ScrollView
    //     contentInsetAdjustmentBehavior="automatic"
    //     style={backgroundStyle}>
    //     <Header />
    //     <View
    //       style={{
    //         backgroundColor: isDarkMode ? Colors.black : Colors.white,
    //       }}>
    //       <Section title="Step One">
    //         Edit <Text style={styles.highlight}>App.tsx</Text> to change this
    //         screen and then come back to see your edits.
    //       </Section>
    //       <Section title="See Your Changes">
    //         <ReloadInstructions />
    //       </Section>
    //       <Section title="Debug">
    //         <DebugInstructions />
    //       </Section>
    //       <Section title="Learn More">
    //         Read the docs to discover what to do next:
    //       </Section>
    //       <LearnMoreLinks />
    //     </View>
    //   </ScrollView>
    // </SafeAreaView>
    <NavigationContainer>
      <Provider store={store}>
        <RootNavigator />
      </Provider>
    </NavigationContainer>
  );
}

export default App;
