(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.leMoment = factory());
}(this, function () {
  'use strict';
  const forEachTime = Symbol('forEachTime')
  const fixTimeVal = Symbol('fixTimeVal')
  const _formatTpl = Symbol('_formatTpl')
  const _parseTpl = Symbol('_parseTpl')
  const timeDataHasKey = Symbol('timeDataHasKey')
  const initTime = Symbol('initTime')
  const parseTime = Symbol('parseTime')

  function LefitMoment(...arg) {
    if (!(this instanceof LefitMoment)){
      return new LefitMoment(...arg)
    }
    this.timeData = {}
    this.now = new Date()
    this.parseTpl = this[_parseTpl]()
    this.lang = lang
    this.langConfig = JSON.parse(JSON.stringify(langConfig))
    this[initTime](...arg)
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
  
  LefitMoment.unix = function (time) {
      if (typeof time !== 'number') {
        throw Error('请传入Number类型参数')
    } else {
      return new LefitMoment((time * 1000).toFixed(0) * 1)
    }
  }
  
  LefitMoment.prototype[initTime] = function (time) {
    switch (typeof time) {
      case 'undefined':
        this[forEachTime](new Date().getTime())
        break
      case 'number':
        this[forEachTime](time)
        break
      case 'string':
        if (/^\d{10,}$/.test(time)) {
          this[initTime](Number(time))
        } else {
          this[parseTime]([].slice.call(arguments, 0))
        }
        break  
      case 'object':
        if (time instanceof Date) {
          this[forEachTime](time.getTime())
        } else {
          let obj = {
            year: time.years || time.year || time.y || this.now.getFullYear(),
            month: time.months || time.month || time.M || 1,
            day: time.days || time.day || time.date || time.d || 1,
            hour: time.hours || time.hour || time.h || 0,
            minute: time.minutes || time.minute || time.m || 0,
            second: time.seconds || time.second || time.s || 0,
            millisecond:time.milliseconds || time.millisecond || time.ms || 0
          }
          obj = this[fixTimeVal](obj, true)
          this[initTime](new Date(obj.year, obj.month, obj.day, obj.hour, obj.minute, obj.second, obj.millisecond))
        }
      break
    }
    this.formatTpl = this[_formatTpl]()
    return this
  }
  LefitMoment.prototype.locale = function (_lang, config) {
    if (this.langConfig.hasOwnProperty(_lang)) {
      this.lang = _lang
      this.langConfig[this.lang] = Object.assign(this.langConfig[this.lang], config)
    } else if (Object.keys(config).length) {
      this.lang = _lang
      this.langConfig[this.lang] = config
    }
    return this
  }
  LefitMoment.prototype.valueOf = function () {
    return this.timeData.timestamp
  }
  LefitMoment.prototype.unix = function (time) {
    return this.timeData.unix
  }
  LefitMoment.prototype.get = function (key) {
    let obj = this[fixTimeVal](this.timeData, false)
    obj.week = obj.week === 7 ? 0 : obj.week
    if (obj.hasOwnProperty(key)) {
      return obj[key]
    } else {
      throw Error('传入的参数有误, 不含该键值: ' + key)
    }
  }
  LefitMoment.prototype.set = function (keyOrObj, val) {
    let obj = this[fixTimeVal](this.timeData, false)
    if (typeof keyOrObj === 'string') {
      if (!val) {
        throw Error(`请传入你想设置的${keyOrObj}值`)
      }
      if (this[timeDataHasKey](keyOrObj)) {
        obj[keyOrObj] = val
        this[initTime](obj)
      } else {
        throw Error('无法设置该值!请检查参数!')
      }
    } else if (typeof keyOrObj === 'object') {
      for (let key in keyOrObj) {
        this.set(key, keyOrObj[key])
      }
    }
  }
  LefitMoment.prototype.format = function (rule) {
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
  }
  LefitMoment.prototype[parseTime] = function (arg) {
    let timeStr = arg[0]
    let format = arg[1]
    if (!format) {
      for (let i = 0; i < defaultParseRegexp.length; i++) {
        if (timeStr.match(defaultParseRegexp[i].regexp)) {
          format = defaultParseRegexp[i].tpl
          break
        }
      }
    }
    if (!format) {
      throw Error('无法识别 请传入需要解析的模板')
    }
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
    let result = timeStr.match(new RegExp(regexp))
    if (result) {
      let timeObj = result.slice(1).reduce((obj, key, idx) => {
        return Object.assign(obj, temp[idx].str2val(key))
      }, {})
      this[initTime](timeObj)
    } else {
      throw Error('请传入正确的解析模版!')
    }
  }
  
  LefitMoment.prototype[fixTimeVal] = function (obj, isReal) { // 转换时间 主要为人们意识中的时间观念何真实Date存储值的转换
    let week = undefined
    if (isReal) {
      week = obj.week === 7 ? 0 : obj.week
    } else {
      week = obj.week === 0 ? 7 : obj.week
    }
    return Object.assign(obj, {
      month: isReal ? obj.month - 1 : obj.month + 1,
      week
    })
  }
  LefitMoment.prototype[timeDataHasKey] = function (key) {
    return ['year', 'month', 'day', 'hour', 'minute', 'second', 'millisecond']
    .some(v => v === key)
  }
  LefitMoment.prototype[forEachTime] = function (time) {
    let date = new Date(time)
    this.timeData = {
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate(),
      week: date.getDay(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds(),
      millisecond: date.getMilliseconds(),
      timestamp: time,
      unix: ~~(time / 1000)
    }
    this.timeData._hour = this.timeData.hour > 12 ? this.timeData.hour - 12 : this.timeData.hour
  }
  LefitMoment.prototype[_formatTpl] = function () {
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
  }
  LefitMoment.prototype[_parseTpl] = function () {
    return {
      YYYY: {
        regexp: '(\\d{4})',
        str2val: str => ({y: ~~str})
      },
      YY: {
        regexp: '(\\d{2})',
        str2val: str => ({y: ~~(20 + str)})
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
      H: {
        regexp: '(\\d{1,2})',
        str2val: str => ({h: ~~str})
      },
      hh: {
        regexp: '(\\d{1,2})',
        str2val: str => ({h: ~~str})
      },
      h: {
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
  var defaultParseRegexp = [{
    tpl: 'YYYY/MM/DD HH:mm',
    regexp: /(\d{4})[\/-](\d{2})[\/-](\d{2})\s?(\d{2}):(\d{2})/
  }, {
    tpl: 'YY/MM/DD HH:mm',
    regexp: /(\d{2})[\/-](\d{2})[\/-](\d{2})\s?(\d{2}):(\d{2})/
  }, {
    tpl: 'YY/MM/DD',
    regexp: /(\d{2})[\/-](\d{2})[\/-](\d{2})/
  }]
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
  return LefitMoment
}))