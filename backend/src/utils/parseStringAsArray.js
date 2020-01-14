module.exports = function parseStringAsArray(arreyAsString) {
  return arreyAsString.split(",").map(tech => tech.trim());
};
