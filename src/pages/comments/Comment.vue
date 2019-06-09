<template>
  <div>
    <comment-list type="user" :userinfo="userinfo" :comments="comments"></comment-list>
    <card v-for="book in books" :key="book" :book="book"></card>
  </div>
</template>
<script>
import CommentList from '@/components/CommentList'
import Card from '@/components/Card'
import utils from '@/utils/index'
export default {
  data() {
    return {
      userinfo: {},
      comments: [],
      books: []
    }
  },
  methods: {
    init() {
      wx.showNavigationBarLoading()
      this.getComments()
      this.getBooks()
      wx.hideNavigationBarLoading()
    },
    async getBooks() {
      const books = await utils.get('/weapp/booklist', {openid: this.userinfo.openId})
      this.books = books.list
    },
    async getComments() {
      const comments = await utils.get('/weapp/commentlist', {openid: this.userinfo.openId})
      this.comments = comments.list
    }
  },
  onPullDownRefresh() {
    this.init()
    wx.stopPullDownRefresh()
  },
  components: {
    CommentList,
    Card
  },
  onShow() {
    if (!this.userinfo.openId) {
      const userinfo = wx.getStorageSync('userinfo')
      if (userinfo) {
        this.userinfo = userinfo
      }
      this.init()
    }
  },
};
</script>
<style>
</style>
