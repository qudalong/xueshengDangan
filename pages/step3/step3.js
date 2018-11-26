// pages/step3/step3.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var result = options.result;
    //跳转详情页用
    var phone = options.phone != 'null' ? options.phone : '';
    var cardId = options.cardId != 'null' ? options.cardId : '';
    var name = options.name;
    var isOpen = options.isOpen; //判断详情显示
    var apptype = options.appType; //判断详情显示
    console.log(apptype)
    wx.setNavigationBarTitle({
      title: '录入学生档案'
    });
    wx.showToast({
      title: '已提交档案信息',
    });
    that.setData({
      aResult: result.split(','),
      //查看详情用
      phone: phone,
      cardId: cardId,
      name: name,
      isOpen: isOpen,
      apptype: apptype
    });
    console.log(result.split(','))


  },
  rollDetail:function(){
   var that=this;
   var a=that.data;
    wx.navigateTo({
      url: '../details/details?phone=' + a.phone + '&cardId=' + a.cardId + '&name=' + a.name + '&isOpen=' + a.isOpen
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  }
})