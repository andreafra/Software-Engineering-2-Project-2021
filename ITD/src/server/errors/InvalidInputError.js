/**
 * Throw this error when invalid input is detected
 */
exports.InvalidInputError = class InvalidInputError extends (
	Error
) {
	constructor(input) {
		super("Invalid input: " + input)
	}
}
