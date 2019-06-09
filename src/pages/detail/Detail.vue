<template>
  <div>
    <book-info :info="info"></book-info>
    <comment-list :comments="comments" :userinfo="userinfo"></comment-list>
    <div class="comment" v-if="showAdd">
      <textarea v-model="comment" class="textarea" :maxlength="100" placeholder="请输入评论"></textarea>
      <div class="location">
        地理位置：
        <switch color="#EA5A49" @change="getGeo"></switch>
        <span class="text-primary">{{location}}</span>
      </div>
      <div class="phone">
        手机型号：
        <switch color="#EA5A49" @change="getPhone"></switch>
        <span class="text-primary">{{phone}}</span>
      </div>
      <button class="btn" @click="addComment">评论</button>
    </div>
    <div v-if="!showAdd" class="text-footer">
      未登录或者已经评论过了
    </div>
    <button open-type="share" class="btn" @click="onShareAppMessage">分享</button>
  </div>
</template>

<script>
import utils from "@/utils/index";
import BookInfo from "@/components/BookInfo";
import CommentList from "@/components/CommentList"
import config from "@/config";
export default {
  data() {
    return {
      userinfo: "", // 用户信息
      bookid: "", // 图书ID
      info: {}, // 图书信息
      comment: "12", // 留言
      location: "", // 地理位置
      phone: "", // 手机型号
      comments: [], // 评论列表
    };
  },
  computed: {
    showAdd() { // 是否展示发表评论按钮
      if (!this.userinfo.openId) { // not login
        return false
      }
      if (this.comments.some(v => v.openid = this.userinfo.openId)) { // aleary comment
        return false
      }
      return true
    }
  },
  methods: {
    async getDetail() {
      const info = await utils.get("/weapp/bookdetail", { id: this.bookid });
      wx.setNavigationBarTitle({ title: info.title });
      this.info = info;
    },
    getGeo(e) {
      if (e.target.value) {
        wx.getLocation({
          success: geo => {
            console.log(geo)
            wx.request({
              url: config.baiduURL,
              data: {
                ak: config.baiduAK,
                location: `${geo.latitude},${geo.longitude}`,
                output: "json"
              },
              success: res => {
                if (res.data.status === 0) {
                  this.location = res.data.result.addressComponent.city;
                } else {
                  this.location = "外太空";
                }
              }
            });
          }
        });
      } else {
        this.location = "";
      }
    },
    getPhone(e) {
      if (e.target.value) {
        let systemInfo = wx.getSystemInfoSync();
        this.phone = systemInfo.model;
      } else {
        this.phone = "";
      }
    },
    async addComment() {
      if (!this.comment) {
        return
      }
      const data = {
        openid: this.userinfo.openId,
        bookid: this.bookid,
        comment: this.comment,
        location: this.location,
        phone: this.phone
      }
      let res = await utils.post('/weapp/addcomment', data)
      this.getComments()
      if(res.code === 0) {
        wx.showToast({
          title: '留言成功',
          icon: 'success',
          duration: 1000
        })
      } else {
        wx.showToast({
          title: '留言失败',
          icon: 'fail',
          duration: 1000
        })
      }
    },
    async getComments() {
      const comments = await utils.get('/weapp/commentlist', {bookid: this.bookid})
      console.log(comments)
      this.comments  = comments.list
    }
  },
  onShareAppMessage(e) {
    console.log(e)
  },
  components: {
    BookInfo,
    CommentList
  },
  mounted() {
    this.bookid = this.$root.$mp.query.id;
    this.getDetail();
    const userinfo = wx.getStorageSync('userinfo')
    console.log(userinfo)
    this.userinfo = userinfo
    this.getComments()
  }
};
</script>

<style lang="scss">
.comment {
  margin-top: 10px;
  .textarea {
    width: 730rpx;
    height: 200rpx;
    background: #eee;
    padding: 10rpx;
  }
  .location {
    margin-top: 10px;
    padding: 5px 10px;
  }
  .phone {
    margin-top: 10px;
    padding: 5px 10px;
  }
}
</style>


