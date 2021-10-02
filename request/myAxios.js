// 封装微信的请求函数

// 基地址
let baseURL = 'https://api-hmugo-web.itheima.net/api/public/v1'

// 统计请求的数量
let requestCount = 0;

const axios = (params)=>{
  requestCount++;
  // 显示加载
  wx.showNavigationBarLoading()
  if(params.url.includes('/my/')){
    params.header = {
      Authorization: wx.getStorageSync('token')
    }
  }
  return new Promise((resolve,reject)=>{
    wx.request({
      ...params,
      url:baseURL+ params.url,
      success:(res)=>{
        resolve(res);
      },
      fail:(res)=>{
        wx.showToast({
          title: '请求出错',
          icon:"none"
        })
        reject(res);
      },
      complete:()=>{
        // 请求结束统计减一
        requestCount--;
        if(requestCount == 0){
          wx.hideNavigationBarLoading();
        }
      }
    })
  })
}

export default axios;