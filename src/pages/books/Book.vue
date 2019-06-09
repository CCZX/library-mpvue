<template>
  <div>
    <top-swiper :tops="tops"></top-swiper>
    <card v-for="book in books" :key="book.id" :book="book"></card>
    <p class='text-footer' v-if='!more'>
      没有更多数据
    </p>
  </div>
</template>
<script>
import utils from '@/utils/index'
import Card from '@/components/Card'
import TopSwiper from '@/components/TopSwiper'
export default {
  data() {
    return {
      books: [],
      page: 0, // 分页加载
      more: true, // 是否又更多数据
      tops: [], // 排行
    }
  },
  methods: {
    async getList(init) { // 获取图书列表
      if (init) {
        this.page = 0
        this.more = true
      }
      wx.showNavigationBarLoading()
      let res = await utils.get('/weapp/booklist', {page: this.page})
      if (res.list.length < 10 && this.page > 0) {
        this.more = false

      }
      if (init) {
        this.books = res.list
        wx.stopPullDownRefresh()
      } else {
        this.books = this.books.concat(res.list)
      }
      wx.hideNavigationBarLoading()
    },
    async getTop() { // 获取排行前的数据
      let res = await utils.get('/weapp/top')
      this.tops = res.list
    }
  },
  onPullDownRefresh() {
    this.getList(true)
    this.getTop()
  },
  onReachBottom() {
    if (!this.more) {
      return
    }
    this.page++
    this.getList()
  },
  components: {
    Card,
    TopSwiper
  },
  mounted() {
    this.getList(true)
    this.getTop()
  }
}
</script>
<style>


</style>
