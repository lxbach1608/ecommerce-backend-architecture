const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "Apikeys";
const DOCUMENT_NAME = "Apikey";

const ApiKey = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      required: true,
      enum: ["0000", "1111", "2222"],
    },
  },
  {
    timestamp: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, ApiKey);
