const smsManager = require("./stub.js")

/**
 * This test sends a verification code to a dummy user
 */
test("STUB: sending sms", () => {
	const smsManagerInterface = smsManager.getSmsManager()
	var result = smsManagerInterface.sendVerificationCode(
		"+3934675392",
		"d8yd9a"
	)
	expect(result).toBe(true)
})
