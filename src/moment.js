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
  const takeHowLong = Symbol('takeHowLong')
  function LefitMoment(...arg) {
    if (!(this instanceof LefitMoment)){
      return new LefitMoment(...arg)
    }
    this.timeData = {}
    this.now = new Date()
    this.parseTpl = this[_parseTpl]()
    this.lang = lang
    this.langConfig = clone(langConfig)
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
        } else if (!time.trim()) {
          this[forEachTime](new Date().getTime())
        } else {
          this[parseTime]([].slice.call(arguments, 0))
        }
        break  
      case 'object':
        if (time instanceof Date) {
          this[forEachTime](time.getTime())
        } else if (time === null) {
          this[forEachTime](new Date().getTime())
        } else {
          let obj = transformVariable(time)
          this[initTime](new Date(obj.year || this.now.getFullYear(),
            obj.month || 0,
            obj.date || 1,
            obj.hour || 0,
            obj.minute || 0,
            obj.second || 0,
            obj.millisecond || 0
          ))
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
    let timeData = clone(this.timeData)
    timeData.week = getYearWeek(this.timeData.year, this.timeData.month, this.timeData.date)
    if (timeData.hasOwnProperty(key)) {
      return timeData[key]
    } else {
      throw Error('传入的参数有误, 不含该键值: ' + key)
    }
  }
  LefitMoment.prototype.set = function (...arg) {
    let obj = clone(this.timeData)
    let me = this
    function analysis (keyOrObj, val) {
      if (typeof keyOrObj === 'string') {
        if (val === undefined || val === null) {
          throw Error(`请传入你想设置的${keyOrObj}值`)
        }
        if (me[timeDataHasKey](keyOrObj)) {
          obj[keyOrObj] = val
          me[initTime](obj)
        } else {
          throw Error('无法设置该值!请检查参数!')
        }
      } else if (typeof keyOrObj === 'object') {
        for (let key in keyOrObj) {
          analysis(key, keyOrObj[key])
        }
      }
    }
    analysis(...arg)
    return this
  }
  LefitMoment.prototype.add = function (...arg) {
    if (arg.length === 1 && typeof arg[0] === 'object') {
      return this[takeHowLong](arg[0])
    } else if (arg.length === 2) {
      return this[takeHowLong]({[arg[1]]: arg[0]})
    } else {
      throw Error('请传入正确的参数! :add')
    }
  }
  LefitMoment.prototype.subtract = function (...arg) {
    if (arg.length === 1 && typeof arg[0] === 'object') {
      for (let key in arg[0]) {
        arg[0][key] = -arg[0][key]
      }
      return this[takeHowLong](arg[0])
    } else if (arg.length === 2) {
      return this[takeHowLong]({[arg[1]]: -arg[0]})
    } else {
      throw Error('请传入正确的参数! :subtract')
    }
  }
  LefitMoment.prototype.format = function (_rule) {
    let rule = _rule
    if (_rule === undefined) {
      rule = 'YYYY-MM-DDTHH:mm:ss'
    }
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
    let out = temp.reduce((output, val) => {
      return output.replace(val.$key, val.replace)
    }, rule)
    if (_rule === undefined) {
      return out + formatTimezoneHour(this.now.getTimezoneOffset())
    } else {
      return out
    }
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
      timeObj = transformVariable(timeObj)
      timeObj = this[fixTimeVal](timeObj, true)
      this[initTime](timeObj)
    } else {
      throw Error('请传入正确的解析模版!')
    }
  }
  
  LefitMoment.prototype[fixTimeVal] = function (obj, isReal) { // 转换时间 主要为人们意识中的时间观念何真实Date存储值的转换
    let _obj = clone(obj)
    let day = undefined
    if (isReal) {
      day = _obj.day === 7 ? 0 : _obj.day
    } else {
      day = _obj.day === 0 ? 7 : _obj.day
    }
    return Object.assign(_obj, {
      month: isReal ? _obj.month - 1 : _obj.month + 1,
      day
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
      date: date.getDate(),
      weekday: date.getDay(),
      day: date.getDay(),
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
      DD: date => date.date < 10 ? '0' + date.date : date.date + '',
      D: date => date.date.toString(),
      hh: date => date._hour < 10 ? '0' + date._hour : date._hour + '',
      h: date => date._hour.toString(),
      HH: date => date.hour < 10 ? '0' + date.hour : date.hour + '',
      H: date => date.hour.toString(),
      MMMM: date => this.langConfig[this.lang].months[date.month],
      MMM: date => this.langConfig[this.lang].monthsShort[date.month],
      MM: date => date.month + 1 < 10 ? `0${date.month + 1}` : `${date.month + 1}`,
      Mo: date => this.langConfig[this.lang].monthsMin[date.month],
      M: date => (date.month + 1).toString(),
      mm: date => date.minute < 10 ? '0' + date.minute : date.minute + '',
      m: date => date.minute.toString(),
      ss: date => date.second < 10 ? '0' + date.second : date.second + '',
      s: date => date.second.toString(),
      ddd: date => this.langConfig[this.lang].weekdays[date.day],
      dd: date => this.langConfig[this.lang].weekdaysShort[date.day],
      d: date => this.langConfig[this.lang].weekdaysMin[date.day],
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
        regexp: '(\\d{1,2})',
        str2val: str => ({M: ~~str})
      },
      DD: {
        regexp: '(\\d{1,2})',
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
      ss: {
        regexp: '(\\d{1,2})',
        str2val: str => ({s: ~~str})
      },
      s: {
        regexp: '(\\d{1,2})',
        str2val: str => ({s: ~~str})
      }
    }
  }
  LefitMoment.prototype[takeHowLong] = function (time) {
    let obj = transformVariable(time)
    let timestamp = (obj.date || 0) * timestamps.date
      + (obj.hour || 0) * timestamps.hour
      + (obj.minute || 0) * timestamps.minute
      + (obj.second || 0) * timestamps.second
      + (obj.millisecond || 0) * timestamps.millisecond
    this.timeData.year += obj.year || 0
    this.timeData.month += obj.month || 0
    this[initTime](this.timeData)
    this[initTime](this.valueOf() + timestamp)
    return this
  }
  var clone = function (obj) {
    return JSON.parse(JSON.stringify(obj))
  }
  // 转换变量名
  var transformVariable = function (time) {
    return {
      year: time.years || time.year || time.y || time.YYYY || undefined,
      month: time.months || time.month || time.M || time.MM || undefined,
      date: time.date || time.d || time.DD || time.D || undefined,
      hour: time.hours || time.hour || time.h || time.HH || undefined,
      minute: time.minutes || time.minute || time.m || time.mm || undefined,
      second: time.seconds || time.second || time.s || time.ss || undefined,
      millisecond:time.milliseconds || time.millisecond || time.ms || undefined
    }
  }
  var getTimezoneHour = function (time) {
    return -time / 60
  }
  var formatTimezoneHour = function (time) {
    let h = getTimezoneHour(time)
    let _h = Math.abs(h)
    return `${h > -1 ? '+' : '-'}${_h < 10 ? '0' + _h : _h}:00`
}
    
  // var getMonthWeek = function (a, b, c) { 
  //   /* 
  //   a = d = 当前日期 
  //   b = 6 - w = 当前周的还有几天过完（不算今天） 
  //   a + b 的和在除以7 就是当天是当前月份的第几周 
  //   */ 
  //   var date = new Date(a, parseInt(b) - 1, c), w = date.getDay(), d = date.getDate()
  //     return Math.ceil((d + 6 - w) / 7)
  //   }
    
  var getYearWeek = function (year, month, date) {
    // 先找到要计算的周的周六是哪天 再找到要计算的1/1的周日是哪天 再计算时差
    let date1 = new Date(year, month, date)
    let date2 = new Date(year, 0, 1)
    let date1Week = date1.getDay()
    date1 = date1.valueOf() - date1Week * timestamps.date
    let date2Week = date2.getDay()
    date2 = date2.valueOf() - date2Week * timestamps.date
    return Math.ceil((date1.valueOf() - date2.valueOf()) / timestamps.week) + 1
  }
  const timestamps = {
    date: 86400000,
    hour: 3600000,
    minute: 60000,
    second: 1000,
    millisecond: 1,
    week: 604800000
  }
  var defaultParseRegexp = [{
    tpl: 'YYYY/MM/DD HH:mm',
    regexp: /^(\d{4})\/(\d{1,2})\/(\d{1,2})\s?(\d{2}):(\d{2})$/
  }, {
    tpl: 'YYYY-MM-DD HH:mm',
    regexp: /^(\d{4})-(\d{1,2})-(\d{1,2})\s?(\d{2}):(\d{2})$/
  }, {
    tpl: 'YY/MM/DD HH:mm',
    regexp: /^(\d{2})\/(\d{1,2})\/(\d{1,2})\s?(\d{2}):(\d{2})$/
  }, {
    tpl: 'YY-MM-DD HH:mm',
    regexp: /^(\d{2})-(\d{1,2})-(\d{1,2})\s?(\d{2}):(\d{2})$/
  }, {
    tpl: 'YYYY/MM/DD',
    regexp: /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/
  }, {
    tpl: 'YYYY-MM-DD',
    regexp: /^(\d{4})-(\d{1,2})-(\d{1,2})$/
  }, {
    tpl: 'YY/MM/DD',
    regexp: /^(\d{2})\/(\d{1,2})\/(\d{1,2})$/
  }, {
    tpl: 'YY-MM-DD',
    regexp: /^(\d{2})-(\d{1,2})-(\d{1,2})$/
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