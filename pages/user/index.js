// pages/user/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '',
    nickName: '',
    list: [{
        id: 0,
        name: '待付款'
      },
      {
        id: 1,
        name: '待收货'
      },
      {
        id: 2,
        name: '退货/退款'
      },
      {
        id: 3,
        name: '全部订单'
      }
    ],
    activedIndex: 0
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getUserInfo();
  },

  /**
   * 获取用户信息
   */
  getUserInfo() {
    wx.getUserInfo({
      complete: (res) => {
        if (res.userInfo) {
          const {
            avatarUrl,
            nickName
          } = res.userInfo
          this.setData({
            avatarUrl,
            nickName
          })
        }
      },
    })
  },

  /** 
   * 点击获取授权
   */
  handleUser(e) {
    console.log(e.detail.userInfo);
    const {
      nickName,
      avatarUrl
    } = e.detail.userInfo;
    this.setData({
      nickName,
      avatarUrl
    })
  },



  handel(e) {
    const {
      index
    } = e.currentTarget.dataset
    this.setData({
      activedIndex: index
    })
    if (index === this.data.list.length - 1) {
      wx.navigateTo({
        url: '/pages/order/index',
      })
    }
  }
})