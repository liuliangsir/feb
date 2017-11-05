const is = require('./is');
// const getRandomArrayElement = require('./random').getArrayElement;

function addSlash(path) {
  if (!/\/$/.test(path)) {
    return `${path}/`;
  }
  return path;
}

exports.getProtocol = function (protocol) {
  if (protocol === 'http' || protocol === 'https') {
    return `${protocol}:`;
  }
  return '';
};

exports.getPath = function (cdnPath) {
  if (is.Function(cdnPath)) {
    return addSlash(cdnPath.apply(null));
  } else if (is.Array(cdnPath)) {
    return addSlash(cdnPath[0]);
  }
  return addSlash(cdnPath);
};

exports.genCdnObj = function (cdn) {
  if (is.Object(cdn)) return cdn;
  if (is.Array(cdn)) return exports.genCdnObj(cdn[0]);
  const cdnSplitArray = cdn.split('//');

  // no protocol
  if (cdnSplitArray.length === 1) {
    return {
      protocol: 'auto',
      path: cdnSplitArray[0]
    };
  }

  // protocol
  let cdnProtocol = cdnSplitArray[0];
  if (!cdnProtocol) {
    cdnProtocol = 'auto';
  } else {
    cdnProtocol = cdnProtocol.replace(':', '');
  }

  return {
    protocol: cdnProtocol,
    path: cdnSplitArray[1]
  };
};
