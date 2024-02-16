"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Key";
const COLLECTION_NAME = "Keys";

const keyTokenScheme = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "shop",
    },
    publicKey: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collation: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, keyTokenScheme);
