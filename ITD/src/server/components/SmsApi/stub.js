/**
 * This is the stub for the SmsApi component.
 * This element emuletes by the mean of console.log() the sms_api interface
 * of an unknown provider.
 * It exposes the sendVerificationCode method to send a verification code
 * to a given user.
 */
exports.sendVerificationCode = (phoneNum, code) => {
	console.log("Sent code: [" + code + "] to " + phoneNum)
}
