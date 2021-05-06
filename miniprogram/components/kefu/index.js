var app = getApp()
var config = require('../../config')
Component({
    properties: {
      
    },
    options: {
        styleIsolation: 'apply-shared'
      },
    data: {
        kefu_qrcode_url:'',
        kefu_num:''
    },
    attached: function() {
        this.setData({
            kefu_qrcode_url:config.kefu_qrcode_url,
            kefu_num:config.kefu_num
        })
    },
    methods: {
        copy_weixin: function(t) {
            wx.setClipboardData({
                data: this.data.kefu_num,
                success: function(t) {
                    wx.showToast({
                        title: "已复制"
                    });
                }
            });
        }
    }
});