import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ColorsGlobal } from "../base/Colors/ColorsGlobal";

interface ButtonSubmitProps {
  title?: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  colorBackground?: string;
  colorText?: string;
}

const ButtonSubmit: React.FC<ButtonSubmitProps> = ({
  title = "XÁC NHẬN",
  onPress,
  isLoading = false,
  disabled = false,
  colorBackground = ColorsGlobal.main || "#007927",
  colorText = "#fff",
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.buttonInner,
        {
          backgroundColor: disabled
            ? "#B0B0B0"
            : isLoading
            ? "#6da87b"
            : colorBackground,
        },
      ]}
      onPress={!isLoading && !disabled ? onPress : undefined}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <View style={styles.content}>
          <ActivityIndicator color={colorText} size="small" />
          <Text style={[styles.textInner, { color: colorText, marginLeft: 10 }]}>
            ĐANG XỬ LÝ...
          </Text>
        </View>
      ) : (
        <Text style={[styles.textInner, { color: colorText }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default ButtonSubmit;

const styles = StyleSheet.create({
  buttonInner: {
    height: 48,
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
    fontWeight: "bold",
    textAlign: "center",
  },
});
