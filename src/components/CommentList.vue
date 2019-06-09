<template>
  <div class="comment-list">
    <div class="page-title" v-if="comments.length">评论</div>
    <div
      class="comment"
      v-for="comment in comments"
      :key="comment.id"
      @click="handleClick(comment)"
      :class="{isme: comment.openid === userinfo.openId}"
    >
      <div class="user">
        <div class="inline">
          <img :src="comment.image" class="avatar" mode="aspectFit">
          {{comment.title}}
        </div>
        <div class="right">
          {{comment.location||'未知地点'}}
          <span class="text-primary">--</span>
          {{comment.phone||'未知型号'}}
        </div>
      </div>
      <div class="content">{{comment.comment}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["comments", "type", "userinfo"],
  methods: {
    handleClick(comment) {
      if (this.type === "user") {
        wx.navigateTo({
          url: "/pages/detail/main?id=" + comment.bookid
        });
      }
    }
  }
};
</script>

<style lang='scss'>
.comment-list {
  background: #eee;
  font-size: 14px;
  .isme::after {
    // border: 1px solid red;
    display: inline-block;
    content: '★';
    font-size: 50rpx;
    color: red;
    position: absolute;
    top: 0;
    right: 0;
  }
  .comment {
    background: white;
    margin-bottom: 10px;
    padding: 5px 20px;
    position: relative;
    .content {
      margin: 10px 0;
    }
    .user {
      .inline {
        display: inline;
        .avatar {
          width: 20px;
          height: 20px;
          border-radius: 50%;
        }
      }
    }
  }
}
</style>

