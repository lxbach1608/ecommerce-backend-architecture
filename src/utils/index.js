const _ = require('lodash');
const crypto = require('crypto');

const getInfoData = ({ obj = {}, fields = [] }) => {
  return _.pick(obj, fields);
};

const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

const cryptoGenerateKeyPair = () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
  });

  // easier
  // const publicKey = crypto.randomBytes(64).toString('hex');
  // const privateKey = crypto.randomBytes(64).toString('hex');

  return { publicKey, privateKey };
};

module.exports = {
  getInfoData,
  asyncHandler,
  cryptoGenerateKeyPair,
};
