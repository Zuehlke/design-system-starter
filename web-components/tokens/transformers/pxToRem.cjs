module.exports = (tokenValue, options) => {
  const basePxFontSize = (options && options.basePxFontSize) || 16;
  const value = parseFloat(tokenValue);
  if (isNaN(value)) return tokenValue;
  return `${value / basePxFontSize}rem`;
}
