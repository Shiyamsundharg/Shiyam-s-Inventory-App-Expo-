import React from "react";
import { Pressable, Text, View } from "react-native";
import { formatINR } from "../utils/currency";

export default function ProductCard({ product, onPress }) {
  const stockClass = product.quantity > 0 ? "text-emerald-600" : "text-red-500";

  return (
    <Pressable
      onPress={onPress}
      className="mb-3 rounded-2xl border border-slate-200 bg-white p-4 active:bg-slate-100"
    >
      <View className="flex-row items-start justify-between">
        <Text className="mr-3 flex-1 text-base font-semibold text-slate-900">
          {product.name}
        </Text>
        <Text className="text-base font-semibold text-brand-700">
          {formatINR(product.price)}
        </Text>
      </View>
      <Text className={`mt-2 text-sm font-medium ${stockClass}`}>
        Quantity: {product.quantity}
      </Text>
      <Text className="mt-1 text-xs text-slate-500">Barcode: {product.barcode}</Text>
    </Pressable>
  );
}
