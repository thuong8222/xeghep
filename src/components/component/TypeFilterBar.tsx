import React, { useRef } from "react";
import {
  ScrollView,
  View,
  Dimensions,
  findNodeHandle,
  UIManager,

} from "react-native";
import QuickNoteButton from "./QuickNoteButton";
import { CONSTANT } from "../../utils/Helper";

const { width: screenWidth } = Dimensions.get("window");

type Props = {
  types: string[];
  selectedType: string | null;
  toggleFilter: (type: string) => void;
};

export default function TypeFilterBar({
  types,
  selectedType,
  toggleFilter,
}: Props) {
  const scrollRef = useRef<ScrollView | null>(null);
  const itemRefs = useRef<Record<string, View | null>>({});

  const handlePress = (type: string) => {
    toggleFilter(type);

    const item = itemRefs.current[type];
    const scrollViewNode = findNodeHandle(scrollRef.current);
    const itemNode = findNodeHandle(item);

    if (itemNode && scrollViewNode) {
      // Dùng UIManager.measureLayout để tương thích RN 0.80+
      UIManager.measureLayout(
        itemNode,
        scrollViewNode,
        (error) => console.log("❌ measureLayout error:", error),
        (x, _y, width) => {
          const scrollToX = x - screenWidth / 2 + width / 2;
          scrollRef.current?.scrollTo({ x: scrollToX, animated: true });
        }
      );
    }
  };

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        flexDirection: "row",
        alignItems: "center",
        columnGap: 12,
      
      }}
      style={{ height: 32 }}
    >
      {types.map((type, index) => {
        const label =
          CONSTANT.TRANSACTION_TYPE_BY_KEY[
            type as keyof typeof CONSTANT.TRANSACTION_TYPE_BY_KEY
          ] || type;
        const isActive = selectedType === type;

        return (
          <View key={index} ref={(el) => (itemRefs.current[type] = el)}>
            <QuickNoteButton
              label={label}
              isActive={isActive}
              onPress={() => handlePress(type)}
              fontStyle="normal"
            />
          </View>
        );
      })}
    </ScrollView>
  );
}
