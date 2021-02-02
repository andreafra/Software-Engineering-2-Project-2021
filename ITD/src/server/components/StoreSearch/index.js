const queryManager = require("./../QueryManager")
const NoStoreError = require("./../../errors/NoStoreError")

/**
 * This method takes as input a location passed by the user.
 * By contacting the QueryManager it retrives the list of the store
 * matching the criteria.
 *
 * @param {number} lat
 * @param {number} long
 * @returns a list of `storeId`
 */
exports.getStores = async (lat, long) => {
	const queryInterface = await queryManager.getQueryInterface()
	const res = await queryInterface.getStoresInRange(lat, long, 50)
	if (res.length === 0) {
		throw new NoStoreError()
	}

	return res
}

/**
 * This method takes as input a storeId passed by the user.
 * By contacting the QueryManager it retrives the store
 * matching the criteria.
 *
 * @param {string} storeId
 * @returns the store matching `storeId`
 */
exports.getStore = async (storeId) => {
	const queryInterface = await queryManager.getQueryInterface()
	const res = await queryInterface.getStore(storeId)
	if (!res) {
		throw new NoStoreError()
	}

	return res
}
