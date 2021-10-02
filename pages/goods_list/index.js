// 导入自己封装的axios
import axios from '../../request/myAxios';

Page({
  // 自定义数据
  // 请求参数
  params:{
    query:'',
    cid:'',
    pagenum:1,
    pagesize:10
  },
  // 返回的数据
  returnGoodsList:[],
  // 商品总条数
  total:0,
  /**
   * 页面的初始数据
   */
  data: {
    tabItems:[            //tab栏选项
      {id:0,name:'综合'},
      {id:1,name:'销量'},
      {id:2,name:'价格'}
    ],
    tabIndex:0,          //tab选项的索引
    showGoodsList:[]     //展示的商品列表   

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.params.cid = options.cid;
    this.params.query = options.query;
    this.getGoodsList();
  },

  // 请求页面数据方法
  getGoodsList(){    
    return axios({
      url:'/goods/search',
      data:this.params
    }).then(res=>{
      // 拿出商品总条数
      this.total = res.data.message.total;
      // 拿出商品数组
      let goods = res.data.message.goods; 
      this.returnGoodsList = [...this.returnGoodsList,...goods];
      // 简化商品数据
      let easygoodsList = goods.map(item=>{
        return{
          id:item.goods_id,
          name:item.goods_name,
          price:item.goods_price,
          icon:item.goods_small_logo
        }
      });
      easygoodsList.unshift(...this.data.showGoodsList);
      // 设置可见的商品数据
      this.setData({
        showGoodsList:easygoodsList
      });
    });
  },

  // 点击tab切换触发
  handleTab(e){
    let index = e.currentTarget.dataset.tabindex;
    this.setData({
      tabIndex:index
    });
  },

  //点击商品查看详情触发
  goToDetail(e){
    let goodsId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/goods_detail/index?goods_id=${goodsId}`
    })
  },

  // 页面滑动触底
  onReachBottom(){
    if(this.returnGoodsList.length == this.total) {
      if(this.returnGoodsList.length > this.params.pagesize){
        wx.showToast({
          title: '没有啦',
          icon:"none"
        })
      }
    }else{
      this.params.pagenum++;
      this.getGoodsList();
    }
  },

  // 页面下拉触发
  async onPullDownRefresh(){
    this.params.pagenum = 1;
    this.returnGoodsList = [];
    this.setData({
      showGoodsList:[]
    });
    await this.getGoodsList();
    wx.stopPullDownRefresh();
  }
})