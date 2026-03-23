import React from "react";
import { Image, ImageBackground, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";

const backgroundImage = require("../../assets/images/inventory-background.png");
const logoImage = require("../../assets/images/orange-s-logo.png");
const brandTitle = "SHiYAM's INVENTORY";

export default function OpeningSplashScreen() {
  return (
    <ImageBackground source={backgroundImage} resizeMode="cover" className="flex-1">
      <StatusBar style="light" />
      <View className="flex-1 items-center justify-center bg-[#031f3fd9] px-8">
        <Image source={logoImage} className="h-36 w-36" resizeMode="contain" />
        <Text className="mt-6 text-center text-4xl font-black tracking-wider text-white">
          {brandTitle}
        </Text>
      </View>
    </ImageBackground>
  );
}
