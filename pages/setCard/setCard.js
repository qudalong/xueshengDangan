var url = getApp().globalData.url;
var qiniuUploader = require("../../utils/qiniuUploader");
Page({

  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var id = options.id; //第几个家长
    var stu = options.stu;
    var userid = options.userid;
    var bindStatus = options.bindStatus;
    var photo = options.photo;
    var name = options.name;
    var card = options.card;
    var parents = wx.getStorageSync("parents"); //已存在的关系
    this.getStudentInfoSelect(parents,name);
  
    that.setData({
      id: id,
      stu: stu,
      userid: userid,
      bindStatus: bindStatus,
      imageURL: photo,
      name: name,
      oldCard: card,
      cardInit: card, //解绑显示判断 （ 刚进页面时用）
      card: card,
    });
  },

  //获取接送人列表
  getStudentInfoSelect(parents, name) {
    var that=this;
    wx.request({
      url: url + 'interface/schoolStatus/getStudentInfoSelect.do',
      data: {
        schoolId: wx.getStorageSync('schoolId'),
        eduUnitId: wx.getStorageSync('unionid') //后来加的
      },
      method: 'GET',
      header: {
        token: wx.getStorageSync('token') // 默认值
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.rtnCode == 10000) {
          var data = res.data.rtnData[0];
          // 关系下个页面要用
          var rleationSelect = [];
          for (var i in data.rleationSelect) {
            rleationSelect.push(data.rleationSelect[i].text)
          }
          wx.setStorageSync('rleationSelect', rleationSelect);
          wx.setStorageSync('allRleationSelect', data.rleationSelect);

          var _Array = wx.getStorageSync("rleationSelect"); //改装后的关系数组
          var _Array2 = wx.getStorageSync("allRleationSelect"); //全部关系信息
          //去除已存在的关系
          if (parents.length) {
            for (var i in _Array) {
              for (var j in parents) {
                if (_Array[i] == parents[j]) {
                  _Array.splice(i, 1);
                }
              }
            }
            //添加当前关系
            if (name && name != 'null') {
              var arr = [name];
              _Array = arr.concat(_Array);
              for (var j in _Array2) {
                if (name == _Array2[j].text) {
                  console.log(_Array2[j].text)
                  var roleId = _Array2[j].value;
                  that.setData({
                    roleId: roleId
                  });
                  break;
                }
              }
            }
            that.setData({
              _Array2: _Array2,
              _Array: _Array
            });
          }
        }
      }
    })
  },

  //解绑
  unbundle: function() {
    var that = this;
    var a = that.data;
    wx.showModal({
      title: '解绑',
      content: "解绑后卡号为【" + a.oldCard + "】的接送卡将无法继续使用，确定解绑？",
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: url + 'interface/parent/safetycard/cancelCardBinding.do',
            data: {
              schoolId: wx.getStorageSync('schoolId'),
              oldCardNo: a.oldCard,
              studentId: a.userid
            },
            method: 'GET',
            header: {
              token: wx.getStorageSync('token') // 默认值
            },
            success: function(res) {
              console.log(res.data)

              if (res.data.rtnCode == 10000) {
                wx.showToast({
                  title: '解绑成功！'
                });
                wx.redirectTo({
                  url: '../card/card?userid=' + a.userid + '&detail=' + 1,
                });
              } else {
                wx.showToast({
                  title: '' + res.data.result,
                  icon: 'none'
                });
              }
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }

      }
    })




  },

  //设置卡号
  setCard: function(e) {
    var card = e.detail.value;
    this.setData({
      card: card
    });
  },
  //保存
  save: function() {
    var that = this;
    var a = that.data;
    if (!a.imageURL || a.imageURL == 'null') {
      wx.showToast({
        title: '请添加接送人照片!',
        icon: 'none'
      });
      return;
    } else if (!a._Array[a.index] && !a.name) {
      wx.showToast({
        title: '请选择接送人！',
        icon: 'none'
      });
      return;
    } else
    if (!a.card || a.card == 'null') {
      wx.showToast({
        title: '请输入报平安卡号！',
        icon: 'none'
      });
      return;
    }
    //空卡判断
    if (a.oldCard == 'null') {
      var oldCard = '';
    } else {
      var oldCard = a.oldCard;
    }
    //判断时新增还是修改
    if (a.imageURL && a.imageURL != 'null' && oldCard && a.name && a.name != 'null') {
      var isNew = 0;
    } else {
      var isNew = 1;
    }
    //第几个家长判断
    if (a.id == 1) {
      console.log("第1个家长")
      var data = {
        schoolId: wx.getStorageSync('schoolId'),
        userid: a.userid,
        firstrole: a.roleId,
        firstphoto: a.imageURL,
        cardNo: a.card,
        oldCardNo: oldCard,
        isNew: isNew
      }
    } else if (a.id == 2) {
      console.log("第2个家长")
      var data = {
        schoolId: wx.getStorageSync('schoolId'),
        userid: a.userid,
        secondrole: a.roleId,
        secondphoto: a.imageURL,
        cardNo: a.card,
        oldCardNo: oldCard,
        isNew: isNew
      }
    } else if (a.id == 3) {
      console.log("第3个家长")
      var data = {
        schoolId: wx.getStorageSync('schoolId'),
        userid: a.userid,
        thirdrole: a.roleId,
        thirdphoto: a.imageURL,
        cardNo: a.card,
        oldCardNo: oldCard,
        isNew: isNew
      }
    } else if (a.id == 4) {
      console.log("第4个家长");

      var data = {
        schoolId: wx.getStorageSync('schoolId'),
        userid: a.userid,
        fourthrole: a.roleId,
        fourthphoto: a.imageURL,
        cardNo: a.card,
        oldCardNo: oldCard,
        isNew: isNew
      }
    }
    wx.request({
      url: url + 'interface/parent/safetycard/bindCard.do',
      data: data,
      method: 'POST',
      header: {
        token: wx.getStorageSync('token') // 默认值
      },
      success: function(res) {
        console.log(res.data)
        if (res.data.rtnCode == 10000) {
          wx.showToast({
            title: '设置成功！'
          });
          wx.redirectTo({
            url: '../card/card?userid=' + a.userid + '&detail=' + 1,
          });
        } else {
          wx.showToast({
            title: '' + res.data.result,
            icon: 'none'
          });
        }
      }
    });
  },

  // 切换关系
  bindPickerChange: function(e) {
    var that = this;
    var a = that.data;
    var index = e.detail.value;
    that.setData({
      index: index
    });
    console.log(index)
    //查找当前关系id
    for (var j in a._Array2) {
      if (a._Array[index] == a._Array2[j].text) {
        console.log(a._Array2[j].text)
        var roleId = a._Array2[j].value;
        break;
      }
    }
    that.setData({
      name: a._Array[index],
      roleId: roleId
    });
  },

  //添加图片
  addImg: function() {
    var that = this;

    wx.showActionSheet({
      itemList: ['拍照', '从手机相册选择'],
      success: function(res) {
        if (res.tapIndex == 0) {
          wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['camera'],
            success: function(res) {
              var tempFilePaths = res.tempFilePaths;
              var filePath = tempFilePaths[0];

              //七牛提供的上传方法
              qiniuUploader.upload(filePath, (res) => {
                that.setData({
                  imageURL: res.imageURL
                });
              }, (error) => {
                console.log('error: ' + error);
              }, {
                region: 'ECN',
                uptokenURL: url + "interface/dynamic/getUptoken.do",
                domain: wx.getStorageSync('baseUrl'),
                uptoken: wx.getStorageSync('uploadToken'), // 由其他程序生成七牛 uptoken
              });

              wx.showToast({
                title: '加载中...',
                icon: 'loading',
                duration: 500
              });
            }
          })
        } else if (res.tapIndex == 1) { //相册
          wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'],
            sourceType: ['album'],
            success: function(res) {
              var tempFilePaths = res.tempFilePaths;
              var filePath = tempFilePaths[0];
              console.log('filePath==' + filePath)

              //七牛提供的上传方法
              console.log("七牛提供的上传方法..............")
              qiniuUploader.upload(filePath, (res) => {
                that.setData({
                  imageURL: res.imageURL
                });
              }, (error) => {
                console.log('error: ' + error);
              }, {
                region: 'ECN',
                uptokenURL: url + "interface/dynamic/getUptoken.do",
                domain: wx.getStorageSync('baseUrl'),
                uptoken: wx.getStorageSync('uploadToken'),
              });

              wx.showToast({
                title: '加载中...',
                icon: 'loading',
                duration: 500
              });
            }
          });
        }
      }
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