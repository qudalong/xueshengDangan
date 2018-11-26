var url = getApp().globalData.url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    clickStatus:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({
      clickStatus: true
    });
    var dataList = JSON.parse(options.dataList);
    that.setData({
      isOpen: wx.getStorageSync("isOpen"),
      appType: wx.getStorageSync("appType"),
      rleationSelect: wx.getStorageSync("rleationSelect"),
      dataList: dataList
    });
    console.log(dataList)
  },

  //下一步
  next: function(e) {
    var that = this;
    var formId = e.detail.formId;
    var a = that.data;
    var regTel = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!a.rleationSelect[a.index]) {
      wx.showToast({
        title: '请选择第一监护人与学生关系',
        icon: 'none'
      });
      return;
    } else if (!a.tel) {
      wx.showToast({
        title: '请输入第一监护人手机号',
        icon: 'none'
      });
      return;
    } else if (regTel.test(a.tel) === false) {
      wx.showToast({
        title: '第一监护人手机号格式不正确',
        icon: 'none'
      });
      return;
    } else if (a.tel2 && regTel.test(a.tel2) === false) {
      wx.showToast({
        title: '第二监护人手机号格式不正确',
        icon: 'none'
      });
      return;
    } else if (a.rleationSelect[a.index2] == a.rleationSelect[a.index]) {
      wx.showToast({
        title: '监护人关系不能相同',
        icon: 'none'
      });
      return;
    } else if (a.tel2 == a.tel) {
      wx.showToast({
        title: '监护人手机号不能相同',
        icon: 'none'
      });
      return;
    }
    //第二监护人信息是否填写
    if (a.dataList.noAgricultureRegistered) {
      var noAgricultureRegistered = parseInt(a.dataList.noAgricultureRegistered);
    } else {
      var noAgricultureRegistered = '';
    }
    if (a.rleationSelect[a.index2]) {
      var secondRelationId = parseInt(a.index2)+1;
    } else {
      var secondRelationId = '';
    }
    if (a.tel2) {
      var secondPhone = a.tel2;
    } else {
      var secondPhone = '';
    }

    that.setData({
      clickStatus: false
    });
    //接口
    wx.request({
      url: url + 'interface/schoolStatus/insertStudentInfo.do',
      data: {
        openId: wx.getStorageSync('openid'),
        formId: formId,
        unionId: a.dataList.unionId,
        schoolid: parseInt(a.dataList.schoolid),
        schoolName: a.dataList.schoolName,
        eduunitName: a.dataList.eduunitName,
        eduUnitId: parseInt(a.dataList.eduUnitId),
        sex: parseInt(a.dataList.sex),
        name: a.dataList.name,
        birthdayStr: a.dataList.birthdayStr,
        cardid: a.dataList.cardid,
        bloodType: parseInt(a.dataList.bloodType),
        country: a.dataList.country,
        ethnic: a.dataList.ethnic,
        gangaotai: a.dataList.gangaotai,
        bornAddress: a.dataList.bornAddress,
        originplace: a.dataList.originplace,
        accountNature: a.dataList.accountNature,
        noAgricultureRegistered: noAgricultureRegistered,
        registeredplace: a.dataList.registeredplace,
        address: a.dataList.address,
        addTimeStr: a.dataList.addTimeStr,
        isBoarding: parseInt(a.dataList.isBoarding),
        isOnlyChild: a.dataList.isOnlyChild,
        isBehindChild: a.dataList.isBehindChild,
        isRelocation: parseInt(a.dataList.isRelocation),
        healthStatus: parseInt(a.dataList.healthStatus),
        isDisabledChild: a.dataList.isDisabledChild,
        disabledType: a.dataList.disabledType,
        isOrphan: parseInt(a.dataList.isOrphan),
        guardianCardId: a.dataList.guardianCardId,
        guardianName: a.dataList.guardianName,
        // 本页参数
        firstRelationId: parseInt(a.index)+1,
        phone: a.tel,
        secondRelationId: secondRelationId,
        secondPhone: secondPhone
      },
      method: 'POST',
      header: {
        token: wx.getStorageSync('token'),
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        console.log(res.data)
        if (res.data.rtnCode == 10000) {
          var result = res.data.result;
         
          wx.navigateTo({
              url: '../step3/step3?result=' + result + '&phone=' + a.tel + '&cardId=' + a.dataList.cardid + '&name=' + a.dataList.name + '&appType=' + a.appType + '&isOpen=' + a.isOpen
          })
        } else {
          wx.showToast({
            title: '服务请求失败，关闭重新进入',
            icon:'none'
          })
          console.log('查询学生接送卡绑定信息失败');
        }
      }
    });

  },

  //第一监护人
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
  },
  //第二监护人
  bindPickerChange2: function(e) {
    this.setData({
      index2: e.detail.value
    })
  },

  //第一监护人手机号
  tel: function(e) {
    this.setData({
      tel: e.detail.value
    })
  },
  //第二监护人手机号
  tel2: function(e) {
    this.setData({
      tel2: e.detail.value
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
    this.setData({
      clickStatus: true
    });
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