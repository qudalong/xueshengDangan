var url = getApp().globalData.url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: []
  },
  bindRegionChange: function(e) {
    this.setData({
      region: e.detail.value
    })
  },
  onLoad: function(options) {
    var that = this;
    var a = that.data;
    var schoolId = options.schoolId
    var scene = decodeURIComponent(options.scene);
    if ((scene && scene != 'undefined') || schoolId) {
      wx.navigateTo({
        url: '../step1/step1',
      });
    }
  },
  startEnterRoll: function() {
    var that = this;
    var a = that.data;
    if (!a.schoolCode || (a.schoolCode.length !== 6 && a.schoolCode.length !== 11)) {
      wx.showToast({
        title: '请输入正确的园所码或手机号',
        icon: 'none'
      });
      return;
    } else if (a.schoolCode.length == 11 && !(/^1(3|4|5|7|8)\d{9}$/.test(a.schoolCode))) {
      wx.showToast({
        title: '请输入正确手机号',
        icon: 'none'
      });
      return;
    }
    var _url = '';
    var _data = {};
    var txt = '';
    a.schoolCode.length == 6 ? _url = 'interface/schoolStatus/getSchoolInfoBySchoolCode.do' : _url = 'interface/schoolStatus/getEduunitInfoByMasterPhone.do';
    a.schoolCode.length == 6 ? _data = {
      schoolCode: a.schoolCode
    } : _data = {
      phone: a.schoolCode
    };
    a.schoolCode.length == 6 ? txt = '园所码不存在' : txt = '未查找到该手机号';
    wx.request({
      url: url + _url,
      data: _data,
      method: 'GET',
      header: {
        token: wx.getStorageSync('token') // 默认值
      },
      success: function(res) {
        if (res.data.rtnCode == 10000) {
          var dataInfo = res.data.rtnData;
          if (a.schoolCode.length == 11&&dataInfo) {
            //选择园所
            var itemList = [];
            for (var i in dataInfo) {
              var schoolName = dataInfo[i].schoolName;
              itemList.push(schoolName);
            }
            var tabList = Array.from(new Set(itemList));
            wx.showActionSheet({
              itemList: tabList,
              success: function(res) {
                var tapIndex = res.tapIndex;
                var schoolName = tabList[tapIndex];
                for (var i in dataInfo) {
                  if (dataInfo[i].schoolName == schoolName){
                    var schoolId = dataInfo[i].schoolId;
                  }
                }
                wx.navigateTo({
                  url: '../step1/step1?schoolId=' + schoolId + "&phone=" + a.schoolCode
                })
              }
            })
          }else{
            wx.navigateTo({
              url: '../step1/step1?schoolId=' + res.data.rtnData[0]
            })
          }
          // var schoolId;
          // a.schoolCode.length == 6 ? schoolId = res.data.rtnData[0] : schoolId = res.data.rtnData[0].schoolId;
          // console.log('schoolId=====' + schoolId)
          // // wx.navigateTo({
          // //   url: '../step1/step1?schoolId=' + schoolId + "&phone=" + a.schoolCode
          // // })
        } else {
          wx.showToast({
            title: txt,
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

  selectRoll: function() {
    wx.navigateTo({
      url: '../select/select',
    });
  },
  bindCard: function() {
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