import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import io from 'socket.io-client';

const ChatScreen = ({ route }) => {
    const { userId } = route.params;
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);

    const renderMessageImage = (props) => {
        return <Image source={{ uri: props.currentMessage.image }} style={{ width: 200, height: 200 }} />;
      };
      const renderMessageDocument = (props) => {
        return (
          <TouchableOpacity onPress={() => Linking.openURL(props.currentMessage.document)}>
            <Text>{props.currentMessage.text}</Text>
          </TouchableOpacity>
        );
      };      

    useEffect(() => {
        // Connect to the socket server
        const socketInstance = io('http://192.168.5.45:3001');
        setSocket(socketInstance);

        // Join the specific chat room (userId)
        socketInstance.emit('join', userId);

        // Listen for incoming messages
        socketInstance.on('message', (message) => {
            setMessages((previousMessages) => GiftedChat.append(previousMessages, message));
        });

        return () => {
            socketInstance.disconnect();
        };
    }, [userId]);

    const onSend = (newMessages = []) => {
        // Send the new message to the server
        socket.emit('sendMessage', newMessages[0]);
        setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
    };

    const handleImagePick = () => {
        launchImageLibrary({ mediaType: 'photo', includeBase64: true }, (response) => {
            if (response.didCancel) return;
            const { uri, base64 } = response.assets[0];

            // Create a message with image
            const imageMessage = {
                _id: Math.random().toString(36).substring(7), // Unique message ID
                text: '', // Empty text for the image
                createdAt: new Date(),
                user: {
                    _id: userId,
                },
                image: uri, // URI of the image
                base64, // Base64 encoded string of the image (optional)
            };

            // Emit the image message
            socket.emit('sendMessage', imageMessage);
            setMessages((previousMessages) => GiftedChat.append(previousMessages, [imageMessage]));
        });
    };
    const handleDocumentPick = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });

            const documentMessage = {
                _id: Math.random().toString(36).substring(7),
                text: res.name, // Document name
                createdAt: new Date(),
                user: {
                    _id: userId,
                },
                document: res.uri, // URI of the document
            };

            // Emit the document message
            socket.emit('sendMessage', documentMessage);
            setMessages((previousMessages) => GiftedChat.append(previousMessages, [documentMessage]));
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('User canceled the picker');
            } else {
                throw err;
            }
        }
    };

    const renderCustomActions = () => (
        <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={handleImagePick}>
                <Text style={{ fontSize: 20, margin: 10 }}>📷</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDocumentPick}>
                <Text style={{ fontSize: 20, margin: 10 }}>📄</Text>
            </TouchableOpacity>
        </View>
    );


    return (
        <View style={{ flex: 1 }}>
            <GiftedChat
                messages={messages}
                onSend={onSend}
                user={{
                    _id: userId, // the current logged-in user id
                }}
                renderMessageDocument={renderMessageDocument}
                renderMessageImage={renderMessageImage}
                renderInputToolbar={(props) => (
                    <InputToolbar {...props} renderActions={renderCustomActions} />
                )}
            />
        </View>
    );
};

export default ChatScreen;
