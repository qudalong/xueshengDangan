var util = require("../../utils/util.js");
var url = getApp().globalData.url;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    clickStatus:true,
    sexI: 1,
    sex: [{
        name: 1,
        value: '男',
        checked: 'true'
      },
      {
        name: 0,
        value: '女'
      }
    ],
  },
  radioChange: function(e) {
    this.setData({
      sexI: e.detail.value
    });
  },

  // 姓名
  inputName: function(e) {
    this.setData({
      name: e.detail.value
    });
  },
  //班级
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
  },
  //出生日期
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  //第一监护人
  bindPickerChange2: function(e) {
    this.setData({
      index2: e.detail.value
    })
  },
  //第二监护人
  bindPickerChange3: function(e) {
    this.setData({
      index3: e.detail.value
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

  //下一步
  next: function(e) {
    var that = this;
    var formId = e.detail.formId;
    console.log('formId=' + formId)
    var a = that.data;
    var regCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    var regTel = /^[1][3,4,5,7,8][0-9]{9}$/;
    var regCn = /[`~!@#\$%\^\&\*\(\)_\+<>\?:"\{\},\.\\\/;'\[\]]/im;
    console.log(regCn.test(a.name))
    if (!a.name) {
      wx.showToast({
        title: '请输入学生姓名',
        icon: 'none'
      });
      return;
    } else if (a.name.length < 2) {
      wx.showToast({
        title: '学生姓名至少为2个字',
        icon: 'none'
      });
      return;
    } else if (regCn.test(a.name)) {
      wx.showToast({
        title: '姓名不能包含特殊字符',
        icon: 'none'
      });
      return;
    } else if (!a.Class[a.index] && !a.eduUnitName) {
      wx.showToast({
        title: '请选择班级',
        icon: 'none'
      });
      return;
    } else if (!a.date) {
      wx.showToast({
        title: '请选择出生日期',
        icon: 'none'
      });
      return;
    } else if (!a.rleationSelect[a.index2]) {
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
    } else if (a.rleationSelect[a.index2] == a.rleationSelect[a.index3]) {
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
    // 查找班级id
    var classId = 0;
    if (a.eduUnitId && a.eduUnitId!='null') {
      var classId = a.eduUnitId;
    } else {
      for (var i in a.eduunits) {
        if (a.eduunits[i].text == a.Class[a.index]) {
          classId = a.eduunits[i].value;
          break;
        }
      }
    }
    //第二监护人信息是否填写
    if (a.rleationSelect[a.index3]) {
      var secondRelationId = parseInt(a.index3) + 1;
    } else {
      var secondRelationId = '';
    }
    if (a.tel2) {
      var secondPhone = a.tel2;
    } else {
      var secondPhone = '';
    }
    //班级
    if (a.Class[a.index]) {
      var eduunitName = a.Class[a.index]
    }
    if (a.eduunitName) {
      var eduunitName = a.eduunitName
    }
    var dataList = {
      openId: wx.getStorageSync('openid'),
      formId: formId,
      unionId: wx.getStorageSync('unionid'),
      schoolid: wx.getStorageSync('schoolId'),
      schoolName: a.schoolName,
      eduunitName: eduunitName,
      eduUnitId: classId,
      sex: a.sexI,
      name: a.name,
      birthdayStr: a.date,
      cardid: '',
      bloodType: '',
      country: '',
      ethnic: '',
      gangaotai: '',
      bornAddress: '',
      originplace: '',
      accountNature: '',
      noAgricultureRegistered: '', //选填
      registeredplace: '',
      address: '',
      addTimeStr: '',
      isBoarding: '',
      isOnlyChild: '',
      isBehindChild: '',
      isRelocation: '',
      healthStatus: '',
      isDisabledChild: '',
      disabledType: '', //选填
      isOrphan: '',
      guardianCardId: '',
      // 本页参数
      firstRelationId: parseInt(a.index2) + 1,
      phone: a.tel,
      secondRelationId: secondRelationId,
      secondPhone: secondPhone
    }
    //防止多点击
    that.setData({
      clickStatus: false
    });
    wx.request({
      url: url + 'interface/schoolStatus/insertStudentInfo.do',
      data: dataList,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        console.log(res.data)
        if (res.data.rtnCode == 10000) {
          var result = res.data.result;
          wx.navigateTo({
            url: '../step3/step3?result=' + result + '&phone=' + a.tel + '&cardId=' + '' + '&name=' + a.name + '&appType=' + a.appType + '&isOpen=' + a.isOpen
          })


        } else {
          console.log('查询学生接送卡绑定信息失败');
        }
      }
    });


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({
      clickStatus: true
    });
    //获取七牛上传Token
    wx.request({
      url: url + 'interface/dynamic/getUptoken.do',
      method: 'POST',
      data: {},
      header: {
        token: wx.getStorageSync('token')
      },
      success: function(res) {
        console.log('uploadToken=' + res.data.rtnData[0].uploadToken);
        if (res.data.rtnCode == 10000) {
          wx.setStorageSync('baseUrl', res.data.rtnData[0].baseUrl);
          wx.setStorageSync('uploadToken', res.data.rtnData[0].uploadToken);
        } else {}
      }
    });
    //日期格式化
    var today = util.today(new Date());
    that.setData({
      today: today
    });

    //二维码传参
    var isOpen = options.isOpen;//1开启
    var appType = options.appType;//园所类别 1童忆园 2乐贝通
    var eduUnitId = options.eduUnitId ? options.eduUnitId : '';
    var eduUnitName = options.eduUnitName ? options.eduUnitName : '';
    var schoolId = options.schoolId ? options.schoolId : '';
    var schoolName = options.schoolName ? options.schoolName : '';
    // var attentionGZH = wx.getStorageSync('bindPublic'); //幼儿园是否关注公众号
    var attentionGZH = 1; //幼儿园是否关注公众号

    console.log('班级名称=' + schoolName)
    console.log('appType=' + appType)
    //幼儿园是否关注公众号
    that.setData({
      isOpen: isOpen, 
      appType: appType, 
      attentionGZH: attentionGZH
    });
    //幼儿园名字
    that.setData({
      schoolName: decodeURIComponent(schoolName)
    });
    //班级id
    that.setData({
      eduUnitId: eduUnitId
    });
    //学校id
    that.setData({
      schoolId: schoolId
    });
    wx.setStorageSync('schoolId', schoolId);
    //班级名称
    that.setData({
      eduUnitName: decodeURIComponent(eduUnitName)
    });


    wx.request({
      url: url + 'interface/schoolStatus/getStudentInfoSelect.do',
      data: {
        schoolId: wx.getStorageSync('schoolId')
      },
      method: 'GET',
      header: {
        token: wx.getStorageSync('token') // 默认值
      },
      success: function(res) {
        console.log(res.data)
        if (res.data.rtnCode == 10000) {
          var data = res.data.rtnData[0];
          //关系
          var rleationSelect = [];
          for (var i in data.rleationSelect) {
            rleationSelect.push(data.rleationSelect[i].text)
          }
          that.setData({
            rleationSelect: rleationSelect
          });
          wx.setStorageSync('rleationSelect', rleationSelect);
          wx.setStorageSync('allRleationSelect', data.rleationSelect);
          //班级
          var Class = [];
          for (var i in data.eduunits) {
            Class.push(data.eduunits[i].text)
          }
          that.setData({
            eduunits: data.eduunits, //查找班级id用
            Class: Class
          });
        }
      }
    });

  },

  //跳转
  demo2: function() {
    wx.navigateTo({
      url: '../demo2/demo2',
    });
  },
  selectRoll: function() {
    wx.navigateTo({
      url: '../select/select'
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
    var that = this;
    that.setData({
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
     wx.navigateBack({
       delta:2
     });
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