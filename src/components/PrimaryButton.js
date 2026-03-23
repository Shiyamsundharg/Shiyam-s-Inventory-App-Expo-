import React from "react";
import { Pressable, Text } from "react-native";

const variantStyles = {
  primary: "bg-brand-500 active:bg-brand-700",
  secondary: "bg-slate-200 active:bg-slate-300",
  danger: "bg-red-500 active:bg-red-600",
};

const textVariantStyles = {
  primary: "text-white",
  secondary: "text-slate-800",
  danger: "text-white",
};

export default function PrimaryButton({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  className = "",
  textClassName = "",
}) {
  const containerClassName = disabled
    ? "rounded-xl px-4 py-3 items-center bg-slate-300"
    : `rounded-xl px-4 py-3 items-center ${variantStyles[variant]} ${className}`;

  const labelClassName = disabled
    ? "font-semibold text-slate-500"
    : `font-semibold ${textVariantStyles[variant]} ${textClassName}`;

  return (
    <Pressable onPress={onPress} disabled={disabled} className={containerClassName}>
      <Text className={labelClassName}>{title}</Text>
    </Pressable>
  );
}
