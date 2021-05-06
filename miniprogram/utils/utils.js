// 节流，防抖，深度拷贝，定位，文件转Base64，两个时间的年差

function debounce(fn, interval) {
  var timer;
  var gapTime = interval || 1000; //间隔时间，如果interval不传，则默认1000ms
  return function () {
    clearTimeout(timer);
    var context = this;
    var args = arguments; //保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
    timer = setTimeout(function () {
      fn.call(context, args);
    }, gapTime);
  };
}
// 防抖
function throttle(fn, interval) {
  var enterTime = 0; //触发的时间
  var gapTime = interval || 300; //间隔时间，如果interval不传，则默认300ms
  return function () {
    var context = this;
    var backTime = new Date(); //第一次函数return即触发的时间
    if (backTime - enterTime > gapTime) {
      fn.call(context, arguments);
      enterTime = backTime; //赋值给第一次触发的时间，这样就保存了第二次触发的时间
    }
  };
}
// 节流
function deepClone(origin, target) {
  var target = target || {};
  var toStr = Object.prototype.toString;
  var arrStr = "[object Array]";
  for (var prop in origin) {
    if (origin.hasOwnProperty(prop)) {
      if (origin[prop] !== null && typeof (origin[prop]) == 'object') { //1.判断是不是引用值
        if (toStr.call(origin[prop]) == arrStr) { //2.判断是数组还是对象
          target[prop] = [];
        } else {
          target[prop] = {};
        }
        deepClone(origin[prop], target[prop]); //递归
      } else {
        target[prop] = origin[prop];
      }
    }
  }
  return target;
  //没有传target 就把它 return出去
}
// 深度拷贝，可以拷贝数组和对象，值
function toBase64(o) {
  console.log(o)
  return 'data:image/png;base64,' + wx.getFileSystemManager().readFileSync(o, 'base64')
}
// 文件转base64

//   WGS84转GCj02
//   @param lng
//   @param lat
//   @returns {*[]}

function wgs84togcj02(lng, lat) {
  var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
  var PI = 3.1415926535897932384626;
  var a = 6378245.0;
  var ee = 0.00669342162296594323;
  if (out_of_china(lng, lat)) {
    return [lng, lat]
  } else {
    var dlat = transformlat(lng - 105.0, lat - 35.0);
    var dlng = transformlng(lng - 105.0, lat - 35.0);
    var radlat = lat / 180.0 * PI;
    var magic = Math.sin(radlat);
    magic = 1 - ee * magic * magic;
    var sqrtmagic = Math.sqrt(magic);
    dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
    dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
    var mglat = lat + dlat;
    var mglng = lng + dlng;
    return [mglng, mglat]
  }
}

// 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
// 即谷歌、高德 转 百度
// @param lng
// @param lat
// @returns {*[]}
function gcj02tobd09(lng, lat) {
  var that = this
  var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
  var PI = 3.1415926535897932384626;
  var a = 6378245.0;
  var ee = 0.00669342162296594323;
  var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
  var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
  var bd_lng = z * Math.cos(theta) + 0.0065;
  var bd_lat = z * Math.sin(theta) + 0.006;
  return [bd_lng, bd_lat]
}

function transformlat(lng, lat) {
  var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
  var PI = 3.1415926535897932384626;
  var a = 6378245.0;
  var ee = 0.00669342162296594323;
  var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
  ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
  ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
  return ret
}

function transformlng(lng, lat) {
  var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
  var PI = 3.1415926535897932384626;
  var a = 6378245.0;
  var ee = 0.00669342162296594323;
  var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
  ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
  ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
  return ret
}

// 判断是否在国内，不在国内则不做偏移
//  @param lng
//  @param lat
//  @returns {boolean}
function out_of_china(lng, lat) {
  return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false);
}

function getUserLocation() {
  let ssssss1, ssssss2
  wx.getLocation({
    type: 'wgs84', //wgs84
    success: (res) => {
      var lat = res.latitude
      var lng = res.longitude
      console.log(lat + "||latitude");
      console.log(lng + "||longitude");
      // wgs84转百度坐标系
      var ssws = wgs84togcj02(lng, lat)
      ssws = gcj02tobd09(ssws[0], ssws[1])
      //解决定位偏移
      ssssss1: ssws[1] - 0.000160
      ssssss2: ssws[0] - 0.000160
    }
  })
  return ssssss1, ssssss2
  // 这里要returen了。
}
function yeardifference(start, end) {
  //stime是必须要01 Jan 1970 00:00:00 GMT这样的格式
  var stime = Date.parse(new Date(start));
  var etime = Date.parse(new Date(end));
  var usedTime = end - start;
  var days = Math.floor(usedTime / (24 * 3600 * 1000));
  var years = Math.ceil(days / (365)); //算出年，然后向上取整

  return years;
}
// 格式化时间
const formatTime = (time, option) => {
  const date = new Date(time)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const week = date.getDay()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
    //获取 年月日
  if (option == 'YY-MM-DD') return [year, month, day].map(formatNumber).join('-')
  //获取 年月
  if (option == 'YY-MM') return [year, month].map(formatNumber).join('-')
  //获取 年
  if (option == 'YY') return [year].map(formatNumber).toString()
  //获取 月
  if (option == 'MM') return  [mont].map(formatNumber).toString()
  //获取 日
  if (option == 'DD') return [day].map(formatNumber).toString()
  //获取 年月日 周一 至 周日
  if (option == 'YY-MM-DD Week')  return [year, month, day].map(formatNumber).join('-') + ' ' + getWeek(week)
  //获取 月日 周一 至 周日
  if (option == 'MM-DD Week')  return [month, day].map(formatNumber).join('-') + ' ' + getWeek(week)
  //获取 周一 至 周日
  if (option == 'Week')  return getWeek(week)
  //获取 时分秒
  if (option == 'hh-mm-ss') return [hour, minute, second].map(formatNumber).join(':')
  //获取 时分
  if (option == 'hh-mm') return [hour, minute].map(formatNumber).join(':')
  //获取 分秒
  if (option == 'mm-dd') return [minute, second].map(formatNumber).join(':')
  //获取 时
  if (option == 'hh')  return [hour].map(formatNumber).toString()
  //获取 分
  if (option == 'mm')  return [minute].map(formatNumber).toString()
  //获取 秒
  if (option == 'ss') return [second].map(formatNumber).toString()
  //默认 时分秒 年月日
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getWeek = n => {
  switch(n) {
    case 1:
      return '星期一'
    case 2:
      return '星期二'
    case 3:
      return '星期三'
    case 4:
      return '星期四'
    case 5:
      return '星期五'
    case 6:
      return '星期六'
    case 7:
      return '星期日'
  }
}

module.exports = {
  debounce,
  throttle,
  deepClone,
  toBase64,
  getUserLocation,
  yeardifference,
  formatTime,
}