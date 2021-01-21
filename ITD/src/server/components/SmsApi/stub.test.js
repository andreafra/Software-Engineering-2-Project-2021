const smsManager = require("./stub.js")

/**
 * This test sends a verification code to a dummy user
 */
test("STUB: sending sms", () => {
	var result = smsManager.sendVerificationCode("+3934675392", "d8yd9a")
	expect(result).toBe(true)
})
