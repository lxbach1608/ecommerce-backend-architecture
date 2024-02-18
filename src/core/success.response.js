"use strict";

const StatusCode = {
  OK: 200,
  CREATED: 201,
};

const ReasonStatusCode = {
  OK: "Success",
  CREATED: "Created",
};

class SuccessResponse {
  message;
  status;
  reasonStatus;
  metadata;

  constructor(
    message,
    statusCode = StatusCode.OK,
    reasonStatusCode = ReasonStatusCode.OK,
    metadata = {},
    options = {}
  ) {
    this.message = message ? message : reasonStatusCode;
    this.status = statusCode;
    this.metadata = metadata;
    this.options = options;
  }

  send(res, headers = {}) {
    return res.status(this.status).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({
    message,
    statusCode = StatusCode.OK,
    reasonStatus = ReasonStatusCode.OK,
    metadata,
  }) {
    super(message, statusCode, reasonStatus, metadata);
  }
}

class CREATED extends SuccessResponse {
  constructor({
    message,
    statusCode = StatusCode.CREATED,
    reasonStatus = ReasonStatusCode.CREATED,
    metadata,
  }) {
    super(message, statusCode, reasonStatus, metadata);
  }
}

module.exports = {
  OK,
  CREATED,
};
