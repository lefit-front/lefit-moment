function LefitMoment(...arg) {
  if (!(this instanceof LefitMoment)){
    return new LefitMoment(...arg)
  }
  this.timeData = {}
  this.now = new Date()
  this.formatTpl = this._formatTpl()
  this.parseTpl = this._parseTpl()
  this.lang = lang
  this.langConfig = JSON.parse(JSON.stringify(langConfig))
  this.initTime(...arg)
}

LefitMoment.locale = function (_lang, config = {}) {
  if (langConfig.hasOwnProperty(_lang)) {
    lang = _lang
    langConfig[lang] = Object.assign(langConfig[lang], config)
  } else if (Object.keys(config).length) {
    lang = _lang
    langConfig[lang] = config
  }
}

LefitMoment.prototype = {
  initTime(time) {
    switch (typeof time) {
      case 'undefined':
        this.forEachTime(new Date().getTime())
        break
      case 'number':
        this.forEachTime(time)
        break
      case 'string':
      this.parseTime([].slice.call(arguments, 0))
        break  
      case 'object':
        if (time instanceof Date) {
          this.forEachTime(time.getTime())
        } else {
          let y = time.years || time.year || time.y || this.now.getFullYear()
          let M = time.months || time.month || time.M || 1
          let d = time.days || time.day || time.date || time.d || 1
          let h = time.hours || time.hour || time.h || 0
          let m = time.minutes || time.minute || time.m || 0
          let s = time.seconds || time.second || time.s || 0
          let ms = time.milliseconds || time.millisecond || time.ms || 0
          this.initTime(new Date(y, --M,M, d, h, m, s, ms))
        }
      break
    }
    this.formatTpl = this._formatTpl()
    return this
  },
  locale(_lang, config) {
    if (this.langConfig.hasOwnProperty(_lang)) {
      this.lang = _lang
      this.langConfig[this.lang] = Object.assign(this.langConfig[this.lang], config)
    } else if (Object.keys(config).length) {
      this.lang = _lang
      this.langConfig[this.lang] = config
    }
    return this
  },
  valueOf() {
    return this.timeData.timestamp
  },
  unix() {
    return this.timeData.unix
  },
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
  },
  format(rule) {
    let temp = []
    Object.keys(this.formatTpl).forEach((key, idx) => {
      let regexp = new RegExp(key, 'g')
      let result = rule.match(regexp)
      if (result && result.length === 1) {
        rule = rule.replace(regexp, `$${idx}`)
        temp.push({
          $key: `$${idx}`,
          replace: this.formatTpl[key]()
        })
      }
    })
    return temp.reduce((output, val) => {
      return output.replace(val.$key, val.replace)
    }, rule)
  },
  parseTime(arg) {
    let timeStr = arg[0]
    let format = arg[1]
    let temp = []
    Object.keys(this.parseTpl).forEach((key, idx) => {
      let regexp = new RegExp(key, 'g')
      let result = format.match(regexp)
      if (result && result.length === 1) {
        format = format.replace(regexp, `$${temp.length}`)
        temp.push({
          $key: `$${temp.length}`,
          replace: this.parseTpl[key].regexp,
          str2val: this.parseTpl[key].str2val
        })
      }
    })
    let regexp = (temp.reduce((output, val) => {
      return output.replace(val.$key, val.replace)
    }, format))
    console.log(regexp)
    console.log(temp)
    let result = timeStr.match(new RegExp(regexp))
    if (result) {
      let timeObj = result.slice(1).reduce((obj, key, idx) => {
        return Object.assign(obj, temp[idx].str2val(key))
      }, {})
      console.log(timeObj)
      console.log(this.initTime(timeObj).format('YYYY/MM/DD HH:mm'))
    }
  },
  _formatTpl() {
    let timeData = this.timeData
    let obj = {
      YYYY: date => date.year.toString(),
      YY: date => date.year.toString().slice(-2),
      DD: date => date.day < 10 ? '0' + date.day : date.day + '',
      D: date => date.day.toString(),
      hh: date => date._hour < 10 ? '0' + date._hour : date._hour + '',
      h: date => date._hour.toString(),
      HH: date => date.hour < 10 ? '0' + date.hour : date.hour + '',
      H: date => date.hour.toString(),
      MMMM: date => this.langConfig[this.lang].months[date.month],
      MMM: date => this.langConfig[this.lang].monthsShort[date.month],
      MM: date => date.month + 1 < 10 ? `0${date.month + 1}` : `${date.month + 1}`,
      Mo: date => this.langConfig[this.lang].monthsMin[date.month],
      M: date => date.month.toString(),
      mm: date => date.minute < 10 ? '0' + date.minute : date.minute + '',
      m: date => date.minute.toString(),
      ss: date => date.second < 10 ? '0' + date.second : date.second + '',
      s: date => date.second.toString(),
      ddd: date => this.langConfig[this.lang].weekdays[date.week],
      dd: date => this.langConfig[this.lang].weekdaysShort[date.week],
      d: date => this.langConfig[this.lang].weekdaysMin[date.week],
    }
    for (let key in obj) {
      obj[key] = obj[key].bind(this, this.timeData)
    }
    return obj
  },
  _parseTpl () {
    return {
      YYYY: {
        regexp: '(\\d{4})',
        str2val: str => ({y: ~~str})
      },
      YY: {
        regexp: '(\\d{2})',
        str2val: str => ({y: 20 + ~~str})
      },
      MM: {
        regexp: '(\\d{2})',
        str2val: str => ({M: ~~str})
      },
      DD: {
        regexp: '(\\d{2})',
        str2val: str => ({d: ~~str})
      },
      HH: {
        regexp: '(\\d{2})',
        str2val: str => ({h: ~~str})
      },
      hh: {
        regexp: '(\\d{1,2})',
        str2val: str => ({h: ~~str})
      },
      mm: {
        regexp: '(\\d{2})',
        str2val: str => ({m: ~~str})
      },
      m: {
        regexp: '(\\d{1,2})',
        str2val: str => ({m: ~~str})
      },
    }
  }
}
var lang = 'zh'
var langConfig = {
  zh: {
    weekdays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    weekdaysShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    weekdaysMin: ['日', '一', '二', '三', '四', '五', '六'],
    months : [
      '一月', '二月', '三月', '四月', '五月', '六月', '七月',
      '八月', '九月', '十月', '十一月', '十二月'
    ],
    monthsShort : [
      '一', '二', '三', '四', '五', '六', '七',
      '八', '九', '十', '十一', '十二'
    ],
    monthsMin : [
      '一', '二', '三', '四', '五', '六', '七',
      '八', '九', '十', '十一', '十二'
    ]
  },
  en: {
    weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    weekdaysMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    months : [
      'January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December'
    ],
    monthsShort : [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ],
    monthsMin : [
      '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'
    ]
  }
}
export default LefitMoment