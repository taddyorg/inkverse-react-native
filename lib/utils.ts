import { Linking } from 'react-native';

interface OpenURLProps {
  url: string;
}

interface OpenEmailProps {
  toAddress: string;
}

export async function openURL({ url }: OpenURLProps) {
  try {
    await Linking.openURL(url);
  } catch (error) {
    console.error('Error opening URL:', error);
  }
}

export async function openEmail({ toAddress }: OpenEmailProps) {
  try {
    await Linking.openURL(`mailto:${toAddress}`);
  } catch (error) {
    console.error('Error opening email:', error);
  }
} 