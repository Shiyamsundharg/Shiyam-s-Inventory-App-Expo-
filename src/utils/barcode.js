export const normalizeBarcode = (value = "") => value.trim();

export const generateUniqueBarcode = (products = []) => {
  let generatedCode = "";
  let isDuplicate = true;

  while (isDuplicate) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    generatedCode = `INV-${timestamp}-${randomPart}`;

    isDuplicate = products.some(
      (product) =>
        product.barcode.toLowerCase() === generatedCode.toLowerCase()
    );
  }

  return generatedCode;
};
