// pages/index/index.js
// 导入自己封装的axios
import axios from '../../request/myAxios';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerImg:[], //轮播图
    catitems:[],   //导航信息
    goodsList:[]    //产品列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 请求轮播图
    axios({
      url:'/home/swiperdata'
    }).then(res=>{
      this.setData({bannerImg:res.data.message});
    });
    // 请求分类栏
    axios({
      url:'/home/catitems'
    }).then(res=>{
      res.data.message.forEach(item=>{
        if(item.navigator_url){
          item.navigator_url = item.navigator_url.replace('/main','/index');
        }
      });
      this.setData({
        catitems:res.data.message
      });
    });
    // 请求时尚列表
    axios({
      url:'/home/floordata'
    }).then(res=>{
      let {message} = res.data
      message.forEach((item,index)=>{
        item.id = index;
        item.product_list.forEach(v=>{
          v.navigator_url = v.navigator_url.replace('?',"/index?");
        });
      });

      this.setData({
        goodsList:message
      })
    });
  },

  // 跳转页面
  goToPage(e){
    let pageMessage = e.currentTarget.dataset.page;
    console.log(pageMessage);
    if(pageMessage.navigator_url && pageMessage.open_type == 'switchTab'){
      wx.switchTab({
        url: pageMessage.navigator_url,
      })
    }
    

  }
})