var url = getApp().globalData.url;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var usersid = options.usersid; //从列表查找当前详情
    var phone = options.phone != 'null' ? options.phone : '';
    var cardId = options.cardId != 'null' ? options.cardId : '';
    var name = options.name;
    var isOpen = options.isOpen; //判断详情显示
    that.setData({
      isOpen: isOpen
    });
    console.log('isOpen=' + isOpen)
    console.log('phone=' + phone)
    console.log('cardId=' + cardId)
    // 搜索接口
    wx.request({
      url: url + 'interface/schoolStatus/getSchoolStatusDetail.do',
      data: {
        phone: phone,
        cardId: cardId,
        name: name
      },
      method: 'GET',
      header: {
        token: wx.getStorageSync('token') // 默认值
      },
      success: function(res) {
        if (res.data.rtnCode == 10000) {
          console.log(res)
          if (res.data.rtnData[0]) {
            var data = res.data.rtnData[0];
            //装作去除时分秒
            if (data.birthdayStr) {
              var birthdayStr = data.birthdayStr.split(" ")[0];
            }
            //转化关系id为昵称
            var allRleationSelect = wx.getStorageSync('allRleationSelect');
            var firstRelationId = data.firstRelationId;
            var secondRelationId = data.secondRelationId;
            for (var i in allRleationSelect) {
              if (allRleationSelect[i].value == firstRelationId) {
                var firstRelation = allRleationSelect[i].text
              }
              if (allRleationSelect[i].value == secondRelationId) {
                var secondRelation = allRleationSelect[i].text;
                that.setData({
                  secondRelation: secondRelation //改装后的关系名称
                });
              }
            }
            that.setData({
              resuleList: data,
              birthdayStr: birthdayStr, //改装后的出生日期
              firstRelation: firstRelation //改装后的关系名称
            });
          }
          // 通过id查找详情
          // for (var i in resuleList) {
          //   if (resuleList[i].usersid == usersid) {
          //     var data = resuleList[i]; //详情数据
          //     console.log(data)

          //   } else {
          //     console.log('没查到')
          //   }
          // }
        } else {}
      }
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