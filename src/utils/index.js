const _ = require("lodash");

const getInfoData = ({ obj = {}, fields = [] }) => {
  return _.pick(obj, fields);
};

const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = {
  getInfoData,
  asyncHandler,
};
