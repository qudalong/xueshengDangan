var url = getApp().globalData.url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:[],
    card: '',
    tel: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // var that = this;
    // wx.showLoading({
    //   title: '加载中',
    // });
    // wx.request({
    //   url: url + 'interface/schoolStatus/getSchoolStatusDetail.do',
    //   data: {
    //     schoolId: wx.getStorageSync('schoolId')||'',
    //     unionId: wx.getStorageSync('unionid')
    //   },
    //   method: 'GET',
    //   header: {
    //     token: wx.getStorageSync('token') // 默认值
    //   },
    //   success: function(res) {
    //     // console.log(res.data)
    //     wx.hideLoading();
    //     if (res.data.rtnCode == 10000) {
    //       that.setData({
    //         dataList: res.data.rtnData,
    //       });
    //     } else {
    //       console.log('查询学生接送卡绑定信息失败');
    //     }
    //   }
    // });
  },

  // 搜索
  bindSelect: function() {
    var that = this;
    var a = that.data;
    var regCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    var regTel = /^[1][3,4,5,7,8][0-9]{9}$/;
    // //姓名
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

    // 接口
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
              itemList.push(item);
              that.setData({
                isOpen: resuleList[i].isOpen
              });
            }
            //弹窗
            wx.showActionSheet({
              itemList: itemList,
              success: function(res) {
                console.log(res.tapIndex)
                var tapIndex = res.tapIndex;
                //选中的obj
                var itemData = resuleList[tapIndex];
                wx.navigateTo({
                  url: '../details/details?name=' + itemData.name + "&phone=" + that.data.tel + "&cardId=" + that.data.card + "&apptype=" + itemData.appType + "&usersid=" + itemData.usersid + "&isOpen=" + that.data.isOpen
                })
              },
              fail: function(res) {}
            })
          }
        } else {
          console.log('查询学生接送卡绑定信息失败');
        }
      }
    });
  },

  //
  details: function(e) {
    var that = this;
    var name = e.currentTarget.dataset.name;
    var phone = e.currentTarget.dataset.phone;
    var cardId = e.currentTarget.dataset.cardid;
    var usersid = e.currentTarget.dataset.usersid;
    var isOpen = e.currentTarget.dataset.isopen;//判断详情显示
    wx.navigateTo({
      url: '../details/details?name=' + name + "&phone=" + phone + "&cardId=" + cardId + "&isOpen=" + isOpen + "&usersid=" + usersid
    })
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