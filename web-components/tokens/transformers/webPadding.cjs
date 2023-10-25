const pxToRem = require('./pxToRem.cjs');

module.exports = {
  type: 'value',
  matcher: function (token) {
    return token.type === 'custom-spacing'
  },
  transformer: ({ value: { top, left, bottom, right } }) => {
    if ([bottom, left, right].every(v => v === top)) {
      return pxToRem(top)
    }
    return `${pxToRem(top)} ${pxToRem(right)} ${pxToRem(bottom)} ${pxToRem(left)}`;
  }
}
