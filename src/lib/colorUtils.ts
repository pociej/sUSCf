// Utility to adjust the lightness of a hex color
// amount > 0 = lighten, amount < 0 = darken
export function adjustColorLightness(hex: string, amount: number): string {
  let col = hex.replace("#", "");
  if (col.length === 3) {
    col = col
      .split("")
      .map((x) => x + x)
      .join("");
  }
  const num = parseInt(col, 16);
  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0x00ff) + amount;
  let b = (num & 0x0000ff) + amount;
  r = Math.max(Math.min(255, r), 0);
  g = Math.max(Math.min(255, g), 0);
  b = Math.max(Math.min(255, b), 0);
  return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
}
