import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome'; // Icons
import CText from './CText';


function CChip({ icon, text}) {
    return (
        <View style={styles.chip}>
            { icon && <Icon name={icon} size={14} color="#333" />}
            <CText style={styles.chipText}>{text}</CText>
        </View>
    )
}

const styles = StyleSheet.create({
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 20,
      marginRight: 8,
      marginBottom: 8,
      gap:5
    },
    chipText: {
      color: '#333',
      fontSize: 14,
      marginLeft: 6,
    },
  });

export default CChip
