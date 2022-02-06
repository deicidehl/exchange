// pages/CustomGifts/CustomGifts.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "CarouselPicturesWarn": "none",
    "CommodityNameWarn": "none",
    "CommodityFunllNameWarn": "none",
    "BusinessNameWarn": "none",
    "CarouselPictures": [], //轮播图片
    "CommodityName": "", //缩略名
    "CommodityFunllName": "", //全名
    "BusinessName": "", //企业名
    "IntroduceImg": [], //详情图片
    "Specification": [], //规格
    "Registration": wx.getStorageSync('Registration') //企业注册号
  },
  CarouselPicturesAdd(e) { //轮播图片选取
    let alert = () => wx.showToast({
      title: '选择的图片总数不能大于5张',
      icon: 'none',
      duration: 2000
    })

    wx.chooseMedia({
      camera: 5,
      mediaType: "image",
      success: (s) => {
        if (this.data.IntroduceImg.length > 4) {
          //选取的图片大于5张弹出对话框
          alert()
          return
        };
        let Arr = [...this.data.CarouselPictures]
        //每次选取的图片不能大于5张
        let len = s.tempFiles.length > 5 ? 5 : s.tempFiles.length

        if (Arr.length + len > 5) {
          alert()
          return
        }
        for (let i = 0; i < len; i++) {
          //有单张图片大于1Mb则清空数据
          if (s.tempFiles[i].size > 1000000) {
            Arr.length = 0
            wx.showToast({
              title: '单张图片大小不能大于1Mb',
              icon: "none",
              duration: 2000
            })
            return
          }
          Arr.push(s.tempFiles[i].tempFilePath)
        }

        this.setData({
          CarouselPictures: Arr
        })

      }
    })
  },
  CarouselPicturesRemove(e) { //轮播图片删除
    let index = e.currentTarget.dataset.index
    let Arr = [...this.data.CarouselPictures]
    Arr.splice(index, 1)
    this.setData({
      CarouselPictures: Arr
    })
  },
  newforms(e) { //输入框
    if (typeof (e.currentTarget.dataset.name) == "number") { //如果是规格则执行
      let SpecificationArr = [...this.data.Specification]
      SpecificationArr[e.currentTarget.dataset.name] = e.detail.value
      this.setData({
        Specification: SpecificationArr
      })
      return //执行完后直接退出
    }
    switch (e.currentTarget.dataset.name) { //商品缩略 全名 和企业名
      case "CommodityName":
        this.setData({
          "CommodityName": e.detail.value
        })
        break;
      case "CommodityFunllName":
        this.setData({
          "CommodityFunllName": e.detail.value
        })
        break;
      case "BusinessName":
        this.setData({
          BusinessName: e.detail.value
        })
        break;
    }
  },
  TextIptAdd() { //规格行添加
    if(this.data.Specification.length > 4){
      wx.showToast({
        title: '规格数量上线为5行!',
        icon:"none",
        duration: 2000
      })
      return
    }
    let SpecificationArr = [...this.data.Specification]
    SpecificationArr.length = SpecificationArr.length + 1
    this.setData({
      Specification: SpecificationArr
    })
  },
  TextIptRemove(e) { //规格行删除
    let index = e.currentTarget.dataset.index
    let SpecificationArr = [...this.data.Specification]
    SpecificationArr.splice(index, 1)
    this.setData({
      Specification: SpecificationArr
    })
  },
  IntroduceImgAdd(e) { //详细图添加
    let alert = () => wx.showToast({
      title: '选择的图片总数不能大于5张',
      icon: 'none',
      duration: 2000
    })
    wx.chooseMedia({
      camera: 5,
      mediaType: "image",
      success: (s) => {
        if (this.data.IntroduceImg.length > 4) {
          alert() //选取的图片大于5张弹出对话框
          return
        };
        let Arr = [...this.data.IntroduceImg]
        let len = s.tempFiles.length > 5 ? 5 : s.tempFiles.length //每次选取的图片不能大于5张

        if (Arr.length + len > 5) {
          alert()
          return
        }

        for (let i = 0; i < len; i++) {
          if (s.tempFiles[i].size > 1000000) {
            Arr.length = 0
            wx.showToast({
              title: '单张图片大小不能大于1Mb',
              icon: "none",
              duration: 2000
            })
            return
          }
          Arr.push(s.tempFiles[i].tempFilePath)
        }
        this.setData({
          IntroduceImg: Arr
        })
      }
    })
  },
  IntroduceImgRemove(e) { //详细图片删除
    let index = e.currentTarget.dataset.index
    let Arr = [...this.data.IntroduceImg]
    Arr.splice(index, 1)
    this.setData({
      IntroduceImg: Arr
    })
  },
  formSubmit(e) {
    if (this.data.CarouselPictures.length == 0) {
      wx.showToast({
        title: '轮播图片最少需要添加一张',
        icon: "none",
        duration: 2000
      })
      return
    }

    let NameNull = 0
    if (this.data.CommodityName == "") {
      NameNull = 1
      this.setData({
        CommodityNameWarn: "block"
      })
    }
    if (this.data.CommodityFunllName == "") {
      NameNull = 1
      this.setData({
        CommodityFunllNameWarn: "block"
      })
    }
    if (this.data.CommodityFunllName == "") {
      NameNull = 1
      this.setData({
        CommodityFunllNameWarn: "block"
      })
    }
    //当以上有一项符合时退出
    if (NameNull == 1) return
    //默认[商家注册号,轮播图片,缩略名,全名,企业名,规格,详情图片]
    let InsertData = ["1","1","1","1","1",null,null]
    if(this.data.Specification.length !== 0){
      InsertData[5] = "1"
    }
    if(this.data.IntroduceImg.length !== 0){
      InsertData[6] = "1"
    }
    //发送商家注册号和需要插入的数据统计 必须是最先发起的请求
    wx.request({
      url: app.AppWeb.url + '/CustomGifts',
      data: {
        'FrontEnd':InsertData,
        'Registration': this.data.Registration
      },
      method:"POST",
      header: {
        'content-type': 'application/json'
      },
      success: (ReqRes) => {
        console.log(ReqRes)
      }
    })
    //发送轮播图片
    for (let i = 0; i < this.data.CarouselPictures.length; i++) {
      wx.uploadFile({
        url: app.AppWeb.url + '/CustomGifts/CarouselPictures',
        name: 'img',
        filePath: this.data.CarouselPictures[i],
        success: (SucRes) => {
        }
      })
    }

    //发送缩略名
   wx.request({
    url: app.AppWeb.url + '/CustomGifts/CommodityName',
    data: {
      'CommodityName': this.data.CommodityName
    },
    method:"POST",
    header: {
      'content-type': 'application/json'
    },
    success: (ReqRes) => {
    }
  })
  //发送全名
  wx.request({
    url: app.AppWeb.url + '/CustomGifts/CommodityFunllName',
    data: {
      'CommodityFunllName': this.data.CommodityFunllName
    },
    method:"POST",
    header: {
      'content-type': 'application/json'
    },
    success: (ReqRes) => {
    }
  })
  //发送企业名
  wx.request({
    url: app.AppWeb.url + '/CustomGifts/BusinessName',
    data: {
      'BusinessName': this.data.BusinessName
    },
    method:"POST",
    header: {
      'content-type': 'application/json'
    },
    success: (ReqRes) => {
    }
  })
  //发送规格
   if(this.data.Specification.length !== 0){
    wx.request({
      url: app.AppWeb.url + '/CustomGifts/Specification',
      data: {
        'Specification': this.data.Specification
      },
      method:"POST",
      header: {
        'content-type': 'application/json'
      },
      success: (ReqRes) => {
      }
    })
   }

    //发送详情图片
    if (this.data.IntroduceImg.length !== 0) {
      for (let i = 0; i < this.data.IntroduceImg.length; i++) {
        console.log(i)
        wx.uploadFile({
          url: app.AppWeb.url + '/CustomGifts/IntroduceImg',
          name: 'img',
          filePath: this.data.IntroduceImg[i],
          success: (UploadFileRes) => {

          }
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})