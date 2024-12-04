import React from 'react';
import { Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const CText = ({ children, sx, textAlign = 'left', fontWeight, italics=false, fontSize, color }) => {
    const styles = StyleSheet.create({
        text: {
            color: color || '#000',
        },
    });
    let fontFamily;
    switch (fontWeight) {
        case 100:
            fontFamily = !italics ? "Montserrat-Thin" : "Montserrat-ThinItalic";
            break;
        case 200:
            fontFamily = !italics ? "Montserrat-ExtraLight" : "Montserrat-ExtraLightItalic";
            break;
        case 300:
            fontFamily = !italics ? "Montserrat-Light" : "Montserrat-LightItalic";
            break;
        case 400:
            fontFamily = !italics ? "Montserrat-Regular" : "Montserrat-MediumItalic";
            break;
        case 500:
            fontFamily = !italics ? "Montserrat-Medium" : "Montserrat-MediumItalic";
            break;
        case 600:
            fontFamily = !italics ? "Montserrat-SemiBold" : "Montserrat-SemiBoldItalic";
            break;
        case 700:
            fontFamily = !italics ? "Montserrat-Bold" : "Montserrat-BoldItalic";
            break;
        case 800:
            fontFamily = !italics ? "Montserrat-ExtraBold" : "Montserrat-ExtraBoldItalic";
            break;
        case 900:
            fontFamily = !italics ? "Montserrat-Black" : "Montserrat-BlackItalic";
            break;
        default:
            fontFamily = !italics ? "Montserrat-Regular" : "Montserrat-MediumItalic";
            break;
    }
    return (
        <Text style={[styles.text, { textAlign }, sx, { fontFamily: fontFamily, fontSize }]}>
            {children}
        </Text>
    );
};


CText.propTypes = {
    children: PropTypes.node.isRequired,
    sx: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
    ]),
    textAlign: PropTypes.oneOf(['left', 'center', 'right']),
    fontWeight: PropTypes.oneOf([100,200,300,400,500,600,700,800,900]),
    italics: PropTypes.bool,
    fontSize: PropTypes.number,
};

export default CText;
