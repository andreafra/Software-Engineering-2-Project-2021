const AccountManager = require(".")
const { InvalidInputError } = require("../../errors/InvalidInputError")
const QueryManager = require("../QueryManager")

test("Check phone number is present", async () => {
	const queryInterface = await QueryManager.getQueryInterface()
	await queryInterface.executeAndRollback(async () => {
		const code = await AccountManager.loginWithPhoneNumber(
			"+39 392 5555050"
		)
		const res = await AccountManager.verifyPhoneNumber(
			"+39 392 5555050",
			code
		)
		expect(res).toBe(true)
	})
})

describe("Security", () => {
	it("should not accept invalid sequences in phone number", async () => {
		const qi = await QueryManager.getQueryInterface()
		await qi.executeAndRollback(async () => {
			await expect(
				AccountManager.loginWithPhoneNumber("ABCDEFGHI")
			).rejects.toThrowError(InvalidInputError)
			await expect(
				AccountManager.loginWithPhoneNumber("A1B2C3D4E")
			).rejects.toThrowError(InvalidInputError)
			await expect(
				AccountManager.loginWithPhoneNumber("555555")
			).rejects.toThrowError(InvalidInputError)
		})
	})

	it("should accept valid numbers without throwing`", async () => {
		const qi = await QueryManager.getQueryInterface()
		await qi.executeAndRollback(async () => {
			// We should parse numbers and graphic symbols such as
			// "-" accordingly
			await expect(
				AccountManager.loginWithPhoneNumber("392-6665555")
			).resolves.not.toThrowError(InvalidInputError)
			await expect(
				AccountManager.loginWithPhoneNumber("+393925555555")
			).resolves.not.toThrowError(InvalidInputError)
		})
	})
})
