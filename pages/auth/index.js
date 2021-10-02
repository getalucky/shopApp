// pages/auth/index.js
// 导入自己封装的axios
import axios from '../../request/myAxios';

Page({
  // 请求参数
  params:{},
  // 授权
  bindGetUserInfo(e){
    if(e.detail.userInfo){
      // 获取用户得信息
      this.params.encryptedData = e.detail.encryptedData;
      this.params.rawData = e.detail.rawData;
      this.params.iv = e.detail.iv;
      this.params.signature = e.detail.signature;
      // 获取code
      wx.login({
        success: (res) => {
          let {code} = res;
          this.params.code = code;
          axios({
            url:'/users/wxlogin',
            method:'post',
            data:this.params
          }).then(res=>{
            console.log(res);
            if(!res.data.message){
              wx.showToast({
                title: '请求出错，请再授权一次',
                icon:'noen'
              })
            }else{
              wx.setStorageSync('token', res.data.message.token);
              wx.navigateBack();
            }
          });
        },
      })
    }
    
  }
})
