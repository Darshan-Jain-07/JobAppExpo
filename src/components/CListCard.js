import { View, Text } from 'react-native';
import React, { useState } from 'react';
import { Avatar, Card, IconButton, Menu } from 'react-native-paper';
import CText from './CText';

const CListCard = ({title, subtitle, leftIcon, rightIcon, options = []}) => {
    const [visible, setVisible] = useState(false);

    const hideMenu = () => setVisible(false);
    const showMenu = () => setVisible(true);

    return (
        <Card.Title
            title={<CText fontSize={20} fontWeight={600}>{title}</CText>}
            subtitle={subtitle}
            left={(props) => <Avatar.Icon {...props} icon={leftIcon} />}
            right={(props) => (
                <>
                    {options.length ? <Menu
                        visible={visible}
                        onDismiss={hideMenu}
                        anchor={<IconButton {...props} icon={rightIcon} onPress={showMenu} />}
                    >
                        {options.map((d)=>{
                            return <Menu.Item onPress={d.optionOnPress} title={d.optionLabel} key={d.key} />
                        })}
                    </Menu> : ""}
                </>
            )}
        />
    )
}

export default CListCard;