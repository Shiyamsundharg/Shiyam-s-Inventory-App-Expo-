import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useSelector } from "react-redux";
import ScreenContainer from "../components/ScreenContainer";
import PrimaryButton from "../components/PrimaryButton";
import { normalizeBarcode } from "../utils/barcode";

export default function ScanProductScreen({ navigation }) {
  const products = useSelector((state) => state.products.products);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    const scannedCode = normalizeBarcode(data);

    const matchedProduct = products.find(
      (product) => product.barcode.toLowerCase() === scannedCode.toLowerCase()
    );

    if (matchedProduct) {
      setMessage(`Matched: ${matchedProduct.name}`);
      setMessageType("success");
      navigation.navigate("Product Details", { barcode: matchedProduct.barcode });
      return;
    }

    setMessage(`Invalid barcode: ${scannedCode}. Product not found.`);
    setMessageType("error");
  };

  if (!permission) {
    return (
      <ScreenContainer scroll={false}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563eb" />
          <Text className="mt-3 text-base text-slate-600">Requesting camera permission...</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (!permission.granted) {
    return (
      <ScreenContainer>
        <Text className="text-xl font-bold text-slate-900">Scan Product</Text>
        <Text className="mt-3 rounded-xl bg-red-100 p-4 text-sm text-red-600">
          Camera access is required to scan barcodes.
        </Text>
        <View className="mt-4">
          <PrimaryButton title="Grant Permission" onPress={requestPermission} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Text className="text-2xl font-bold text-slate-900">Scan Product</Text>
      <Text className="mt-1 text-sm text-slate-600">
        Point the camera to a barcode or QR code.
      </Text>

      <View className="mt-6 overflow-hidden rounded-2xl border border-slate-300 bg-black">
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{ width: "100%", height: 320 }}
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
      </View>

      {message ? (
        <Text
          className={`mt-4 rounded-xl p-3 text-sm font-medium ${
            messageType === "success"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {message}
        </Text>
      ) : null}

      <View className="mt-4 gap-3">
        <PrimaryButton
          title={scanned ? "Scan Again" : "Ready to Scan"}
          variant="secondary"
          onPress={() => {
            setScanned(false);
            setMessage("");
          }}
        />
        <PrimaryButton
          title="Go to Product List"
          variant="secondary"
          onPress={() => navigation.navigate("Product List")}
        />
      </View>
    </ScreenContainer>
  );
}
