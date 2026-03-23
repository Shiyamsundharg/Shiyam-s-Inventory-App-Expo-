import React from "react";
import { Image, Text, View } from "react-native";
import { useSelector } from "react-redux";
import ScreenContainer from "../components/ScreenContainer";
import PrimaryButton from "../components/PrimaryButton";
import { formatINR } from "../utils/currency";

const logoImage = require("../../assets/images/orange-s-logo.png");
const brandTitle = "SHiYAM's INVENTORY";

export default function HomeScreen({ navigation }) {
  const products = useSelector((state) => state.products.products);
  const cartItems = useSelector((state) => state.cart.items);

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const outOfStockCount = products.filter((product) => product.quantity === 0).length;
  const inventoryWorth = products.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );

  return (
    <ScreenContainer scroll={false}>
      <View className="flex-1">
        <View className="rounded-3xl border border-white/20 bg-black/35 p-4">
          <View className="flex-row items-center">
            <Image source={logoImage} className="h-16 w-16" resizeMode="contain" />
            <View className="ml-3 flex-1">
              <Text className="text-3xl font-black tracking-wide text-white">
                {brandTitle}
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-5 flex-row justify-between">
          <View className="mr-2 flex-1 rounded-2xl bg-white/95 p-4">
            <Text className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Products
            </Text>
            <Text className="mt-1 text-2xl font-bold text-slate-900">{products.length}</Text>
          </View>
          <View className="mx-1 flex-1 rounded-2xl bg-white/95 p-4">
            <Text className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Cart Items
            </Text>
            <Text className="mt-1 text-2xl font-bold text-slate-900">{totalCartItems}</Text>
          </View>
          <View className="ml-2 flex-1 rounded-2xl bg-white/95 p-4">
            <Text className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Out of Stock
            </Text>
            <Text className="mt-1 text-2xl font-bold text-red-500">{outOfStockCount}</Text>
          </View>
        </View>

        <View className="mt-3 rounded-2xl border border-emerald-300/40 bg-emerald-500/15 p-4">
          <Text className="text-xs uppercase tracking-wide text-emerald-100">
            Total Inventory Value
          </Text>
          <Text className="mt-1 text-2xl font-extrabold text-emerald-50">
            {formatINR(inventoryWorth)}
          </Text>
        </View>

        <View className="mt-6 gap-3">
          <PrimaryButton
            title="Add Product"
            onPress={() => navigation.navigate("Add Product")}
          />
          <PrimaryButton
            title="Product List"
            variant="secondary"
            onPress={() => navigation.navigate("Product List")}
          />
          <PrimaryButton
            title="Scan Product"
            variant="secondary"
            onPress={() => navigation.navigate("Scan")}
          />
          <PrimaryButton
            title="Billing / Cart"
            variant="secondary"
            onPress={() => navigation.navigate("Cart")}
          />
        </View>

        <Text className="mt-auto pb-2 text-center text-xs text-white/55">
          HAVE A good time while work
        </Text>
      </View>
    </ScreenContainer>
  );
}
