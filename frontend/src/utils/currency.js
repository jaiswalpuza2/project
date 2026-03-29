
export const formatNPR = (amount) => {
  if (amount === undefined || amount === null) return "NRP 0";
  const converted = Math.round(amount * 133);
  return `NRP ${converted.toLocaleString()}`;
};

export const formatUSD = (amount) => {
  if (amount === undefined || amount === null) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};
