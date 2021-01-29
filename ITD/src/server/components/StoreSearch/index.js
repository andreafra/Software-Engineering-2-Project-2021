const queryManager = require("./../QueryManager")

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
	const res = await queryInterface.getStoreIds(lat, long, 50)
	if (res.length === 0) {
		throw "Store not found"
	}

	return res
}
