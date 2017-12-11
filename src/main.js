import leMoment from './moment'
// let leMoment = require('./moment')
window.leMoment = leMoment

// window.moment = new leMoment()

leMoment.locale('en') // 全局
console.log(leMoment('2017/12/10').get('month'))
console.log(leMoment('2017/12/10').get('week'))
console.log(leMoment().format('YYYY-MM-DD HH:mm:ss dd'))
console.log(leMoment().locale('zh').format('YYYY-MM-DD HH:mm:ss dd'))
console.log(leMoment().format('YYYY-MM-DD HH:mm:ss dd'))
console.log(leMoment().format('YYYY-MMM-DD HH:mm:ss dd'))
console.log(leMoment().format('YYYY-MMMM-DD HH:mm:ss dd'))
console.log(leMoment().format('YYYY-Mo-DD HH:mm:ss dd'))
console.log(leMoment({
  // years: 2016,
  month: 1,
  d: 5,
  h:16,
  m: 16,
  s: 30,
  ms: 500,
}).format('YYYY-Mo-DD HH:mm:ss dd'))
let time = leMoment.unix((new Date().getTime()) / 1000)
// let time = leMoment('2018/11/03 13:23')
console.log(time.format('YYYY/MM/DD HH:mm'))
time.set({
  year: 2017,
  month: 12,
  day: 2,
  hour: 11,
  minute: 52
})
console.log(time.format('YYYY/MM/DD HH:mm dd'))