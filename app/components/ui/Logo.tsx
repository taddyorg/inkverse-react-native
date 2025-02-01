import React from 'react';
import { StyleSheet } from 'react-native';
import { Image } from 'expo-image';

export const Logo = () => {
  return (
    <Image 
      style={styles.logo} 
      source={require('../../../assets/images/inkverse-logo.png')}
    />
  )
}

const styles = StyleSheet.create({
  logo: {
    height: 42,
    width: 176,
  }
});