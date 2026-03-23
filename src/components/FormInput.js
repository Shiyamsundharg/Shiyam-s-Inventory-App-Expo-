import React from "react";
import { Text, TextInput, View } from "react-native";

export default function FormInput({ label, error, className = "", ...inputProps }) {
  return (
    <View className={`mb-4 ${className}`}>
      <Text className="mb-2 text-sm font-medium text-slate-700">{label}</Text>
      <TextInput
        {...inputProps}
        className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900"
        placeholderTextColor="#94a3b8"
      />
      {error ? <Text className="mt-1 text-xs text-red-500">{error}</Text> : null}
    </View>
  );
}
