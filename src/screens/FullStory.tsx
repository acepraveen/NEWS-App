import {useRoute} from '@react-navigation/native';
import React  from 'react';
import {ActivityIndicator, Modal,  View} from 'react-native';
import {WebView} from 'react-native-webview';
import { Colors } from '../constants/theme';

// ...
export default function FullStory() {
  let props = useRoute();

  return (
    <WebView
      source={{uri: props?.params?.url}}
      style={{flex: 1}}
      startInLoadingState={true}
      renderLoading={() => (
        <Modal visible={true} transparent>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size='large' color={Colors.orange} />
        </View>
        </Modal>
      )}
    />
  );
}
