import { StyleSheet, Text, View,Modal,ActivityIndicator } from 'react-native'
import React from 'react'
import { Colors } from '../constants/theme'

export default function Loader({visible}) {
  return (
    <Modal visible={visible} transparent>
    <View style={styles.container}>
      <ActivityIndicator size='large'  color={Colors.orange}/>
    </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'rgba(0,0,0,0.4)',
        justifyContent:'center',
        alignItems:'center'
    },
})