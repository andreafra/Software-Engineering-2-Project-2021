const StoreSearch = require(".")
const QueryManager = require("../QueryManager")

test("check stores out of range", async () => {
	const queryInterface = await QueryManager.getQueryInterface()

	await queryInterface.executeAndRollback(async () => {
		await queryInterface.createStore("a", "via a", 100, 0, 0)
		await queryInterface.createStore("b", "via b", 100, 10, 0)
		await queryInterface.createStore("c", "via c", 100, 500, 500)
	
		const stores = await StoreSearch.getStores(0, 0)
		expect(stores.length).toBe(2)

		let flag
		try {
			await StoreSearch.getStores(-1000, -1000)
			flag = false
		} catch (err) {
			flag = true
		}

		expect(flag).toBe(true)
	})
})