function format(timetamp) { 
	const date = new Date (timetamp)
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()
	return {
		year,
		month,
		day,
		hour,
		minute,
		second
	}
	
}

function formatDate(timetamp) {
	const {year, month, day} = format(timetamp * 1000)
	return [year, month, day].map(formatNumber).join('/')
}

function formatTime(timetamp) {
	const {hour, minute, second} = format(timetamp * 1000)
	return [hour, minute, second].map(formatNumber).join(':')
}

function formatDateTime(timetamp,text = '未知') {
	if(timetamp === 0) return text
	const {year, month, day, hour, minute, second} = format(timetamp * 1000)
	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

export {
	formatDate,
	formatTime,
	formatDateTime,
}
