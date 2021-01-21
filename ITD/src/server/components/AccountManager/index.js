const queryManager = require("./../QueryManager/index")
const smsApi = require("./../SmsApi/stub")
const uuid = require("uuid")

var smsCodes = {}

exports.loginWithPhoneNumber = async (phoneNum) => {
	const queryInterface = await queryManager.getQueryInterface()
	var res = await queryInterface.checkIfPhoneNumberIsPresent(phoneNum)
	if (res == false) {
		await queryInterface.createUser(phoneNum, "null", "null")
	}
	var code = ("" + Math.random()).substring(3, 8) //5 digit code
	smsCodes[phoneNum] = code
	res = smsApi.sendVerificationCode(phoneNum, code)
	return res
}

exports.veryPhoneNumber = async (phoneNum, code) => {
	const queryInterface = await queryManager.getQueryInterface()
	//TODO: var res = await queryInterface.checkVerficationCode(phoneNum, code)
	if (res == false) {
		//TODO: return err()
	} else {
		//TODO: return success()
	}
}
