// 这是会员资料需要的数据
module.exports = {
  BodyFatRate,
  base: {
    sexArr: ["男", "女"],
    marry_Arr: ["未婚", "短婚未育", "离异带男孩", "离异带女孩", "离异对方带男孩", "离异对方带女孩", "丧偶"],
    hight_Arr: CreatSingalArry(data().start_hight_num, data().end_hight_num),
    weight_Arr: CreatSingalArry(data().start_weight_num, data().end_weight_num),
    area_Arr: getAreaArr(!1),
    eduction_Arr: ["初中及以下", "中专", "高中", "大专", "本科", "海归", "硕士", "博士", ],
    work_type_Arr: ["公务员", "事业编制", "事业单位无编制", "国企", "外企/私企", "企业主", "个体工商户", "自由职业", "待业", "学生"],
    real_estate_Arr: ["还未购房", "有房，但有贷款", "有一套全款房", "有两套房", "有三套房", "有三套以上"],
    habits_Arr: [{
      name: "好酒",
      value: 0,
      checked: !1
    }, {
      name: "抽烟",
      value: 1,
      checked: !1
    },{
      name: "打牌",
      value: 2,
      checked: !1
    },],
  
    family_member_Arr: [{
      name: "父亲",
      value: 0,
      checked: 1
    }, {
      value: 1,
      name: "母亲",
      checked: 1
    }, {
      name: "父亲（离)",
      value: 2,
    }, {
      value: 3,
      name: "母亲（离)"
    }, {
      value: 4,
      name: "哥哥"
    }, {
      value: 5,
      name: "姐姐"
    }, {
      value: 6,
      name: "弟弟"
    }, {
      value: 7,
      name: "妹妹"
    }, {
      value: 8,
      name: "儿子"
    }, {
      value: 8,
      name: "二儿子"
    }, {
      value: 9,
      name: "女儿"
    }, {
      value: 10,
      name: "二女儿"
    }, {
      value: 11,
      name: "儿子<归对方>"
    }, {
      value: 12,
      name: "女儿<归对方>"
    }, {
      value: 13,
      name: "我一个人"
    }],
  },
  telents_Arr: [{
    name: "音乐方面（如唱歌，乐器）",
    value: 0,
    checked: !1
  }, {
    name: "美食方面（如烘焙，厨艺）",
    value: 1,
    checked: !1
  }, {
    name: "表演方面（如越剧，小品，街舞，魔术）",
    value: 2,
    checked: !1
  }, {
    name: "运动方面（如球类，跆拳道，跑酷）",
    value: 3,
    checked: !1
  }, {
    name: "书画方面（如绘画，书法，ps）",
    value: 4,
    checked: !1
  }, {
    name: "户外方面（如摄影，户外，自驾）",
    value: 5,
    checked: !1
  }, {
    name: "其他方面（如，茶道，插画）",
    value: 5,
    checked: !1
  }, ],
  asking: {
    marry_Arr_asking: ["无要求", "未婚", "短婚未育", "离异无子女", "丧偶"],
    age_Arr_asking: CreatArry(data().age_start, data().age_end),
    weight_Arr_asking: CreatArry(data().start_weight_num, data().end_weight_num),
    hight_Arr_asking: CreatArry(data().start_hight_num, data().end_hight_num),
    education_Arr_asking: ["无要求", "大专", "本科", "海归", "硕士", "博士", ],
    reigon_Arr_asking: ["无要求", "本地人", "本省人", "非本省但本地有房", "外地人也可"],
    work_type_Arr_asking: ["无要求", "公务员", "事业编制", "事业单位无编制", "国企", "外企", "企业主", "个体工商户"],
    real_estate_Arr_asking: ["无要求", "要有多套房", "有房，无贷款", "有房，接受有贷款", "婚后一起买", "可以和公婆住"],
    family_member_Arr_asking: ["无要求", "父母双全", "单亲也可", "没有父母也可"],
    income_Arr_asking: ["无要求", "10万以上", "20万以上", "30万以上", "40万以上", "50万以上", "60万以上", "70万以上", "80万以上", "90万以上", "100万以上"],
  },

  marryPlan: ["下个月", "半年左右", "一年内", "还没确定"],
  act_type: ['室内', '室外', '公益', '特别', '大型']
}

function data() {
  let data = {
    start_hight_num: 150,
    end_hight_num: 180,
    start_weight_num: 80,
    end_weight_num: 180,
    age_start: '18',
    age_end: '45',
  }
  return data
}
//制造区域数组
function getAreaArr(a) {
  return a ? [{
      name: "不限",
      selected: !0
    }, {
      name: "越城区"
    }, {
      name: "柯桥区"
    }, {
      name: "上虞区"
    }, {
      name: "诸暨市"
    }, {
      name: "嵊州市"
    }, {
      name: "新昌县"
    }, {
      name: "杭州市"
    }, {
      name: "宁波市"
    },
    {
      name: "其他省市"
    }
  ] : ["越城区", "柯桥区", "上虞区", "诸暨市", "嵊州市", "新昌县", "杭州市", "宁波市", "其他省市"];
}

function CreatArry(s, e) {
  for (var a = [
      ["无要求"],
      ["无要求"]
    ], i = s; i <= e; i++) i < e && a[0].push(i),
    i > s && a[1].push(i);
  return a
}

// 制造单数组。
function CreatSingalArry(s, e) {
  let Array = [];
  for (let i = s; i < e; i++) {
    Array.push(i);
  }
  return Array
}
// 计算体脂，函数传入w：体重（斤），h身高（cm），a，年龄（岁），s性别
// ①BMI=体重（公斤）÷（身高×身高）（米）
// ②体脂率公式：1.2×BMI+0.23×年龄-5.4-10.8×性别（男为1，女为0）
function BodyFatRate(w, h, a, s) {
  var high = h / 100;
  var bmi = w / 2 / high / high;
  var fatRate = 1.2 * bmi + 0.23 * a - 5.4 - 10.8 * s;
  var result = Math.round(fatRate * 100) / 100;
  return result
}

// 最新会员那里没有more、了，推荐单身那里，没有more，加入推荐
// 如果该人上传了照片，就用照片，就变成了推荐，
// 后期改成付出一元钱，就变成推荐，如果没有上传照片，照片设置为空照片（是一个背影的人