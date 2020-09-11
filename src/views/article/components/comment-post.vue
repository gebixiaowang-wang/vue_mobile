<template>
  <div class="comment-post">
    <van-field
      class="post-field"
      v-model.trim="message"
      rows="2"
      autosize
      type="textarea"
      placeholder="请输入留言"
      show-word-limit
      autofocus
    />
    <van-button
      class="post-btn"
      color="blue"
      size="mini"
      @click="postComment"
      :disabled="!message.length"
      >发布</van-button
    >
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  name: 'CommentPost',
  components: {},
  props: {
    target: {
      type: [Number, String, Object],
      required: true
    }
  },
  inject: {
    articleId: {
      type: [Number, String, Object],
      //   如果父组件不传递 默认值为null
      default: null
    }
  },
  data() {
    return {
      message: ''
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    //   发送评论事件
    async postComment() {
      //   if (this.message.trim().length === 0) {
      //     return this.$toast('请输入内容')
      //   }
      // 点击发布就显示加载
      this.$toast.loading({
        message: '发布中...',
        forbidClick: true, //禁用背景点击
        duration: 0 //持续时间 默认两秒 0表示持续
      })
      try {
        const { data: res } = await request.post(`/app/v1_0/comments`, {
          target: this.target.toString(), //文章id
          content: this.message,
          art_id: this.articleId ? this.articleId.toString() : null
        })
        // 清空文本框
        this.message = ''
        this.$toast.success('发布成功')
        console.log(res)
        // 关闭弹层 和评论显示最上边都不在本组件中执行 所以把相应的数据传给父组件由父组件操作
        this.$emit('post-success', res.data)
      } catch (err) {
        if (err.response.status === 400) {
          return this.$toast('本文章拒绝评论')
        }
        this.$toast('评论失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.comment-post {
  display: flex;
  align-items: center;
  padding: 20px 10px 20px 20px;
  .post-field {
    background-color: #f5f7f9;
  }
  .post-btn {
    margin: 0 10px 0 20px;
    width: 100px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    &::before {
      display: none;
    }
  }
  /deep/ .van-field__control {
    height: 50px !important;
    white-space: nowrap;
    overflow-x: hidden;
  }
  .van-cell {
    padding: 15px;
  }
}
</style>
