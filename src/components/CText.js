// import React from 'react';
// import { Text, StyleSheet } from 'react-native';
// import PropTypes from 'prop-types';

// const CText = ({ children, sx, textAlign = 'left', fontWeight, italics=false, fontSize, color }) => {
//     const styles = StyleSheet.create({
//         text: {
//             color: color || '#000',
//         },
//     });
//     let fontFamily;
//     switch (fontWeight) {
//         case 100:
//             fontFamily = !italics ? "Montserrat-Thin" : "Montserrat-ThinItalic";
//             break;
//         case 200:
//             fontFamily = !italics ? "Montserrat-ExtraLight" : "Montserrat-ExtraLightItalic";
//             break;
//         case 300:
//             fontFamily = !italics ? "Montserrat-Light" : "Montserrat-LightItalic";
//             break;
//         case 400:
//             fontFamily = !italics ? "Montserrat-Regular" : "Montserrat-MediumItalic";
//             break;
//         case 500:
//             fontFamily = !italics ? "Montserrat-Medium" : "Montserrat-MediumItalic";
//             break;
//         case 600:
//             fontFamily = !italics ? "Montserrat-SemiBold" : "Montserrat-SemiBoldItalic";
//             break;
//         case 700:
//             fontFamily = !italics ? "Montserrat-Bold" : "Montserrat-BoldItalic";
//             break;
//         case 800:
//             fontFamily = !italics ? "Montserrat-ExtraBold" : "Montserrat-ExtraBoldItalic";
//             break;
//         case 900:
//             fontFamily = !italics ? "Montserrat-Black" : "Montserrat-BlackItalic";
//             break;
//         default:
//             fontFamily = !italics ? "Montserrat-Regular" : "Montserrat-MediumItalic";
//             break;
//     }
//     return (
//         <Text style={[styles.text, { textAlign }, sx, { fontFamily: fontFamily, fontSize }]}>
//             {children}
//         </Text>
//     );
// };


// CText.propTypes = {
//     children: PropTypes.node.isRequired,
//     sx: PropTypes.oneOfType([
//         PropTypes.object,
//         PropTypes.array,
//     ]),
//     textAlign: PropTypes.oneOf(['left', 'center', 'right']),
//     fontWeight: PropTypes.oneOf([100,200,300,400,500,600,700,800,900]),
//     italics: PropTypes.bool,
//     fontSize: PropTypes.number,
// };

// export default CText;


import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { useFonts } from 'expo-font';
import { Montserrat_100Thin, Montserrat_200ExtraLight, Montserrat_300Light, Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold, Montserrat_800ExtraBold, Montserrat_900Black } from '@expo-google-fonts/montserrat';
import { ActivityIndicator } from 'react-native-paper';

const CText = ({ children, sx, textAlign = 'left', fontWeight, italics = false, fontSize, color }) => {
  // Load fonts
  const [fontsLoaded] = useFonts({
    Montserrat_100Thin,
    Montserrat_200ExtraLight,
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
    Montserrat_900Black,
  });

  // Check if fonts are loaded
  
  // if (!fontsLoaded) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignContent: "center" }}>
  //       <ActivityIndicator animating={true} color={"#000"} size={"large"} />
  //     </View>
  //   )
  // }

  // Determine font family based on fontWeight and italics
  let fontFamily;
  switch (fontWeight) {
    case 100:
      fontFamily = italics ? 'Montserrat_100Thin' : 'Montserrat_100Thin';
      break;
    case 200:
      fontFamily = italics ? 'Montserrat_200ExtraLight' : 'Montserrat_200ExtraLight';
      break;
    case 300:
      fontFamily = italics ? 'Montserrat_300Light' : 'Montserrat_300Light';
      break;
    case 400:
      fontFamily = italics ? 'Montserrat_400Regular' : 'Montserrat_400Regular';
      break;
    case 500:
      fontFamily = italics ? 'Montserrat_500Medium' : 'Montserrat_500Medium';
      break;
    case 600:
      fontFamily = italics ? 'Montserrat_600SemiBold' : 'Montserrat_600SemiBold';
      break;
    case 700:
      fontFamily = italics ? 'Montserrat_700Bold' : 'Montserrat_700Bold';
      break;
    case 800:
      fontFamily = italics ? 'Montserrat_800ExtraBold' : 'Montserrat_800ExtraBold';
      break;
    case 900:
      fontFamily = italics ? 'Montserrat_900Black' : 'Montserrat_900Black';
      break;
    default:
      fontFamily = italics ? 'Montserrat_400Regular' : 'Montserrat_400Regular';
      break;
  }

  return (
    <Text style={[styles.text, { textAlign, color, fontFamily, fontSize  }, sx, ]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#000',
  },
});

CText.propTypes = {
  children: PropTypes.node.isRequired,
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  textAlign: PropTypes.oneOf(['left', 'center', 'right']),
  fontWeight: PropTypes.oneOf([100, 200, 300, 400, 500, 600, 700, 800, 900]),
  italics: PropTypes.bool,
  fontSize: PropTypes.number,
  color: PropTypes.string,
};

export default CText;
