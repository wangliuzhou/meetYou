module.exports = {
  education: ["初中", "高中", "大专", "本科", "海归", "硕士", "博士"],
  work: ["公务员", "事业编制", "事业无编制", "国企", "自营公司", "私企", "个体工商", "自由职业", "学生", "其他"],
  marry: ["单身", "有交往对象", "已婚", "离异"],
  age: CreatSingalArry(data().age_start, data().age_end),


}

function data() {
  let data = {
    age_start: 18,
    age_end: 65,
  }
  return data
}

// 制造单数组。
function CreatSingalArry(s, e) {
  let Array = [];
  for (let i = s; i < e; i++) {
    Array.push(i);
  }
  return Array
}