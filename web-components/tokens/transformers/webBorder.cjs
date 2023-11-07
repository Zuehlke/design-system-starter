module.exports = {
  type: 'value',
  matcher: function (token) {
    return token.type === 'custom-stroke';
  },
  transformer: ({value: {weight}}) => {
    return `${weight}px`;
  },
};
