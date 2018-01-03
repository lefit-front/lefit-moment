var leMoment = require('../src/moment')
var assert = require('assert')

describe('leMoment测试', function () {
    let now = new Date()
    describe('leMoment可接受的值', function () {
        it('Number', function () {
            assert.strictEqual(now.valueOf(), leMoment(now.getTime()).valueOf())
        })
        it('Object', function () {
            assert.strictEqual(now.valueOf(), leMoment(now).valueOf())
        })
        describe('String自动解析模版', function () {
            it('1', function () {
                assert.strictEqual(1514736000000, leMoment('2018/1/1').valueOf())
            })
            it('2', function () {
                assert.strictEqual(1514736000000, leMoment('2018/01/01').valueOf())
            })
            it('3', function () {
                assert.strictEqual(1514736000000, leMoment('18/01/01').valueOf())
            })
            it('4', function () {
                assert.strictEqual(1514754360000, leMoment('2018/01/01 05:06').valueOf())
            })
            it('5', function () {
                assert.strictEqual(1514754360000, leMoment('2018/01/01 5:6').valueOf())
            })
            it('6', function () {
                assert.strictEqual(1514754360000, leMoment('2018/01/01 05:06').valueOf())
            })
            it('7', function () {
                assert.strictEqual(1514754372000, leMoment('2018/01/01 05:06:12').valueOf())
            })
        })
        describe('String传format值解析', function () {
            it('1', function () {
                assert.strictEqual(1514736000000, leMoment('2018/1/1', 'YYYY/M/D').valueOf())
            })
            it('2', function () {
                assert.strictEqual(1514736000000, leMoment('2018/01/01', 'YYYY/MM/DD').valueOf())
            })
            it('3', function () {
                assert.strictEqual(1514736000000, leMoment('18/01/01', 'YY/MM/DD').valueOf())
            })
            it('4', function () {
                assert.strictEqual(1514754360000, leMoment('2018/01/01 05:06', 'YYYY/MM/DD HH:mm').valueOf())
            })
            it('5', function () {
                assert.strictEqual(1514754360000, leMoment('2018/01/01 5:6', 'YYYY/MM/DD h:m').valueOf())
            })
            it('6', function () {
                assert.strictEqual(1514754360000, leMoment('2018/01/01 05:06', 'YYYY/MM/DD HH:mm').valueOf())
            })
            it('7', function () {
                assert.strictEqual(1514754372000, leMoment('2018/01/01 05:06:12', 'YYYY/MM/DD HH:mm:ss').valueOf())
            })
        })
        // it("String: ''", function () {
        //     assert.strictEqual(now.valueOf(), leMoment('').valueOf())
        // })
        // it('undefined', function () {
        //     assert.strictEqual(new Date().valueOf(), leMoment(undefined).valueOf())
        //     assert.strictEqual(new Date().valueOf(), leMoment().valueOf())
        // })
        describe('各种不一样参数的Object', function () {
            it('year, month, date...', function () {
                assert.strictEqual(1512559230000, leMoment({
                    year: 2017,
                    month: 11,
                    date: 6,
                    hour: 19,
                    minute: 20,
                    second: 30,
                    millisecond: 0
                }).valueOf())
            })
            it('years, months, date...', function () {
                assert.strictEqual(1512559230000, leMoment({
                    years: 2017,
                    months: 11,
                    date: 6,
                    hours: 19,
                    minutes: 20,
                    seconds: 30,
                    milliseconds: 0
                }).valueOf())
            })
            it('YYYY, MM, DD', function () {
                assert.strictEqual(1512559230000, leMoment({
                    YYYY: 2017,
                    MM: 11,
                    DD: 6,
                    hours: 19,
                    minutes: 20,
                    seconds: 30,
                    milliseconds: 0
                }).valueOf())
            })
            it('y, M, d', function () {
                assert.strictEqual(1512559230123, leMoment({
                    y: 2017,
                    M: 11,
                    d: 6,
                    h: 19,
                    m: 20,
                    s: 30,
                    ms: 123
                }).valueOf())
            })
        })
    })
    describe('unix', function () {
        it('1', function () {
            assert.strictEqual(1514736000, leMoment('2018/1/1').unix())
        })
        it('2', function () {
            assert.strictEqual(~~(now.valueOf() / 1000), leMoment(now).unix())
        })
        it('3', function () {
            assert.strictEqual(~~(now.valueOf() / 1000), leMoment.unix((now.valueOf()) / 1000).unix())
        })
    })
    
    describe('get', function () {
        it('1', function () {
            assert.strictEqual(now.getFullYear(), leMoment(now).get('year'))
        })
        it('2', function () {
            assert.strictEqual(now.getMonth(), leMoment(now).get('month'))
        })
        it('3', function () {
            assert.strictEqual(now.getDate(), leMoment(now).get('date'))
        })
        it('4', function () {
            assert.strictEqual(now.getHours(), leMoment(now).get('hour'))
        })
        it('5', function () {
            assert.strictEqual(now.getMinutes(), leMoment(now).get('minute'))
        })
        it('6', function () {
            assert.strictEqual(now.getMilliseconds(), leMoment(now).get('millisecond'))
        })
        it('7', function () {
            assert.strictEqual(now.getDay(), leMoment(now).get('day'))
        })
        it('8', function () {
            assert.strictEqual(now.getDay(), leMoment(now).get('weekday'))
        })
        it('9', function () {
            assert.strictEqual(52, leMoment('2017/12/28').get('week'))
        })
        it('9', function () {
            assert.strictEqual(1, leMoment('2018/1/1').get('week'))
        })
        it('10', function () {
            assert.strictEqual(1, leMoment('2018/1/6').get('week'))
        })
        it('11', function () {
            assert.strictEqual(2, leMoment('2018/1/7').get('week'))
        })
    })
    describe('set', function () {
        it('1', function () {
            assert.strictEqual(1495229415123, leMoment('2018/1/1').set({
                year: 2017,
                month: 4,
                date: 20,
                hour: 5,
                minute: 30,
                second: 15,
                millisecond: 123
            }).valueOf())
        })
        it('2', function () {
            assert.strictEqual(1483200000000, leMoment('2018/1/1').set('year', 2017).valueOf())
        })
    })
    describe('add', function () {
        it('1', function () {
            assert.strictEqual(1546358400000, leMoment('2018/1/1').add({
                year: 1,
                date: 1,
            }).valueOf())
        })
        it('2', function () {
            assert.strictEqual(1519835400000, leMoment('2018/1/1').add({
                month: 2,
                minute: 30
            }).valueOf())
        })
        it('3', function () {
            assert.strictEqual(1509467400000, leMoment('2018/1/1').add({
                month: -2,
                minute: 30
            }).valueOf())
        })
        it('4', function () {
            assert.strictEqual(1514757600000, leMoment('2018/1/1').add(360, 'minute').valueOf())
        })
        it('5', function () {
            assert.strictEqual(1546272000000, leMoment('2018/1/1').add(1, 'year').valueOf())
        })
        it('6', function () {
            assert.strictEqual(1512057600000, leMoment('2018/1/1').add(-1, 'month').valueOf())
        })
    })
    describe('subtract', function () {
        it('1', function () {
            assert.strictEqual(1483113600000, leMoment('2018/1/1').subtract({
                year: 1,
                date: 1,
            }).valueOf())
        })
        it('2', function () {
            assert.strictEqual(1509463800000, leMoment('2018/1/1').subtract({
                month: 2,
                minute: 30
            }).valueOf())
        })
        it('3', function () {
            assert.strictEqual(1519831800000, leMoment('2018/1/1').subtract({
                month: -2,
                minute: 30
            }).valueOf())
        })
        it('4', function () {
            assert.strictEqual(1514714400000, leMoment('2018/1/1').subtract(360, 'minute').valueOf())
        })
        it('5', function () {
            assert.strictEqual(1483200000000, leMoment('2018/1/1').subtract(1, 'year').valueOf())
        })
        it('6', function () {
            assert.strictEqual(1517414400000, leMoment('2018/1/1').subtract(-1, 'month').valueOf())
        })
    })
    describe('format && locale', function () {
        it('1', function () {
            assert.strictEqual('2017/12/12', leMoment('2017/12/12').format('YYYY/MM/DD'))
        })
        it('2', function () {
            assert.strictEqual('2017/12/12 12:12:12', leMoment('2017/12/12 12:12:12').format('YYYY/MM/DD HH:mm:ss'))
        })
        it('3', function () {
            assert.strictEqual('2017/12/12 12:12', leMoment('2017/12/12 12:12').format('YYYY/MM/DD HH:mm'))
        })
        it('4', function () {
            assert.strictEqual('18-1-11', leMoment('18-1-11').format('YY-M-D'))
        })
        it('5', function () {
            assert.strictEqual('18-1-11 周四', leMoment('18-1-11').format('YY-M-D dd'))
        })
        it('6', function () {
            assert.strictEqual('18-1-11 Thu', leMoment('18-1-11').locale('en').format('YY-M-D dd'))
        })
        it('7', function () {
            assert.strictEqual('18-1-3 Wednesday', leMoment('18-1-3').locale('en').format('YY-M-D ddd'))
        })
        it('8', function () {
            assert.strictEqual('18-1-3 星期三', leMoment('18-1-3').format('YY-M-D ddd'))
        })
        it('9', function () {
            assert.strictEqual('18年01月03日 00:00 三', leMoment('18-1-3').format('YY年MM月DD日 HH:mm d'))
        })
    })
})