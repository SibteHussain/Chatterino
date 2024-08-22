/* eslint-disable react-native/no-inline-styles */
import React, {ReactNode} from 'react';
import {StatusBar, View, StyleSheet} from 'react-native';
import {widthPercentageToDP} from 'react-native-responsive-screen';

import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface WrapperProps {
  children: ReactNode;
  bgColor?: string;
  statusBgColor?: string;
}

const MainViewWrapper = ({children, bgColor, statusBgColor}: WrapperProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.mainContainer,
        {
          paddingTop: insets.top,
          backgroundColor: bgColor ? bgColor : '#F5F5F5',
        },
      ]}>
      <StatusBar
        animated={true}
        backgroundColor={statusBgColor ? statusBgColor : '#F5F5F5'}
        barStyle={'light-content'}
        showHideTransition={'slide'}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    flex: 1,
    justifyContent: 'flex-start',
    width: widthPercentageToDP('100'),
  },
});
export default MainViewWrapper;
