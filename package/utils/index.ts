export const round = (num: number, dec: number) => {
  const [sv, ev] = num.toString().split("e");
  return Number(
    Number(Math.round(parseFloat(sv + "e" + dec)) + "e-" + dec) +
      "e" +
      (ev || 0)
  );
};
