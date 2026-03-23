import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import FormInput from "../components/FormInput";
import PrimaryButton from "../components/PrimaryButton";
import ScreenContainer from "../components/ScreenContainer";
import { addProduct } from "../slices/productSlice";
import { generateUniqueBarcode, normalizeBarcode } from "../utils/barcode";

export default function AddProductScreen({ navigation }) {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [barcode, setBarcode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const resetForm = () => {
    setName("");
    setPrice("");
    setQuantity("");
    setBarcode("");
  };

  const handleGenerateBarcode = () => {
    const generatedCode = generateUniqueBarcode(products);
    setBarcode(generatedCode);
    setErrorMessage("");
  };

  const handleSaveProduct = () => {
    const trimmedName = name.trim();
    const trimmedBarcode = normalizeBarcode(barcode);
    const parsedPrice = Number(price);
    const parsedQuantity = Number(quantity);

    if (!trimmedName || !price.trim() || !quantity.trim() || !trimmedBarcode) {
      setErrorMessage("All fields are required.");
      return;
    }

    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      setErrorMessage("Price must be a valid number greater than 0.");
      return;
    }

    if (
      Number.isNaN(parsedQuantity) ||
      !Number.isInteger(parsedQuantity) ||
      parsedQuantity < 0
    ) {
      setErrorMessage("Quantity must be a valid whole number (0 or greater).");
      return;
    }

    const duplicate = products.some(
      (product) => product.barcode.toLowerCase() === trimmedBarcode.toLowerCase()
    );

    if (duplicate) {
      setErrorMessage("Duplicate barcode detected. Use a unique barcode.");
      return;
    }

    dispatch(
      addProduct({
        id: `${trimmedBarcode}-${Date.now()}`,
        name: trimmedName,
        price: Number(parsedPrice.toFixed(2)),
        quantity: parsedQuantity,
        barcode: trimmedBarcode,
        createdAt: new Date().toISOString(),
      })
    );

    setErrorMessage("");
    resetForm();
    Alert.alert("Success", "Product added successfully.");
  };

  return (
    <ScreenContainer>
      <Text className="text-2xl font-bold text-slate-900">Add Product</Text>
      <Text className="mt-1 text-sm text-slate-600">
        Enter product details and save to inventory.
      </Text>

      <View className="mt-6 rounded-2xl bg-white p-4">
        <FormInput
          label="Product Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter product name"
        />
        <FormInput
          label="Price"
          value={price}
          onChangeText={setPrice}
          placeholder="Enter price"
          keyboardType="numeric"
        />
        <FormInput
          label="Quantity"
          value={quantity}
          onChangeText={setQuantity}
          placeholder="Enter quantity"
          keyboardType="number-pad"
        />
        <FormInput
          label="Barcode / QR Code"
          value={barcode}
          onChangeText={setBarcode}
          placeholder="Enter or generate barcode"
        />

        {errorMessage ? (
          <Text className="mb-3 text-sm font-medium text-red-500">{errorMessage}</Text>
        ) : null}

        <View className="gap-3">
          <PrimaryButton
            title="Auto Generate Barcode"
            variant="secondary"
            onPress={handleGenerateBarcode}
          />
          <PrimaryButton title="Save Product" onPress={handleSaveProduct} />
          <PrimaryButton
            title="View Product List"
            variant="secondary"
            onPress={() => navigation.navigate("Product List")}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}
