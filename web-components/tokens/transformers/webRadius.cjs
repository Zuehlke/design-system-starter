const pxToRem = require('./pxToRem.cjs');

module.exports = {
  type: 'value',
  matcher: function (token) {
    return token.type === 'custom-radius'
  },
  transformer: function ({ value }, options) {
    if ([value.topRight, value.bottomLeft, value.bottomRight].every(v => v === value.topLeft)) {
      return pxToRem(value.topLeft, options)
    }
    return `${pxToRem(value.topLeft, options)} ${pxToRem(value.topRight, options)} ${pxToRem(value.bottomLeft, options)} ${pxToRem(value.bottomRight, options)}`
  }
}
