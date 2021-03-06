const cloud = require('wx-server-sdk')
exports.main = async (event, context) => {
  const wxContext = await cloud.getWXContext();
  cloud.init({
    env: wxContext.ENV
  });
  const db = cloud.database()
  const $ = db.command.aggregate
  // 接收分类
  const {
    searchCode,
    userCode
  } = event
  console.log(event)
  const res = await db.collection('users').where({
    userCode: searchCode
  }).get()
  let userInfo = res.data[0];
  if (userInfo.status == 1 || 6) {
    let base = userInfo.base
    delete userInfo.asking;
    delete userInfo.comments;
    delete userInfo.createTime;
    delete userInfo.openid;
    delete userInfo.show;
    delete userInfo.password;
    delete userInfo._id;
    delete base.cellphone;
    delete base.wechat;
    delete base.name;
    delete base.contact_info;
    delete userInfo.base;
    // let time = new Date(base.birthday)
    base.age = Calculator.age(base.birthday)
    base.shengxiao = Calculator.shengxiao(base.birthday)
    base.xingzuo = Calculator.astro(base.birthday)
    delete base.birthday;
    return {
      code: 1,
      userInfo,
      base,
    }
  } else {
    return {
      code: userInfo.status,
    }
  }

};

function yeardifference(start, end) {
  //stime是必须要01 Jan 1970 00:00:00 GMT这样的格式
  var stime = Date.parse(new Date(start));
  var etime = Date.parse(new Date(end));
  var usedTime = end - start;
  var days = Math.floor(usedTime / (24 * 3600 * 1000));
  var years = Math.ceil(days / (365)); //算出年，然后向上取整

  return years;
}
var Calculator = function () {
  /* 计算生肖支持简写生日，比如01，转换为2001，89转换为1989； 支持任何可以进行时间转换的格式，比如'1989/01/01','1989 01'等 */
  function getShengXiao(birth) {
    birth += '';
    var len = birth.length;
    if (len < 4 && len != 2) {
      return "";
    }
    if (len == 2) {
      birth - 0 > 30 ? birth = '19' + birth : birth = '20' + birth;
    }
    var year = (new Date(birth)).getFullYear();
    var arr = ['猴', '鸡', '狗', '猪', '鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊'];
    return /^\d{4}$/.test(year) ? arr[year % 12] : "";
  }

  /*计算星座 */
  function getAstro(str) {
    var y = str.substr(0, 4);
    m = str.substr(5, 2);
    d = str.substr(8, 2);
    var constellations = [{
      "Start": 121,
      "End": 220,
      "Name": "水平座"
    }, {
      "Start": 221,
      "End": 320,
      "Name": "双鱼座"
    }, {
      "Start": 321,
      "End": 420,
      "Name": "白羊座"
    }, {
      "Start": 421,
      "End": 520,
      "Name": "金牛座"
    }, {
      "Start": 521,
      "End": 620,
      "Name": "双子座"
    }, {
      "Start": 621,
      "End": 720,
      "Name": "巨蟹座"
    }, {
      "Start": 721,
      "End": 820,
      "Name": "狮子座"
    }, {
      "Start": 821,
      "End": 920,
      "Name": "处女座"
    }, {
      "Start": 921,
      "End": 1020,
      "Name": "天秤座"
    }, {
      "Start": 1021,
      "End": 1120,
      "Name": "天蝎座"
    }, {
      "Start": 1121,
      "End": 1220,
      "Name": "射手座"
    }];
    /*
     * 判断日期有效性 1,3,5,7,8,10,12为31天 2月润年29，非润年28 4,6,9,11为30天
     */
    var daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // 检测年份
    if (y < 1970 || y > 2099)
      return "";

    // 检测月份
    if (m < 1 || m > 12)
      return "";

    // 检测日期
    var mDays = daysInMonth[m - 1];
    // 如果是二月，要根据年份计算天数，不是二月时略过此计算
    if (m == 2) {
      mDays = GetSpecialDays(y)
    }

    // 判断日数据是不是在月份的有效天范围
    if (d < 0 || d > mDays)
      return "";

    // 好了，走到这一步，说明上面的验证都TM过了。
    // 这才判断是哪一个星座
    // 星座座标等于m*100 + d
    var pos = parseInt(m * 100) + parseInt(d);
    for (var i in constellations) {
      if (pos >= constellations[i].Start && pos <= constellations[i].End) {
        return constellations[i].Name;
      }
    }
  }
  // 根据年份计算二月天数
  function GetSpecialDays(y) {
    if (y % 400 == 0 || (y % 4 == 0 && y % 100 != 0))
      return 29;
    return 28;
  }

  /* 计算年龄
   * 支持传递["yyyy-MM-dd"]等格式的字符串	 */
  function getAge(str) {
    var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
    if (r == null)
      return false;
    var d = new Date(r[1], r[3] - 1, r[4]);
    if (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] &&
      d.getDate() == r[4]) {
      var Y = new Date().getFullYear();
      return (Y - r[1]);
    }
    return "";
  }

  return {
    shengxiao: getShengXiao,
    astro: getAstro,
    age: getAge
  }
}();