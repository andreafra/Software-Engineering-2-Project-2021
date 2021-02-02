/**
 * Throw this error when invalid authentication token is detected
 */
exports.InvalidAuthTokenError = class InvalidAuthTokenError extends (
	Error
) {
	constructor() {
		super("The user is not authenticated within this system.")
	}
}
