"use strict";

const { Schema, model } = require("mongoose");

const COLLECTION_NAME = "Keys";
const DOCUMENT_NAME = "Key";

const keyTokenScheme = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "shop",
    },
    accessToken: {
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
