#leMoment
参照moment API 编写的时间库

安装:
```
npm install lefit-moment -S

import leMoment from 'lefit-moment'
const leMoment = require('lefit-moment')
```

使用方法:
```
leMoment() // 或者 new leMoment()
leMoment(new Date())
leMoment(1512470505163)
leMoment('1994-10-01')
leMoment('1994-10-01 11:11', 'YYYY-MM-DD HH:mm')
leMoment({year: 2017, month: 12, day: 5})
```
leMoment(Number|string|object, string)
可接受参数:
>Number 毫秒级的timestamp
>object new Date() 生成的对象 或 含year|month等信息的对象 详见set方法
>string 默认解析 'YYYY-MM-DD'等模版 如果自定义请传模版参数

##格式化时间
```
leMoment.format('YYYY-MM-DD')
leMoment.format('YYYY-MM-DD ddd')
leMoment.format('YYYY-MM-DD HH:mm')
```
|attr|token| out(en)|output(zh)|
|--------|
| Year |YY|  03, 17, 97|
|     |YYYY|  2003, 2017, 1997|
|Month| M| 1,2....11,12
|     |Mo|1st,2nd,...11th,12th| 一,二...十一,十二|
|     |MM|01, 02, ...11, 12
|     |MMM| Jan, Feb| 一,二...十一,十二|
|     |MMMM| January, February | 一月, 二月,...十一月,十二月
|Day of Month|DD| 01, 02, ...11, 12
| |D| 1, 2...11,12
|week |ddd|Sunday, Monday...|星期日, 星期一...
||dd|Sun, Mon |周日, 周一
| | d| Su, Mo | 日, 一
|hour| HH | 01, 02...23, 24
|| H | 1, 2 ...23,24
|| hh | 01, 02 ...11, 12
|| h | 1, 2 ...11, 12
|minute| mm | 01, 02 ...58,59
|| m | 1, 2 ...58,59
|second| ss | 01, 02 ...58,59
|| s | 1, 2 ...58,59

###locale语言设置
全局设置
```
leMoment.locale('en')
leMoment.locale('zh', {
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
})
```
局部设置
```
leMoment().locale('zh')
```

###unix
用unix初始化:
```
leMoment.unix(1512470505)
```
获取unix时间:
```
leMoment(1512470505000).unix()
```
获取毫秒时间
```
leMoment().valueOf()
// 1512470505000
```
###get
```
leMoment().get('year') // 2017
leMoment().get('month') // 12      0,1,2...10,11
leMoment().get('date') // 6         1,2,.30,31
leMoment('2017/12/28').get('week') // 52        0,1,,...51,52
leMoment('2019/1/3').get('day') // 3     0,1,..6,7
leMoment('2019/1/3').get('weekdays') // 3     0,1,..6,7
leMoment().get('hour') // 19
leMoment().get('minute') // 36
leMoment().get('second') // 15
leMoment().get(''millisecond) // 787

```
###set
```
leMoment().set({
    year: 2017,     // years, y , YYYY
    month: 11,      // months, M, MM
    day: 6,         // days, d , DD
    hour: 19,       // hours, h, HH
    minute: 20,     // minutes, m, mm
    second: 30,     // seconds, s, ss
    millisecond: 133 //millisecond, ms
})
```

###add
```
leMoment().add({
    year: 1,     // years, y , YYYY
    month: 2,      // months, M, MM
    day: 3,         // days, d , DD
    hour: 4,       // hours, h, HH
    minute: 5,     // minutes, m, mm
    second: 6,     // seconds, s, ss
    millisecond: 7 //millisecond, ms
})
or
leMoment().add(1, 'day')
// 也可以传负数 效果等同于subtract
```

###subtract
```
leMoment().subtract({
    year: 1,     // years, y , YYYY
    month: 2,      // months, M, MM
    day: 3,         // days, d , DD
    hour: 4,       // hours, h, HH
    minute: 5,     // minutes, m, mm
    second: 6,     // seconds, s, ss
    millisecond: 7 //millisecond, ms
})
or
leMoment().subtract(1, 'day')
// 也可以传负数 效果等同于add
```

