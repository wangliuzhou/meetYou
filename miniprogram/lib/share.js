var s = [
  "知道未来没有你，我好像也不急着往前走了。",
  "这是我家孩子的信息，帮忙介绍下吧！",
  "你和我门当户对吗？",
  "急寻对象一枚，非诚勿扰。",
  "准备好甜甜的恋爱吗，快来找我。",
  "有趣的灵魂快看过来~~",
  "很快又到情人节了。",
  "快来登记领取我吧",
  "这是我的名片，把你的和我交换一下把",
  "什么时候才能谈恋爱啊~~嗷嗷嗷",
  "愿得一人心，白首不分离！",
  "太上老君，急急如律令，快来一个对象！",
  "你的过去，我来不及参与，但你的未来我奉陪到底。",
  "余生请多多指教。",
  "我们的遇见，用光了所有运气。",
  "用光了所有运气，才换来与你的遇见。",
  "我好累，一个人撑伞，一个人擦泪",
  "幸福就是我在想你的时候，你恰好出现我身边。",
  "世界人来人往，大家擦肩而过。",
  "你不来，我不老。",
  "见山是山，见水是水，见你是全世界。",
  "你陪着我的时候，我从没羡慕过任何人。",
  "爱，或者被爱，都不如相爱。",
  "身边有你，幸福无比~~",
  "多希望你无人问津，除了我。",
  "你若不离不弃，我便生死相依。",
  "你好，我的小太阳，我在这里。",
  "以前没有遇到你，是命运的不对",
  "年华如刀，共你余生。",
  "我觉得这个人很不错，你看看。",
  "我觉得这个人很适合你，你看看。",
];
module.exports = {
  getoneline: function () {
    var t = s.length + 1;
    var random = Math.floor(Math.random() * t);
    return s[random]
  }

}