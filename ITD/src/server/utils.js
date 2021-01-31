exports.timeToMinutes = (time) => {
	const timeData = time.split(":")

	return parseInt(timeData[0]) * 60 + parseInt(timeData[1])
}
