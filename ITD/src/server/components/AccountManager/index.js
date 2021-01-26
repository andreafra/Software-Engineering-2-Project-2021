const queryManager = require("./../QueryManager/index")
const smsApi = require("./../SmsApi/stub")
const uuid = require("uuid")

exports.loginWithPhoneNumber = async (phoneNum) => {
	const queryInterface = await queryManager.getQueryInterface()
	let res = await queryInterface.checkIfPhoneNumberIsPresent(phoneNum)
	if (res == false) {
		await queryInterface.createUser(phoneNum, "null", "null")
	}
	let code = ("" + Math.random()).substring(3, 8) //5 digit code
	await queryInterface.addVerificationCode(phoneNum, code)
	res = smsApi.sendVerificationCode(phoneNum, code)

	return code
}

exports.verifyPhoneNumber = async (phoneNum, code) => {
	const queryInterface = await queryManager.getQueryInterface()
	let res = await queryInterface.checkVerificationCode(phoneNum, code)

	return res
}
