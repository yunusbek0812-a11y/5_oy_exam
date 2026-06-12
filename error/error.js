class CustomErrorHandler extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }

  static badRequest(message) {
    return new CustomErrorHandler(400, message);
  }

  static unauthorized(message) {
    return new CustomErrorHandler(401, message);
  }

  static forbidden(message) {
    return new CustomErrorHandler(403, message);
  }

  static notFound(message) {
    return new CustomErrorHandler(404, message);
  }

  static alreadyExists(message) {
    return new CustomErrorHandler(409, message);
  }

  static internal(message) {
    return new CustomErrorHandler(500, message || "Server xatosi");
  }
}

module.exports = CustomErrorHandler;
