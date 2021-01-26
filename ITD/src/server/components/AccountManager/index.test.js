const AccountManager = require(".")
const QueryManager = require("../QueryManager")

test("Check phone number is present", async () => {
	const queryInterface = await QueryManager.getQueryInterface()
	await queryInterface.executeAndRollback(async () => {
		const code = await AccountManager.loginWithPhoneNumber("+3977652793")
		const res = await AccountManager.verifyPhoneNumber("+3977652793", code)
		expect(res).toBe(true)
	})
})
