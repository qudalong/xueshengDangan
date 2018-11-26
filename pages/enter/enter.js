var url = getApp().globalData.url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: []
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  onLoad: function(options) {
    var that = this;
    var a = that.data;
    var schoolId = options.schoolId
    var scene = decodeURIComponent(options.scene);
    console.log('scene========' + scene)
    //如果扫码或分享
    if ((scene && scene != 'undefined') || schoolId){
      wx.navigateTo({
        url: '../step1/step1',
      });
    }


  },
  startEnterRoll: function() {
    var that = this;
    var a = that.data;
    if (!a.schoolCode) {
      wx.showToast({
        title: '请输入园所码',
        icon: 'none'
      });
      return;
    } else if (a.schoolCode.length<6) {
      wx.showToast({
        title: '园所码格式不正确',
        icon: 'none'
      });
      return;
    }
    wx.request({
      url: url + 'interface/schoolStatus/getSchoolInfoBySchoolCode.do',
      data: {
        schoolCode: a.schoolCode
      },
      method: 'GET',
      header: {
        token: wx.getStorageSync('token') // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.rtnCode == 10000) {
          wx.navigateTo({
            url: '../step1/step1?schoolId=' + res.data.rtnData[0]
          })
        } else{
          wx.showToast({
            title: '园所码不存在',
            icon: 'none'
          });
        }
      }
    });
  },

  enter: function(e) {
    this.setData({
      schoolCode: e.detail.value
    })
  },

  selectRoll: function () {
    wx.navigateTo({
      url: '../select/select',
    });
  },
  bindCard: function () {
    wx.navigateTo({
      url: '../card/card?init=' + 1,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})