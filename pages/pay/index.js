import axios from "../../request/myAxios";

// pages/pay/index.js
Page({
  // 自定义数据
  params:{},

  /**
   * 页面的初始数据
   */
  data: {
    goodsList:Array,
    // 商品数
    selectGoodsCount:0,
    // 总价
    allPrice:0,
    // 用户地址信息
    userInfo:{},
    // 获取地址是否显示
    isshowbtn:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let goodsList = wx.getStorageSync('cart') || [];
    // 总价
    let allPrice = 0;
    goodsList = goodsList.filter(item=>{
      if(item.isSelect){
        allPrice += item.price * item.goodsCount
        return item
      }
    });
    this.setData({
      goodsList,allPrice
    });
  },
  // 获取地址
  getUserAddress(){
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true){
          wx.openSetting();
        }else{
          wx.chooseAddress({
            success: res=> {
              let userObj ={};
              userObj.name = res.userName;
              userObj.tell = res.telNumber;
              userObj.address = res.provinceName + res.cityName + res.countyName + res.detailInfo;
              this.setData({
                userInfo : userObj,
                isshowbtn:false
              });
            }
            
          })
        }
      }
    })
  },
  // 付款
  async settlement(){
    let token = wx.getStorageSync('token') || '';
    if(!token){
      // 没有token去用户授权登录
      wx.navigateTo({
        url: '/pages/auth/index',
      })
    } else if(!this.data.userInfo.name){  
    wx.showToast({
      title: '地址不能为空',
      icon:'none'
    })
    }else{
      try{
        let order ;
        await this.initiateOrder().then(res=>{
          order = res;
        });
        let pay;
        await this.prepaid(order).then(res=>{
          pay = res;
        });
        await this.initiatePayment(pay);
        this.setpayedData();
      }catch(err){
        console.log(err);
      }
      
    }
  },
  // 发起订单,拿到订单号
  initiateOrder(){
    // 过滤数组信息
    let goods = this.data.goodsList;
    goods = goods.map(item=>{
      return{
        goods_id: item.id,
        goods_number:item.goodsCount,
        goods_price:item.price
      }
    });
    this.params.goods = goods;
    this.params.order_price = this.data.allPrice;
    this.params.consignee_addr = this.data.userInfo.address;
    return axios({
      url:'/my/orders/create',
      method:'post',
      data:this.params
    }).then(res=>{
      return res.data.message.order_number;
    })
  },
  // 准备微信支付所需要的参数
  prepaid(order_number){
    return axios({
      url:'/my/orders/req_unifiedorder',
      method:'post',
      data:{
        order_number:order_number
      }
    }).then(res=>{
      return res.data.message.pay;
    })
  },
  // 发起支付
  initiatePayment(pay){
    return new Promise((resolve, reject)=>{
      wx.requestPayment({
        ...pay,
        success :res=> {
          resolve(res);
         },
         fail (res) {
           wx.showToast({
             title: '取消支付',
             icon:"none"
           });
           reject();
        }
         
      })
    })

  },
  // 支付后处理数据
  setpayedData(){
    wx.showToast({
      title: '支付完成',
      icon:'none'
    });
    let goodsList = wx.getStorageSync('cart');
    goodsList = goodsList.filter(item=>{
      return !item.isSelect
    });
    wx.setStorageSync('cart', goodsList);
    wx.reLaunch({
      url: '/pages/cart/index'
    })
  }
})