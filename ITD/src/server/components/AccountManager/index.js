const phone = require("phone")
const { InvalidInputError } = require("../../errors/InvalidInputError")
const { BadLoginCodeError } = require("../../errors/BadLoginCodeError")
const QueryManager = require("./../QueryManager/index")
const smsApi = require("./../SmsApi/stub")

/**
 * This method takes as input the phone number providedby the user.
 *
 * It contacts the SMS APIs to send a verification code to the user using SMS.
 *
 * @param {string} phoneNum the user phone number
 * @returns {string} the code send to the user via SMS
 */
exports.loginWithPhoneNumber = async (phoneNum) => {
	let resultPhoneNum = phone(phoneNum, "IT")
	// Reject invalid phone numbers
	if (resultPhoneNum.length === 0) {
		throw new InvalidInputError(phoneNum)
	} else {
		phoneNum = resultPhoneNum[0]
	}

	const queryInterface = await QueryManager.getQueryInterface()
	let res = await queryInterface.checkIfPhoneNumberIsPresent(phoneNum)
	if (res == false) {
		await queryInterface.createUser(phoneNum, "null", "null")
	}
	let code = ("" + Math.random()).substring(3, 8) //5 digit code
	await queryInterface.addVerificationCode(phoneNum, code)

	smsApi.sendVerificationCode(phoneNum, code)

	return code
}

/**
 * This method takes as input the phone number providedby the user and the
 * verification code sent to the user by the SMS APIs.
 *
 * If the phoneNum was not registered it adds that number to the system by
 * contacting the QueryManager.
 *
 * A token is then generated to validate the session of the current user.
 *
 * @param {string} phoneNum the user phone number
 * @param {string} code the SMS code the user has received
 * @returns {boolean} whether the phone number is verified
 */
exports.verifyPhoneNumber = async (phoneNum, code) => {
	const queryInterface = await QueryManager.getQueryInterface()
	let resultPhoneNum = phone(phoneNum, "IT")
	// Reject invalid phone numbers
	if (resultPhoneNum.length === 0) {
		throw new InvalidInputError(phoneNum)
	} else {
		phoneNum = resultPhoneNum[0]
	}
	let res = await queryInterface.checkVerificationCode(phoneNum, code)
	if (!res) {
		throw new BadLoginCodeError()
	}

	return res
}

/**
 * This method creates an authentication token for the user, and returns it.
 *
 * @param {string} phoneNum
 * @returns {string} token
 */
exports.getAccountToken = async (phoneNum) => {
	const queryInterface = await QueryManager.getQueryInterface()
	let resultPhoneNum = phone(phoneNum, "IT")
	// Reject invalid phone numbers
	if (resultPhoneNum.length === 0) {
		throw new InvalidInputError(phoneNum)
	} else {
		phoneNum = resultPhoneNum[0]
	}
	return queryInterface.createUserToken(phoneNum)
}

/**
 * This method returns whether a user's authentication token is valid or not.
 *
 * @param {string} token
 * @returns {boolean}
 */
exports.validateToken = async (token) => {
	const queryInterface = await QueryManager.getQueryInterface()
	return await queryInterface.validateToken(token)
}
