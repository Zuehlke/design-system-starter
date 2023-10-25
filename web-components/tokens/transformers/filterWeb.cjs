const acceptedTypes = ['color', 'dimension', 'font', 'number', 'custom-radius', 'custom-fontStyle', 'custom-shadow', 'custom-gradient']

module.exports = (token) => !token.type || acceptedTypes.includes(token.type)
