const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const today = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate() - 1

  return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// module.exports = {
//   formatTime: formatTime,
//   today: today
// }


/**
 * 将wx的callback形式的API转换成支持Promise的形式
 */
module.exports = {
  formatTime: formatTime,
  today: today,
  promisify: api => {
    return (options, ...params) => {
      return new Promise((resolve, reject) => {
        const extras = {
          success: resolve,
          fail: reject
        }
        api({ ...options, ...extras }, ...params)
      })
    }
  }

}
