import React from "react";
import { ImageBackground, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const backgroundImage = require("../../assets/images/inventory-background.png");

export default function ScreenContainer({ children, scroll = true, className = "" }) {
  if (!scroll) {
    return (
      <SafeAreaView className={`flex-1 ${className}`}>
        <ImageBackground source={backgroundImage} resizeMode="cover" className="flex-1">
          <View className="flex-1 bg-[#031f3fbf] px-4 py-4">{children}</View>
        </ImageBackground>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${className}`}>
      <ImageBackground source={backgroundImage} resizeMode="cover" className="flex-1">
        <View className="flex-1 bg-[#031f3fbf]">
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 }}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
