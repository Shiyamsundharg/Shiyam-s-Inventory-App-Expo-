import React from "react";
import { Pressable, Text, View } from "react-native";
import { formatINR } from "../utils/currency";

export default function CartItemRow({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <View className="mb-3 rounded-2xl border border-slate-200 bg-white p-4">
      <View className="flex-row items-center justify-between">
        <Text className="mr-2 flex-1 text-base font-semibold text-slate-900">{item.name}</Text>
        <Text className="text-sm font-medium text-slate-600">{formatINR(item.price)} each</Text>
      </View>

      <Text className="mt-1 text-xs text-slate-500">Barcode: {item.barcode}</Text>

      <View className="mt-4 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Pressable
            onPress={onDecrease}
            className="h-9 w-9 items-center justify-center rounded-lg bg-slate-200 active:bg-slate-300"
          >
            <Text className="text-lg font-semibold text-slate-700">-</Text>
          </Pressable>
          <Text className="mx-3 min-w-8 text-center text-base font-semibold text-slate-800">
            {item.quantity}
          </Text>
          <Pressable
            onPress={onIncrease}
            className="h-9 w-9 items-center justify-center rounded-lg bg-brand-500 active:bg-brand-700"
          >
            <Text className="text-lg font-semibold text-white">+</Text>
          </Pressable>
        </View>

        <View className="items-end">
          <Text className="text-sm font-semibold text-slate-900">
            {formatINR(item.quantity * item.price)}
          </Text>
          <Pressable onPress={onRemove}>
            <Text className="mt-1 text-xs font-medium text-red-500">Remove</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
