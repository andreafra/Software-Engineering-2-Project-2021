const AccountManager = require(".")

test("Check phone number is present", async () => {
	var res = await AccountManager.loginWithPhoneNumber("+3977652793")
	expect(res).toBe(true)
})
