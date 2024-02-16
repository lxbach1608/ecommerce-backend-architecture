const _ = require("lodash");

const getInfoData = ({ obj = {}, fields = [] }) => {
  return _.pick(obj, fields);
};

module.exports = {
  getInfoData,
};
