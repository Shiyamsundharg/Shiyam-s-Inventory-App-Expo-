import React from "react";
import { Alert, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import PrimaryButton from "../components/PrimaryButton";
import ScreenContainer from "../components/ScreenContainer";
import { addToCart } from "../slices/cartSlice";
import { formatINR } from "../utils/currency";

export default function ProductDetailsScreen({ route, navigation }) {
  const { barcode } = route.params || {};
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const cartItems = useSelector((state) => state.cart.items);

  const product = products.find(
    (item) => item.barcode.toLowerCase() === String(barcode || "").toLowerCase()
  );

  if (!product) {
    return (
      <ScreenContainer>
        <Text className="text-xl font-bold text-slate-900">Product not found</Text>
        <Text className="mt-2 text-sm text-slate-600">
          The scanned or selected product does not exist in inventory.
        </Text>
        <View className="mt-4">
          <PrimaryButton
            title="Back to Product List"
            onPress={() => navigation.navigate("Product List")}
          />
        </View>
      </ScreenContainer>
    );
  }

  const cartQuantity =
    cartItems.find(
      (item) => item.barcode.toLowerCase() === product.barcode.toLowerCase()
    )?.quantity || 0;

  const handleAddToCart = () => {
    if (product.quantity <= 0) {
      Alert.alert("Out of stock", `${product.name} is currently out of stock.`);
      return;
    }

    if (cartQuantity >= product.quantity) {
      Alert.alert(
        "Stock limit reached",
        `Only ${product.quantity} unit(s) available for ${product.name}.`
      );
      return;
    }

    dispatch(addToCart(product));
    Alert.alert("Added", `${product.name} has been added to cart.`);
  };

  return (
    <ScreenContainer>
      <Text className="text-2xl font-bold text-slate-900">Product Details</Text>

      <View className="mt-6 rounded-2xl bg-white p-5">
        <Text className="text-lg font-semibold text-slate-900">{product.name}</Text>
        <Text className="mt-2 text-base text-brand-700">{formatINR(product.price)}</Text>
        <Text
          className={`mt-2 text-sm font-medium ${
            product.quantity > 0 ? "text-emerald-600" : "text-red-500"
          }`}
        >
          Stock: {product.quantity}
        </Text>
        <Text className="mt-1 text-xs text-slate-500">Barcode: {product.barcode}</Text>
      </View>

      <View className="mt-4 gap-3">
        <PrimaryButton title="Add to Cart" onPress={handleAddToCart} />
        <PrimaryButton
          title="Open Cart"
          variant="secondary"
          onPress={() => navigation.navigate("Cart")}
        />
      </View>
    </ScreenContainer>
  );
}
