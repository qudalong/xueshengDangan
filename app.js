//app.js
App({
  onLaunch: function () {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          wx.request({
            url: this.globalData.url + 'mobile/loginWeiXin.do',
            method: 'POST',
            data: {
              platform: 3,
              code: res.code
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              if (res.data.rtnCode == 10000) {
                wx.setStorageSync('openid', res.data.rtnData[0].openid);
                wx.setStorageSync('session_key', res.data.rtnData[0].session_key);
                wx.setStorageSync('sessionid', res.data.rtnData[0].sessionid);
                wx.setStorageSync('unionid', res.data.rtnData[0].unionid);
                wx.setStorageSync('token', res.data.token);
                wx.setStorageSync('bindPublic', res.data.bindPublic);
              } else {
              }
            }
          });
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    // url: 'http://120.194.28.114:10005/lbt-xcx-server/'//李强
    // url: 'https://xcx.lebeitong.com/test/'
    url: 'https://xcx.lebeitong.com/'
  }
})