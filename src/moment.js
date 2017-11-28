class LefitMoment {
  constructor(time) {
    switch (typeof time) {
      case 'undefined':
        this.forEachTime(new Date().getTime())
        break
      case 'number':
        this.forEachTime(time)
        break
      case 'object':
        this.forEachTime(time.getTime())
      break
    }
    this.formatTpl = this._formatTpl()
    console.log(this)
    // if (!this instanceof LefitMoment) {
    //   return new LefitMoment()
    // }
    return this
  }
  valueOf() {
    return this.timeData.timestamp
  }
  unix() {
    return this.timeData.unix
  }
  forEachTime(time) {
    let date = new Date(time)
    this.timeData = {
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate(),
      week: date.getDay(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds(),
      milliseconed: date.getMilliseconds(),
      timestamp: time,
      unix: ~~(time / 1000)
    }
    this.timeData._hour = this.timeData.hour > 12 ? this.timeData.hour - 12 : this.timeData.hour
  }
  format(rule) {
    for (let key in this.formatTpl) {
      rule = this._replace(rule, key, this.formatTpl[key]())
    }
    return rule
  }
  _replace(str, key, replace) {
    let regexp = new RegExp(key, 'g')
    let result = str.match(regexp)
    if (result && result.length === 1) {
      return str.replace(regexp, replace)
    } else {
      return str
    }
  }
  _formatTpl() {
    let timeData = this.timeData
    let obj = {
      YYYY: date => date.year.toString(),
      YY: date => date.year.toString().slice(-2),
      MM: date => date.month + 1 < 10 ? `0${date.month + 1}` : `${date.month + 1}`,
      M: date => date.month.toString(),
      DD: date => date.day < 10 ? '0' + date.day : date.day + '',
      D: date => date.day.toString(),
      hh: date => date._hour < 10 ? '0' + date._hour : date._hour + '',
      h: date => date._hour.toString(),
      HH: date => date.hour < 10 ? '0' + date.hour : date.hour + '',
      H: date => date.hour.toString(),
      mm: date => date.minute < 10 ? '0' + date.minute : date.minute + '',
      m: date => date.minute.toString(),
      ss: date => date.second < 10 ? '0' + date.second : date.second + '',
      s: date => date.second.toString()
    }
    for (let key in obj) {
      obj[key] = obj[key].bind(this, this.timeData)
    }
    return obj
  }
}

let lang = 'zh'

export default LefitMoment