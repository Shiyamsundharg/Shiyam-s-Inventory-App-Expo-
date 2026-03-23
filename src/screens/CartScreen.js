import React, { useMemo, useState } from "react";
import { Alert, ScrollView, Text, TextInput, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useDispatch, useSelector } from "react-redux";
import CartItemRow from "../components/CartItemRow";
import PrimaryButton from "../components/PrimaryButton";
import ScreenContainer from "../components/ScreenContainer";
import {
  addToCart,
  clearCart,
  decreaseCartQuantity,
  increaseCartQuantity,
  removeFromCart,
} from "../slices/cartSlice";
import { deductProductQuantity } from "../slices/productSlice";
import { normalizeBarcode } from "../utils/barcode";
import { formatINR } from "../utils/currency";

export default function CartScreen() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const cartItems = useSelector((state) => state.cart.items);

  const [manualBarcode, setManualBarcode] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState("error");
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannerLocked, setScannerLocked] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const getProductByBarcode = (barcode) =>
    products.find(
      (product) => product.barcode.toLowerCase() === barcode.toLowerCase()
    );

  const showFeedback = (message, type = "error") => {
    setFeedbackMessage(message);
    setFeedbackType(type);
  };

  const tryAddItemByBarcode = (barcodeValue) => {
    const cleanedBarcode = normalizeBarcode(barcodeValue);

    if (!cleanedBarcode) {
      showFeedback("Enter a barcode before adding.", "error");
      return;
    }

    const matchedProduct = getProductByBarcode(cleanedBarcode);

    if (!matchedProduct) {
      showFeedback("Invalid barcode. Product not found.", "error");
      return;
    }

    if (matchedProduct.quantity <= 0) {
      showFeedback(`${matchedProduct.name} is out of stock.`, "error");
      return;
    }

    const inCart = cartItems.find(
      (item) => item.barcode.toLowerCase() === matchedProduct.barcode.toLowerCase()
    );

    if (inCart && inCart.quantity >= matchedProduct.quantity) {
      showFeedback(
        `Only ${matchedProduct.quantity} unit(s) available for ${matchedProduct.name}.`,
        "error"
      );
      return;
    }

    dispatch(addToCart(matchedProduct));
    showFeedback(`${matchedProduct.name} added to cart.`, "success");
  };

  const handleManualAdd = () => {
    tryAddItemByBarcode(manualBarcode);
    setManualBarcode("");
  };

  const handleOpenScanner = async () => {
    const currentPermission = permission?.granted;

    if (!currentPermission) {
      const result = await requestPermission();

      if (!result.granted) {
        showFeedback("Camera permission denied. Enable it to scan products.", "error");
        return;
      }
    }

    setFeedbackMessage("");
    setScannerLocked(false);
    setScannerOpen(true);
  };

  const handleScannerRead = ({ data }) => {
    if (scannerLocked) {
      return;
    }

    setScannerLocked(true);
    setScannerOpen(false);
    tryAddItemByBarcode(data);
  };

  const handleIncrease = (item) => {
    const product = getProductByBarcode(item.barcode);

    if (!product || item.quantity >= product.quantity) {
      showFeedback(`No more stock available for ${item.name}.`, "error");
      return;
    }

    dispatch(increaseCartQuantity(item.barcode));
    setFeedbackMessage("");
  };

  const handleDecrease = (item) => {
    dispatch(decreaseCartQuantity(item.barcode));
    setFeedbackMessage("");
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert("Empty cart", "Add products to cart before checkout.");
      return;
    }

    const unavailableItem = cartItems.find((cartItem) => {
      const product = getProductByBarcode(cartItem.barcode);
      return !product || product.quantity < cartItem.quantity;
    });

    if (unavailableItem) {
      Alert.alert(
        "Stock issue",
        `Not enough stock for ${unavailableItem.name}. Please adjust cart quantities.`
      );
      return;
    }

    dispatch(deductProductQuantity(cartItems));
    dispatch(clearCart());
    showFeedback("Checkout complete. Inventory updated.", "success");
  };

  return (
    <ScreenContainer>
      <Text className="text-2xl font-bold text-slate-900">Billing / Cart</Text>
      <Text className="mt-1 text-sm text-slate-600">
        Add products by barcode, adjust quantity, and checkout.
      </Text>

      <View className="mt-5 rounded-2xl bg-white p-4">
        <Text className="text-sm font-semibold text-slate-800">Add by Barcode</Text>
        <TextInput
          value={manualBarcode}
          onChangeText={setManualBarcode}
          placeholder="Enter barcode"
          placeholderTextColor="#94a3b8"
          className="mt-3 rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900"
        />
        <View className="mt-3 gap-3">
          <PrimaryButton title="Add Product" onPress={handleManualAdd} />
          <PrimaryButton
            title={scannerOpen ? "Scanning..." : "Scan Barcode"}
            variant="secondary"
            onPress={handleOpenScanner}
          />
        </View>
      </View>

      {scannerOpen ? (
        <View className="mt-4 overflow-hidden rounded-2xl border border-slate-300 bg-black">
          <CameraView
            onBarcodeScanned={scannerLocked ? undefined : handleScannerRead}
            style={{ width: "100%", height: 260 }}
            barcodeScannerSettings={{
              barcodeTypes: [
                "aztec",
                "codabar",
                "code39",
                "code93",
                "code128",
                "datamatrix",
                "ean13",
                "ean8",
                "itf14",
                "pdf417",
                "qr",
                "upc_a",
                "upc_e",
              ],
            }}
          />
          <View className="p-3">
            <PrimaryButton
              title="Close Scanner"
              variant="secondary"
              onPress={() => setScannerOpen(false)}
            />
          </View>
        </View>
      ) : null}

      {feedbackMessage ? (
        <Text
          className={`mt-4 rounded-xl p-3 text-sm font-medium ${
            feedbackType === "success"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {feedbackMessage}
        </Text>
      ) : null}

      <View className="mt-5 rounded-2xl bg-white p-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-semibold text-slate-800">Cart Items</Text>
          <Text className="text-xs text-slate-500">{cartItems.length} product type(s)</Text>
        </View>

        {cartItems.length === 0 ? (
          <View className="mt-4 rounded-xl bg-slate-100 p-4">
            <Text className="text-sm text-slate-600">
              Your cart is empty. Add products manually or using scanner.
            </Text>
          </View>
        ) : (
          <ScrollView className="mt-4" nestedScrollEnabled>
            {cartItems.map((item) => (
              <CartItemRow
                key={item.barcode}
                item={item}
                onIncrease={() => handleIncrease(item)}
                onDecrease={() => handleDecrease(item)}
                onRemove={() => dispatch(removeFromCart(item.barcode))}
              />
            ))}
          </ScrollView>
        )}

        <View className="mt-4 border-t border-slate-200 pt-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-semibold text-slate-900">Grand Total</Text>
            <Text className="text-lg font-bold text-brand-700">{formatINR(cartTotal)}</Text>
          </View>

          <View className="mt-4 gap-3">
            <PrimaryButton title="Checkout" onPress={handleCheckout} />
            <PrimaryButton
              title="Clear Cart"
              variant="danger"
              onPress={() => dispatch(clearCart())}
              disabled={cartItems.length === 0}
            />
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}
