const queryManager = require("./../QueryManager/index")
const smsApi = require("./../SmsApi/stub")
const uuid = require("uuid")

const queryInterface = await queryManager.getQueryInterface()

exports.loginWithPhoneNumber = async (phoneNum) => {
	let res = await queryInterface.checkIfPhoneNumberIsPresent(phoneNum)
	if (res == false) {
		await queryInterface.createUser(phoneNum, "null", "null")
	}
	let code = ("" + Math.random()).substring(3, 8) //5 digit code
	await queryInterface.addSMSCode(phoneNum, code)
	res = smsApi.sendVerificationCode(phoneNum, code)

	return res
}

exports.veryPhoneNumber = async (phoneNum, code) => {
	let res = await queryInterface.checkVerficationCode(phoneNum, code)

	return res
}
