import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ColorsGlobal } from "../base/Colors/ColorsGlobal";
import { ViewStyle } from "react-native/types_generated/index";



interface ButtonSubmitProps {
  title?: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  colorBackground?: string;
  colorText?: string;
  height?: ViewStyle['height'];
}

const ButtonSubmit: React.FC<ButtonSubmitProps> = ({
  title,height=48,
  onPress,
  isLoading = false,
  disabled = false,
  colorBackground = ColorsGlobal.main,
  colorText = "#fff",
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.buttonInner,
{  backgroundColor: ColorsGlobal.main,height:height}
      ]}
      onPress={!isLoading && !disabled ? onPress : undefined}
      disabled={isLoading || disabled}
    >

      <View style={styles.content}>
        {isLoading && <ActivityIndicator color={colorText} size="small" />}

        <Text style={[styles.textInner, { color: colorText }]}>{title}</Text>
      </View>


    </TouchableOpacity>
  );
};

export default ButtonSubmit;

const styles = StyleSheet.create({
  buttonInner: {

    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  
   
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  
  },
  textInner: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});
