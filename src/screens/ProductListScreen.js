import React, { useMemo, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import { useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";
import ScreenContainer from "../components/ScreenContainer";

export default function ProductListScreen({ navigation }) {
  const products = useSelector((state) => state.products.products);
  const [searchText, setSearchText] = useState("");

  const filteredProducts = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) {
      return products;
    }

    return products.filter((product) => {
      const nameMatch = product.name.toLowerCase().includes(query);
      const barcodeMatch = product.barcode.toLowerCase().includes(query);
      return nameMatch || barcodeMatch;
    });
  }, [products, searchText]);

  return (
    <ScreenContainer scroll={false}>
      <View>
        <Text className="text-2xl font-bold text-white">Product List</Text>
        <Text className="mt-1 text-sm text-slate-200">
          Search by product name or barcode.
        </Text>
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search products..."
          placeholderTextColor="#94a3b8"
          className="mt-4 rounded-xl border border-slate-300 bg-white/95 px-4 py-3 text-slate-900"
        />
        <Text className="mt-2 text-xs text-slate-300">
          Showing {filteredProducts.length} of {products.length} product(s)
        </Text>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 24, flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate("Product Details", { barcode: item.barcode })}
          />
        )}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center rounded-2xl bg-white/95 p-6">
            <Text className="text-base font-semibold text-slate-800">No products found</Text>
            <Text className="mt-1 text-center text-sm text-slate-500">
              Add products or clear the search to view all inventory.
            </Text>
          </View>
        }
      />
    </ScreenContainer>
  );
}
