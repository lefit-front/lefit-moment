import leMoment from './moment'
import Moment from './moment_'
window.Moment = Moment
window.leMoment = leMoment

// window.moment = new leMoment()

leMoment.locale('en') // 全局
// console.log(leMoment().format('YYYY-MM-DD HH:mm:ss dd'))
// console.log(leMoment().locale('zh').format('YYYY-MM-DD HH:mm:ss dd'))
// console.log(leMoment().format('YYYY-MM-DD HH:mm:ss dd'))
// console.log(leMoment().format('YYYY-MMM-DD HH:mm:ss dd'))
// console.log(leMoment().format('YYYY-MMMM-DD HH:mm:ss dd'))
// console.log(leMoment().format('YYYY-Mo-DD HH:mm:ss dd'))
// console.log(leMoment({
//   // years: 2016,
//   month: 1,
//   d: 5,
//   h:16,
//   m: 16,
//   s: 30,
//   ms: 500,
// }).format('YYYY-Mo-DD HH:mm:ss dd'))
leMoment('1997/12/03 16:23', 'YYYY/MM/DD HH:mm')
