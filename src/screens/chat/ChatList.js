import React from 'react';
import { View, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const ChatList = () => {
  const navigation = useNavigation();

  const users = [
    { id: 'user1', name: 'User One', avatar: 'https://i.pravatar.cc/300?img=1' },
    { id: 'user2', name: 'User Two', avatar: 'https://i.pravatar.cc/300?img=2' },
    { id: 'user3', name: 'User Three', avatar: 'https://i.pravatar.cc/300?img=3' },
    { id: 'user4', name: 'User Four', avatar: 'https://i.pravatar.cc/300?img=4' },
  ]; // This should ideally be fetched from the backend

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.cardContainer}
            onPress={() => navigation.navigate('Chat', { userId: item.id })}>
            <Card style={styles.card}>
              <View style={styles.cardContent}>
                <Avatar.Image size={50} source={{ uri: item.avatar }} />
                <View style={styles.textContainer}>
                  <Text style={styles.userName}>{item.name}</Text>
                  <Text style={styles.lastMessage}>Last message here...</Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 20,
    textAlign: 'center',
  },
  cardContainer: {
    marginBottom: 5,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3, // Adds shadow on Android
  },
  card: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 15,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  lastMessage: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
});

export default ChatList;
