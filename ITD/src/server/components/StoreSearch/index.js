const queryManager = require("./../QueryManager")

exports.getStores = async (lat, long) => {
	const queryInterface = await queryManager.getQueryInterface()
	const res = await queryInterface.getStoreIds(lat, long, 50)
	if (res.length === 0) {
		throw "Store not found"
	}

	return res
}
