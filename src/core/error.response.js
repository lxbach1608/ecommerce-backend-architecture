"use strict";

const statusCode = {
  FORBIDDEN: 403,
  CONFLICT: 409,
};

const reasonStatusCode = {
  FORBIDDEN: "Bad request error",
  CONFLICT: "Conflict error",
};

class ErrorResponse extends Error {
  status = null;

  constructor(message, status) {
    super(message);

    this.status = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = reasonStatusCode.CONFLICT,
    status = statusCode.CONFLICT
  ) {
    super(message, status);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = reasonStatusCode.FORBIDDEN,
    status = statusCode.FORBIDDEN
  ) {
    super(message, status);
  }
}

module.exports = {
  ConflictRequestError,
  BadRequestError,
};
