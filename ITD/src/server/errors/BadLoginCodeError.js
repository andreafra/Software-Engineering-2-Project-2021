/**
 * Throw this error when invalid SMS code is detected
 */
exports.BadLoginCodeError = class BadLoginCodeError extends (
	Error
) {
	constructor() {
		super("The provided SMS code does not match with the one we sent you.")
	}
}
