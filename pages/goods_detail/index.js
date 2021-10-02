// 导入自己封装的axios
import axios from '../../request/myAxios';
Page({
  // 自定义数据
  // 商品全部信息
  goodsAllDetail:{},
  // 拿出小图片
  goodsIcon:'',
  data: {
    // 商品id
    goodsId:'',
    // 轮播图
    goodsPics:[],
    // 价格
    goodsPirce:'',
    // 商品名
    goodsTitle:'',
    // 商品详情
    goodsDetail:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getGoodsDetail();
  },

  // 请求页面数据
  getGoodsDetail(){
    axios({
      url:'/goods/detail',
      data:{
        goods_id:this.options.goods_id
      }
    }).then(res=>{
      // 拿小图标
      this.goodsIcon = res.data.message.goods_small_logo;
      // 拿id
      let goodsId = res.data.message.goods_id;
      // 获取轮播图
      let goodsPics = res.data.message.pics;
      // 获取价钱
      let goodsPirce = res.data.message.goods_price;
      // 获取商品名
      let goodsTitle = res.data.message.goods_name;
      // 获取详情
      let goodsDetail = res.data.message.goods_introduce;
      goodsDetail = goodsDetail.replace(/<img/g,'<img class="detailImg"');
      // 兼容ios
      try{
        const res = wx.getSystemInfoSync()
        if(res.system.includes('iOS')){
          goodsDetail = goodsDetail.replace(/.webp/g,'".jpg"');
        }
      }catch(e){
        console.log(e);
      }
      // 渲染页面
      this.setData({
        goodsId,goodsPics,goodsPirce,goodsTitle,goodsDetail
      })      
    })
  },
  // 加入购物车触发
  addCart(e){
    let cart = wx.getStorageSync('cart') || [];
    let index = cart.findIndex(item=>item.goodsId == this.data.goodsId)

    if( index > -1){
      cart[index].goodsCount++;
    }else{
      // 创建商品对象
      let goodsObj = {
        id:this.data.goodsId,
        icon:this.goodsIcon,
        name : this.data.goodsTitle,
        price:this.data.goodsPirce,
        goodsCount: 1,
        isSelect: true
      };
      cart.unshift(goodsObj);
    }
    wx.setStorageSync('cart', cart);
    wx.showToast({
      title: '添加购物车成功',
      icon:"none",
      mask:true
    })
  },
  // 立即购买触发
  nowBuy(){
    wx.showToast({
      title: '尚未开发',
      icon:'none'
    })
  },
  // 点击购物车触发
  goToCart(){
    wx.switchTab({
      url: '/pages/cart/index'
    })
  }
})