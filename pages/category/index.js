import axios from "../../request/myAxios"

Page({
  // 自定义数据
  allClassify:[],

  /**
   * 页面的初始数据
   */
  data: {
    goodsTab:[],        //商品分类切换栏数据
    goodsTabIndex:0,     //tab栏选中的的索引
    goods:[]            //对应的商品信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: 'goodsMessage',
      success:(res)=>{
        if(+Date.now() - +res.data.date > 1000 * 60 * 5){
          // 获取分类页面数据
          this.getClassifyMessage();
        }else{
          this.allClassify = res.data.data;
          this.setGoodsMessage();
        }
      },
      fail:()=>{
        // 获取分类页面数据
        this.getClassifyMessage();
      }
    })
    
  },

  // 获取分类页面数据方法
  getClassifyMessage(){
    axios({
      url:'/categories'
    }).then(res=>{
      this.allClassify = res.data.message;  
      this.setGoodsMessage();
      wx.setStorage({
        data: {
          date:Date.now(),
          data:[...this.allClassify]
        },
        key: 'goodsMessage',
      })
    })
  },

  // 设置页面渲染数据
  setGoodsMessage(){
    // 将tab栏数据化简取出
    let arrTab = this.allClassify.map(item=>{
      return {
        id:item.cat_id,
        name:item.cat_name
      }
    });
    // 设置tab栏内容
    this.setData({
      goodsTab:arrTab
    });
    // 设置对应商品内容
    this.setData({
      goods:this.allClassify[this.data.goodsTabIndex].children
    });
  },

  // 点击tab触发
  selectTab(e){
    let index = e.currentTarget.dataset.index;
    this.setData({
      goodsTabIndex:index
    });
    this.setData({
      goods:this.allClassify[this.data.goodsTabIndex].children
    });
  },

  // 点击商品触发
  selectGoods(e){
    // console.log(e.currentTarget.dataset);
    
    // 去除商品id和名字
    let shopName = e.currentTarget.dataset.goodsdata.cat_name;
    let shopId = e.currentTarget.dataset.goodsdata.cat_id;
    wx.navigateTo({
      url: `/pages/goods_list/index?cid=${shopId}&query=${shopName}`,
    })
  }
})