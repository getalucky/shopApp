// pages/order/index.js
import axios from '../../request/myAxios'
Page({
  activeIndex:1,
  /**
   * 页面的初始数据
   */
  data: {
    dataList:[
      {
        id:1,
        text:'全部'
      },
      {
        id:2,
        text:'待付款'
      },
      {
        id:3,
        text:'待发货'
      }
    ],
    orderList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.getData()
  },
  handelTab(e){
    const {detail} = e
    this.activeIndex = this.data.dataList[detail].id
    this.getData()
  },
  getData(){
    axios({
      url:'/api/public/v1/my/orders/all',
      data:{
        type:this.activeIndex
      }
    }).then(res => {
      let untils = require('../../utils/util.js')
      const {orders} = res
      orders.forEach(v => {
        v.update_time = untils.formatTime(new Date())
      })
      this.setData({
        orderList:orders
      })
    })
  }
})