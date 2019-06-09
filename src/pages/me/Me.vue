<template>
  <div class="container"> 
    <div class="userinfo" @click="login">
      <img :src="userinfo.avatarUrl" alt>
      <p>{{userinfo.nickName}}</p>
    </div>
    <year-progress></year-progress>
    <button v-if="userinfo.openId" @click="scanBook" class="btn">添加图书</button>
  </div>
</template>

<script>
import YearProgress from "@/components/YearProgress";
import config from "@/config";
import utils from "@/utils/index";
import qcloud from "wafer2-client-sdk";
export default {
  data() {
    return {
      userinfo: {
        avatarUrl: "./../../static/img/unlogin.png",
        nickName: "点击登录"
      }
    };
  },
  methods: {
    scanBook() {
      wx.scanCode({
        success: res => {
          console.log(res)
          if(res.result) {
            this.addBook(res.result)      
          }
        }
      });
    },
    async addBook(isbn) { // 扫码成功后添加书籍
      const res = await utils.post('/weapp/addbook', {
        isbn,
        openid: this.userinfo.openId
      })
      console.log(res)
      if (res.code === 0) {
        utils.showModal('提示',`添加成功${res.title}`)
      } else {
        utils.showModal('提示', `添加失败${res.msg}`)
      }
    },
    async login() {
      let user = wx.getStorageSync("userinfo");
      if (!user) {
        wx.showLoading({
          title: "登录中",
          mask: true
        })
        qcloud.setLoginUrl(config.loginUrl);
        qcloud.login({
          success: (res) => {
            wx.hideLoading()
            console.log("success:", res);
            wx.setStorageSync("userinfo", res);
            this.userinfo = res
            utils.showSuccess("登录成功");
          },
          fail: function(err) {
            console.log("fail:", err);
          }
        });
      }
    }
  },
  components: {
    YearProgress
  },
  onShow() {
    let userinfo = wx.getStorageSync("userinfo")
    if (userinfo) {
      this.userinfo = userinfo
    }
  }
};
</script>

<style lang="scss">
.container {
  padding: 0 30rpx;
  .userinfo {
    margin-top: 100rpx;
    text-align: center;
    img {
      width: 150rpx;
      height: 150rpx;
      border-radius: 50%;
    }
  }
}
</style>


