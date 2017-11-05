exports.getInt = function (min, max) {
  return Math.floor((Math.random() * ((max - min) + 1)) + min);
};

exports.getArrayElement = function (array) {
  if (array.length === 0) return null;

  return array[exports.getInt(0, array.length - 1)];
};
