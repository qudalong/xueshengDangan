var util = require("../../utils/util.js");
var tcity = require("../../utils/citys.js");
var url = getApp().globalData.url;

Page({



  data: {
    region: [],//籍贯
    region2: [], //户口所在地
    region3: [], //出生地
    jump: true, //是否跳转
    provinces: [],
    province: "",
    citys: [],
    city: "",
    countys: [],
    county: '',
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false,
    //以上是联动
    sexI: 1,
    accountNature: '农业',
    jdI: 0,
    dsI: 0,
    ls: 0,
    wgI: 0,
    cjI: 0,
    geI: 0,
    // 单选初始化值
    mz: 0,
    ga: 0,
    ls: 0,
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
    hk: [{
        name: '农业',
        value: '农业',
        checked: 'true'
      },
      {
        name: '非农业',
        value: '非农业'
      }
    ],
    jd: [{
        name: 0,
        value: '走读',
        checked: 'true'
      },
      {
        name: 1,
        value: '住校'
      }
    ],
    ds: [{
        name: 1,
        value: '是'
      },
      {
        name: 0,
        value: '否',
        checked: 'true'
      }
    ],
    wg: [{
        name: 1,
        value: '是'
      },
      {
        name: 0,
        value: '否',
        checked: 'true'
      }
    ],
    cj: [{
        name: 1,
        value: '是'
      },
      {
        name: 0,
        value: '否',
        checked: 'true'
      }
    ],
    ge: [{
        name: 1,
        value: '是'
      },
      {
        name: 0,
        value: '否',
        checked: 'true'
      }
    ]

  },
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
      icon: 'none',
      mask: true
    });


    var that = this;
    var a = that.data;
    that.setData({
      clickStatus: true
    });

    //日期格式化
    var today = util.today(new Date());
    that.setData({
      today: today
    });

    //二维码传参
    // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    var scene = decodeURIComponent(options.scene);
    if (scene && scene != 'undefined') {
      //通过扫描
      console.log('scene=')
      console.log('scene=' + scene)
      var a = scene.split("&");
      // console.log(a)
      var schoolId = scene.split("&")[0];
      var eduUnitId = scene.split("&")[1];
      that.setData({
        schoolId: schoolId,
        eduUnitId: eduUnitId
      });
      wx.setStorageSync('schoolId', schoolId);

    } else {
      //通过分享
      var schoolId = options.schoolId ? options.schoolId : '0';
      var eduUnitId = options.eduUnitId ? options.eduUnitId : '';
      var eduUnitName = options.eduUnitName ? options.eduUnitName : '';
      var schoolName = options.schoolName ? options.schoolName : '';
      console.log('noscene=')
      that.setData({
        schoolName: decodeURIComponent(schoolName),
        schoolId: schoolId,
        eduUnitName: decodeURIComponent(eduUnitName),
        eduUnitId: eduUnitId
      });
      wx.setStorageSync('schoolId', schoolId);
      console.log('schoolId=' + schoolId)
      console.log('学校名称=' + schoolName)
      console.log('班级名称=' + eduUnitName)
    }



    var attentionGZH = wx.getStorageSync('bindPublic'); //幼儿园是否关注公众号
    // var attentionGZH = 1; //幼儿园是否关注公众号
    //幼儿园是否关注公众号
    that.setData({
      attentionGZH: attentionGZH
    });
    console.log('关注公众号=' + attentionGZH)

    var eduUnitId = that.data.eduUnitId && (that.data.eduUnitId != 'null') ? that.data.eduUnitId : ''
    wx.request({
      url: url + 'interface/schoolStatus/getStudentInfoSelect.do',
      data: {
        schoolId: wx.getStorageSync('schoolId'),
        eduUnitId: eduUnitId //后来加的
      },
      method: 'GET',
      header: {
        token: wx.getStorageSync('token') // 默认值
      },
      success: function(res) {
        wx.hideLoading();
        console.log(res.data)
        if (res.data.rtnCode == 10000) {
          var data = res.data.rtnData[0];
          console.log('isopen=' + data.isOpen)
          // 关系下个页面要用
          var rleationSelect = [];
          for (var i in data.rleationSelect) {
            rleationSelect.push(data.rleationSelect[i].text)
          }
          wx.setStorageSync('rleationSelect', rleationSelect);
          wx.setStorageSync('allRleationSelect', data.rleationSelect);
          //学校
          if (that.data.schoolId) {
            that.setData({
              schoolName: data.schoolName
            });
          }
          //班级
          var Class = [];
          for (var i in data.eduunits) {
            Class.push(data.eduunits[i].text)
            // 精确查找班级
            if (that.data.eduUnitId) {
              if (data.eduunits[i].value == that.data.eduUnitId) {
                that.setData({
                  eduUnitName: data.eduunits[i].text
                });
              }
            }
          }




          // 血型
          var blood = [];
          for (var i in data.bloodTypeSelect) {
            blood.push(data.bloodTypeSelect[i].text)
          }
          // 民族
          var ethnic = [];
          for (var i in data.ethnicSelect) {
            ethnic.push(data.ethnicSelect[i].text)
          }
          // 港澳台
          var gangao = [];
          for (var i in data.gangaotaiSelect) {
            gangao.push(data.gangaotaiSelect[i].text)
          }
          // 户口性质
          var registered = [];
          for (var i in data.noAgricultureRegisteredSelect) {
            registered.push(data.noAgricultureRegisteredSelect[i].text)
          }
          // 留守儿童
          var liusou = [];
          for (var i in data.isBehindChildSelect) {
            liusou.push(data.isBehindChildSelect[i].text)
          }
          // 健康
          var health = [];
          for (var i in data.healthStatusSelect) {
            health.push(data.healthStatusSelect[i].text)
          }
          // 残疾
          var disabled = [];
          for (var i in data.disabledTypeSelect) {
            disabled.push(data.disabledTypeSelect[i].text)
          }
          var isOpen = data.isOpen
          var appType = data.appType
          wx.setStorageSync('isOpen', isOpen);
          wx.setStorageSync('appType', appType);
          that.setData({
            eduunits: data.eduunits, //查找班级id用
            Class: Class,
            blood: blood,
            ethnic: ethnic,
            gangao: gangao,
            registered: registered,
            liusou: liusou,
            health: health,
            disabled: disabled,
            isOpen: isOpen, //是否开启学籍 1开启
            appType: appType //园所类别 1童忆园 2乐贝通
          });
          console.log('幼儿园是否开启档案=' + isOpen)
          console.log('幼儿园是否开启档案=' + that.data.isOpen)
          //解决未开启档案时页面停留跳转  视觉问题
          that.setData({
            jump: false
          });
          //幼儿园是否开启档案
          if (!that.data.isOpen) {
            wx.navigateTo({
              url: '../base1/base1?eduUnitId=' + eduUnitId + '&eduUnitName=' + that.data.eduUnitName + '&schoolId=' + schoolId + '&schoolName=' + that.data.schoolName + '&attentionGZH=' + attentionGZH + '&appType=' + that.data.appType + '&isOpen=' + that.data.isOpen,
            });
          }
        }
      }
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


    //联动
    tcity.init(that);
    var cityData = that.data.cityData;
    const provinces = [];
    const citys = [];
    const countys = [];
    for (let i = 0; i < cityData.length; i++) {
      provinces.push(cityData[i].name);
    }
    for (let i = 0; i < cityData[0].sub.length; i++) {
      citys.push(cityData[0].sub[i].name)
    }
    for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
      countys.push(cityData[0].sub[0].sub[i].name)
    }

    that.setData({
      adressShow: false, //开始默认不显示
      'provinces': provinces,
      'citys': citys,
      'countys': countys,
      'province': cityData[0].name,
      'city': cityData[0].sub[0].name,
      'county': cityData[0].sub[0].sub[0].name
      // 'province': '',
      // 'city': '',
      // 'county': ''
    })
  },
  //关闭公众号提示
  close:function(){
    this.setData({
      attentionGZH: true
    })
  },
  //出生地
  bindRegionChange3: function (e) {
    var that = this;
    var chushengdi = e.detail.value;
    if (chushengdi[0] == '北京市' || chushengdi[0] == '上海市' || chushengdi[0] == '天津市' || chushengdi[0] == '重庆市') {
      that.setData({
        chushengdi: chushengdi[0]
      })
    } else {
      that.setData({
        chushengdi: chushengdi[0] + " " + chushengdi[1] + " " + chushengdi[2]
      })
    }

  },
  //籍贯
  bindRegionChange: function (e) {
    var that = this;
    var jiguan = e.detail.value;
    if (jiguan[0] == '北京市' || jiguan[0] == '上海市' || jiguan[0] == '天津市' || jiguan[0] == '重庆市') {
      that.setData({
        jiguan: jiguan[0]
      })
    } else {
      that.setData({
        jiguan: jiguan[0] + " " + jiguan[1]
      })
    }

  },
  //户口所在地
  bindRegionChange2: function (e) {
    var that = this;
    var hukou = e.detail.value;
    if (hukou[0] == '北京市' || hukou[0] == '上海市' || hukou[0] == '天津市' || hukou[0] == '重庆市') {
      that.setData({
        hukou: hukou[0]
      })
    } else {
      that.setData({
        hukou: hukou[0] + " " + hukou[1] + " " + hukou[2]
      })
    }
  },
  radioChange: function(e) {
    this.setData({
      sexI: e.detail.value
    });
  },
  hk: function(e) {
    var that = this;
    that.setData({
      accountNature: e.detail.value
    });
    if (e.detail.value == "非农业") {
      that.setData({
        fnyShow: true
      });
    } else {
      that.setData({
        fnyShow: false
      });
    }
  },
  jd: function(e) {
    console.log(e.detail.value)
    this.setData({
      jdI: e.detail.value
    });
  },
  ds: function(e) {
    this.setData({
      dsI: e.detail.value
    });
  },
  wg: function(e) {
    this.setData({
      wgI: e.detail.value
    });
  },
  cj: function(e) {
    var that = this;
    that.setData({
      cjI: e.detail.value
    });
    if (e.detail.value == 0) {
      that.setData({
        cjShow: false
      });
    } else {
      that.setData({
        cjShow: true
      });
    }
  },
  ge: function(e) {
    this.setData({
      geI: e.detail.value
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

  //身份证号
  card: function(e) {
    this.setData({
      card: e.detail.value
    })

  },
  //血型
  blood: function(e) {
    this.setData({
      xx: e.detail.value
    })
  },
  //民族
  ethnic: function(e) {
    this.setData({
      mz: e.detail.value
    })
  },

  //港澳
  gangao: function(e) {
    this.setData({
      ga: e.detail.value
    })
  },
  //籍贯
  inputGj: function(e) {
    this.setData({
      gj: e.detail.value
    });
  },
  //户口类型
  registered: function(e) {
    this.setData({
      hkxz: e.detail.value
    })
  },
  //户口所在地
  hkAdress: function(e) {
    this.setData({
      hkAdress: e.detail.value
    });
  },
  //户口所在地
  adress: function(e) {
    this.setData({
      adress: e.detail.value
    });
  },

  //入园日期
  enter: function(e) {
    this.setData({
      enter: e.detail.value
    })
  },
  //留守儿童
  liusou: function(e) {
    this.setData({
      ls: e.detail.value
    })
  },
  //健康状况
  health: function(e) {
    this.setData({
      jk: e.detail.value
    })
  },
  //残疾
  disabled: function(e) {
    this.setData({
      cjlb: e.detail.value
    })
  },
  //监护人姓名
  jhName: function(e) {
    this.setData({
      jhName: e.detail.value
    });
  },
  //监护身份证号
  jkCard: function(e) {
    this.setData({
      jkCard: e.detail.value
    });
  },


  //下一步
  next: function() {
    var that = this;
    var a = that.data;
    var regCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    var regTel = /^[1][3,4,5,7,8][0-9]{9}$/;
    var regCn = /[`~!@#\$%\^\&\*\(\)_\+<>\?:"\{\},\.\\\/;'\[\]]/im;


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
    } else if (!a.card) {
      wx.showToast({
        title: '请输入身份证件号码',
        icon: 'none'
      });
      return;
    } else if (regCn.test(a.card)) {
      wx.showToast({
        title: '身份证件号码不能包含特殊字符',
        icon: 'none'
      });
      return;
    } else if (regCard.test(a.card) === false) {
      wx.showToast({
        title: '身份证件号码不正确',
        icon: 'none'
      });
      return;
    } else if (!a.blood[a.xx]) {
      wx.showToast({
        title: '请选择学生血型',
        icon: 'none'
      });
      return;
    } else if (!a.ethnic[a.mz]) {
      wx.showToast({
        title: '请选择所属民族',
        icon: 'none'
      });
      return;
    } else if (!a.chushengdi) {
      wx.showToast({
        title: '请选择出生所在地',
        icon: 'none'
      });
      return;
    } else if (!a.jiguan) {
      wx.showToast({
        title: '请输入籍贯',
        icon: 'none'
      });
      return;
    }else if (!a.region2) {
      wx.showToast({
        title: '请选择户口类型',
        icon: 'none'
      });
      return;
    } else if (!a.hukou) {
      wx.showToast({
        title: '请输入户口所在地',
        icon: 'none'
      });
      return;
    } else if (regCn.test(a.hkAdress)) {
      wx.showToast({
        title: '户口所在地不能包含特殊字符',
        icon: 'none'
      });
      return;
    } else if (!a.adress) {
      wx.showToast({
        title: '请输入现住址',
        icon: 'none'
      });
      return;
    } else if (regCn.test(a.adress)) {
      wx.showToast({
        title: '现住址不能包含特殊字符',
        icon: 'none'
      });
      return;
    } else if (!a.enter) {
      wx.showToast({
        title: '请选择入园日期',
        icon: 'none'
      });
      return;
    } else if (!a.health[a.jk]) {
      wx.showToast({
        title: '请选择学生健康状况',
        icon: 'none'
      });
      return;
    } else if (a.cjShow && !a.disabled[a.cjlb]) {
      wx.showToast({
        title: '请选择残疾类别',
        icon: 'none'
      });
      return;
    } else if (!a.jhName) {
      wx.showToast({
        title: '请输入监护人姓名',
        icon: 'none'
      });
      return;
    } else if (a.jhName.length < 2) {
      wx.showToast({
        title: '监护人姓名至少为2个字',
        icon: 'none'
      });
      return;
    } else if (regCn.test(a.jhName)) {
      wx.showToast({
        title: '监护人姓名不能包含特殊字符',
        icon: 'none'
      });
      return;
    } else if (!a.jkCard) {
      wx.showToast({
        title: '请输入监护人证件号',
        icon: 'none'
      });
      return;
    } else if (regCard.test(a.jkCard) === false) {
      wx.showToast({
        title: '监护人身份证件号码不正确',
        icon: 'none'
      });
      return;
    } else if (regCn.test(a.jkCard)) {
      wx.showToast({
        title: '证件号码不能包含特殊字符',
        icon: 'none'
      });
      return;
    }
    //  验证通过跳转(把数据带过去)
    // 查找班级id
    var classId = 0;
    if (a.eduUnitId && a.eduUnitId != 'null') {
      var classId = a.eduUnitId;
    } else {
      for (var i in a.eduunits) {
        if (a.eduunits[i].text == a.Class[a.index]) {
          classId = a.eduunits[i].value;
          break;
        }
      }
    }
    //选填参数判断
    if (a.registered[a.hkxz]) {
      var noAgricultureRegistered = a.hkxz;
    } else {
      var noAgricultureRegistered = '';
    }
    if (a.disabled[a.cjlb]) {
      var disabledType = a.disabled[a.cjlb]
    } else {
      var disabledType = '';
    }
    //班级
    if (a.Class[a.index]) {
      var eduunitName = a.Class[a.index]
    }
    if (a.eduunitName) {
      var eduunitName = a.eduunitName
    }
    that.setData({
      clickStatus: false
    })
    var dataList = {
      unionId: wx.getStorageSync('unionid'),
      schoolid: wx.getStorageSync('schoolId'),
      schoolName: a.schoolName,
      eduunitName: eduunitName,
      eduUnitId: classId,
      sex: a.sexI,
      name: a.name,
      birthdayStr: a.date,
      cardid: a.card,
      bloodType: a.xx,
      country: "中国",
      ethnic: a.ethnic[a.mz],
      gangaotai: a.gangao[a.ga],
      bornAddress: a.chushengdi,
      originplace: a.jiguan,
      accountNature: a.accountNature,
      noAgricultureRegistered: noAgricultureRegistered, //选填
      registeredplace: a.hukou,
      address: a.adress,
      addTimeStr: a.enter,
      isBoarding: a.jdI,
      isOnlyChild: a.dsI,
      isBehindChild: a.ls,
      isRelocation: a.wgI,
      healthStatus: a.jk,
      isDisabledChild: a.cjI,
      disabledType: disabledType, //选填
      isOrphan: a.geI,
      guardianCardId: a.jkCard,
      guardianName: a.jhName,
    }
    wx.navigateTo({
      url: '../step2/step2?dataList=' + JSON.stringify(dataList)
    })

  },


  //跳转
  demo: function() {
    wx.navigateTo({
      url: '../demo/demo',
    });
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


  // 一下是联动
  bindChange: function(e) {
    console.log(99999999999)
    var val = e.detail.value
    var t = this.data.values;
    var cityData = this.data.cityData;

    if (val[0] != t[0]) {
      const citys = [];
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub.length; i++) {
        citys.push(cityData[val[0]].sub[i].name)
      }
      for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
        countys.push(cityData[val[0]].sub[0].sub[i].name)
      }

      this.setData({
        province: this.data.provinces[val[0]],
        city: cityData[val[0]].sub[0].name,
        citys: citys,
        county: cityData[val[0]].sub[0].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], 0, 0]
      })

      return;
    }
    if (val[1] != t[1]) {
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
      }

      this.setData({
        city: this.data.citys[val[1]],
        county: cityData[val[0]].sub[val[1]].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], val[1], 0]
      })
      return;
    }
    if (val[2] != t[2]) {
      this.setData({
        county: this.data.countys[val[2]],
        values: val
      })
      return;
    }
  },
  open: function() {
    this.setData({
      condition: !this.data.condition,
      adressShow: true
    })
  },
  init: function() {
    this.setData({
      condition: !this.data.condition
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
    var that = this;
    that.setData({
      clickStatus: true
    })
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

  }

})