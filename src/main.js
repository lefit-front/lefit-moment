import leMoment from './moment'
console.log(leMoment)
// let leMoment = require('./moment')
window.leMoment = leMoment

leMoment.locale('en') // 全局
let time1 = leMoment('1994/10/10')
let time2 = leMoment({ year: 2017, month: 10, date: 31 })
// let time2 = leMoment('2017/11/31')
console.log(time2)
console.log(time2.get('month'))
console.log(time2.get('year'))
console.log(time1.get('month'))
console.log(leMoment('1994/10/10').get('year'))
console.log(leMoment('2017/12/10').get('day'))
console.log(leMoment('2017/12/10').get('weekday'))
console.log(leMoment('2017/12/28').get('week'))
console.log(leMoment({YYYY: 2008, MM: 3, DD: 1, HH: 15, mm: 30}).format('YYYY-MM-DD HH:mm'))
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
console.log(leMoment().add(360, 'minute').format('YYYY-MM-DD HH:mm'))
console.log(leMoment('2017/12/24').subtract({
  month: 1,
  day: 1
}).format('YYYY-MM-DD dd HH:mm'))
console.log(leMoment('2018/01/01 5:6').format('YYYY/MM/DD HH:mm'))