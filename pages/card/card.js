var url = getApp().globalData.url;

Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载 1700894 169031
   */
  onLoad: function(options) {
    var that = this;
    var userid = options.userid;
    var init = options.init;
    var detail = options.detail;
    if (userid) {
      that.setData({
        userid
      });
    }
    wx.showLoading({
      title: '加载中'
    });
    //初始化时
    if (init) {
      wx.request({
        url: url + 'interface/schoolStatus/selectLastUserBindCardNo.do',
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
          if (res.data.rtnCode == 10000) {
            var data = res.data.rtnData[0];
            var firstName = data.firstName;
            var secondName = data.secondName;
            var thirdName = data.thirdName;
            var fourthName = data.fourthName;
            var parents = [firstName, secondName, thirdName, fourthName];
            wx.setStorageSync('parents', parents);
            that.setData({
              userid: data.userId, //上传图片时要用
              data: data,
              photoPath: data.photoPath
            });
          } else {}
        }
      });
    }
    //详情时
    if (detail) {
      this.selectUserBindCardNo();
      setTimeout(()=>{
        this.selectUserBindCardNo();
      },600);
    }
  },
  
  selectUserBindCardNo(){
    wx.request({
      url: url + 'interface/parent/safetycard/selectUserBindCardNo.do',
      data: {
        userid: this.data.userid
      },
      method: 'GET',
      header: {
        token: wx.getStorageSync('token')
      },
      success:(res)=> {
        wx.hideLoading();
        if (res.data.rtnCode == 10000) {
          var data = res.data.rtnData[0];
          var firstName = data.firstName;
          var secondName = data.secondName;
          var thirdName = data.thirdName;
          var fourthName = data.fourthName;
          var parents = [firstName, secondName, thirdName, fourthName];
          wx.setStorageSync('parents', parents);
          this.setData({
            data: data,
            photoPath: data.photoPath
          });
        } else { }
      }
    });
  },

  

  //更改学生图片
  changeHead: function() {
    var that = this;
    wx.showActionSheet({
      itemList: ['拍照', '从手机相册选择'],
      success: function(res) {
        if (res.tapIndex == 0) {
          wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['camera'],
            success: function(res) {
              var tempFilePaths = res.tempFilePaths;
              var filePath = tempFilePaths[0];
              wx.uploadFile({
                url: url + 'interface/parent/user/upLoadFile/uploadheadPhoto.do',
                filePath: tempFilePaths[0],
                name: 'file',
                header: {
                  'content-type': 'multipart/form-data',
                  token: wx.getStorageSync('token')
                },
                formData: {
                  'usersid': that.data.userid
                },
                success: function(res) {
                  var data = res.data;
                  if (data) {
                    var headImg = JSON.parse(data).rtnData[0];
                    that.setData({
                      photoPath: headImg
                    });
                  }
                }
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
              wx.uploadFile({
                url: url + 'interface/parent/user/upLoadFile/uploadheadPhoto.do',
                filePath: tempFilePaths[0],
                name: 'file',
                header: {
                  'content-type': 'multipart/form-data',
                  token: wx.getStorageSync('token')
                },
                formData: {
                  'usersid': that.data.userid
                },
                success: function(res) {
                  var data = res.data;
                  if (data) {
                    var headImg = JSON.parse(data).rtnData[0];
                    that.setData({
                      photoPath: headImg
                    });
                  }
                }
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
  changeHead2: function() {
    wx.showToast({
      title: '请点击选择学生',
      icon: 'none'
    });
  },

  setCard: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var stu = e.currentTarget.dataset.stu;
    var userid = e.currentTarget.dataset.userid;
    var bindStatus = e.currentTarget.dataset.bind;
    var photo = e.currentTarget.dataset.photo;
    var name = e.currentTarget.dataset.name;
    var card = e.currentTarget.dataset.card;
    wx.redirectTo({
      url: '../setCard/setCard?bindStatus=' + bindStatus + '&photo=' + photo + '&name=' + name + '&card=' + card + '&userid=' + userid + '&stu=' + stu + '&id=' + id,
    });
  },


  selectStu: function() {
    wx.redirectTo({
      url: '../selectStu/selectStu'
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