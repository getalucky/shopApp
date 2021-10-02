// pages/cart/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList:Array,
    // 所有金额
    allPrice:'',
    // 判断全选
    allSelect:false,
    // 选中的商品数
    selectGoodsCount:0
  },
  // 页面加载
  onLoad(){
  },
  onShow(){
    let goodsList = wx.getStorageSync('cart') || [];
    this.statisticsGoods(goodsList)
  },
  // 计算总金额和判断全选
  statisticsGoods(goodsList){
    // 存储总金额
    let money= 0;
    // 计算选中的商品数
    let selectGoods = 0;
    if(goodsList.length > 0){
      // 循环判断金额和是否全选
      goodsList.forEach(item=>{
        if(item.isSelect){money += item.price * item.goodsCount;}
        if(item.isSelect){          
          selectGoods++;
        }
        
      });
    }
    // 满足条件，全选
    if(selectGoods == goodsList.length){      
      this.setData({
        allSelect:true
      })
    }else{
      this.setData({
        allSelect:false
      })
    }
    // 渲染页面
    this.setData({
      goodsList,
      allPrice:money,
      selectGoodsCount:selectGoods
    });
    wx.setStorageSync('cart', goodsList);
  },
  // 选择商品
  radioSelect(e){
    // 获取点击商品的索引
    let {index} = e.currentTarget.dataset
    // 拿到页面的商品信息
    let goodsArr = this.data.goodsList;
    goodsArr[index].isSelect = !goodsArr[index].isSelect;
    // 更新数据
    this.statisticsGoods(goodsArr);
  },
  // 加减商品
  chageCount(e){
    let {key,index} = e.currentTarget.dataset;
     // 拿到页面的商品信息
     let goodsArr = this.data.goodsList;
    if(key){
      // +
      goodsArr[index].goodsCount++;
      // 更新数据
      this.statisticsGoods(goodsArr);
    }else{
      // -
      if(goodsArr[index].goodsCount == 1){
        wx.showModal({
          content:'是否删除商品',
          confirmColor:'red',
          success :res=> {
            if (res.confirm) {
              goodsArr.splice(index,1);
              // 更新数据
              this.statisticsGoods(goodsArr);
            }
          }
        })
      }else{
        goodsArr[index].goodsCount--;
      }
      // 更新数据
      this.statisticsGoods(goodsArr);
    }
  },
  // 全选触发
  allSelectBtn(){
    let goodsList = wx.getStorageSync('cart') || [];
    goodsList.forEach(item=>{
      item.isSelect = !this.data.allSelect;
    });
    this.statisticsGoods(goodsList);
  },
  // 结算触发
  settlement(){
    wx.navigateTo({
      url: '/pages/pay/index',
    })
  }


})