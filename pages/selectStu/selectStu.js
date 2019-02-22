var url = getApp().globalData.url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    card: '',
    tel: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    });
    var that = this;
    wx.request({
      url: url + 'interface/schoolStatus/getSchoolStatusDetail.do',
      data: {
        schoolId: wx.getStorageSync('schoolId'),
        unionId: wx.getStorageSync('unionid')
      },
      method: 'GET',
      header: {
        token: wx.getStorageSync('token') // 默认值
      },
      success: function(res) {
        wx.hideLoading();
        console.log(res.data)
        if (res.data.rtnCode == 10000) {
          that.setData({
            data: res.data.rtnData,
          });
        } else {
          console.log('查询学生接送卡绑定信息失败');
        }
      }
    });
  },

  // 搜索
  bindSelect: function() {
    var that = this;
    var a = that.data;
    var regCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    var regTel = /^[1][3,4,5,7,8][0-9]{9}$/;
    //姓名
    if (!a.name) {
      wx.showToast({
        title: '请输入学生姓名！',
        icon: 'none'
      });
      return;
    } else if (a.name.length < 2) {
      wx.showToast({
        title: '学生姓名至少为2个字！',
        icon: 'none'
      });
      return;
    }
    // 身份证号
    if (a.card && regCard.test(a.card) === false) {
      wx.showToast({
        title: '学生身份证号不正确！',
        icon: 'none'
      });
      return;
    }
    //手机号
    if (a.tel && regTel.test(a.tel) === false) {
      wx.showToast({
        title: '第一监护人手机号格式不正确！',
        icon: 'none'
      });
      return;
    }
    if (!a.card && !a.tel) {
      wx.showToast({
        title: '请输入学生身份证号或第一监护人手机号任一项！',
        icon: 'none'
      });
      return;
    }

    // 搜索接口
    wx.request({
      url: url + 'interface/schoolStatus/getSchoolStatusDetail.do',
      data: {
        phone: that.data.tel,
        cardId: that.data.card,
        name: that.data.name
      },
      method: 'GET',
      header: {
        token: wx.getStorageSync('token') // 默认值
      },
      success: function(res) {
        if (res.data.rtnCode == 10000) {
          var resuleList = res.data.rtnData;
          console.log(resuleList)
          if (!resuleList.length) {
            wx.showToast({
              title: '该学生不存在！',
              icon: 'none'
            });
          } else {
            that.setData({
              resuleList: resuleList
            });
            // 改装
            var itemList = [];
            for (var i in resuleList) {
              var item = resuleList[i].name + "  " + resuleList[i].schoolName
              itemList.push(item)
            }
            //弹窗
            wx.showActionSheet({
              itemList: itemList,
              success: function (res) {
                console.log(res.tapIndex)
                var tapIndex = res.tapIndex;
                //查找userid
                var userid = resuleList[tapIndex].usersid;
                wx.navigateTo({
                  url: '../card/card?detail=' + 1 + '&userid=' + userid
                })
              },
              fail: function (res) {
              }
            })
          }
        } else {
          console.log('查询学生接送卡绑定信息失败');
        }
      }
    });
  },

  //事件绑定
  inputName: function(e) {
    var name = e.detail.value;
    this.setData({
      name: name
    });
  },
  inputCard: function(e) {
    var card = e.detail.value;
    this.setData({
      card: card
    });
  },
  inputTel: function(e) {
    var tel = e.detail.value;
    this.setData({
      tel: tel
    });
  },

  detail: function(e) {
    var userid = e.currentTarget.dataset.userid;
    wx.redirectTo({
      url: '../card/card?detail=' + 1 + '&userid=' + userid,
    })
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

  }
})