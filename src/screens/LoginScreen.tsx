import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Chat: { username: string };
};

type LoginScreenNavProp = StackNavigationProp<RootStackParamList, "Chat">;

interface Props {
  navigation: LoginScreenNavProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState("");

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter your name"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <Button
        title="Join Chat"
        onPress={() => navigation.navigate("Chat", { username })}
      />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 6 },
});
