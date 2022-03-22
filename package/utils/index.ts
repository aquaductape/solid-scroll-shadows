export const round = (num: number, dec: number) => {
  const [sv, ev] = num.toString().split("e");
  return Number(
    Number(Math.round(parseFloat(sv + "e" + dec)) + "e-" + dec) +
      "e" +
      (ev || 0)
  );
};

export const parseUnit = (
  input: number | string | undefined,
  {
    reverseVal = false,
    unit = "px",
  }: { reverseVal?: boolean; unit?: "ms" | "px" } = {}
) => {
  if (typeof input === "string") {
    if (reverseVal) return `calc(${input} * -1)`;
    return input;
  }
  if (reverseVal) return `${input! * -1}${unit}`;
  return `${input}${unit}`;
};
