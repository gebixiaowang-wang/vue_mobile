<template>
  <van-cell class="comment-item">
    <van-image
      slot="icon"
      class="avatar"
      round
      fit="cover"
      :src="comment.aut_photo"
    />
    <div slot="title" class="title-wrap">
      <div class="user-name">{{ comment.aut_name }}</div>
      <van-button
        class="like-btn"
        :class="{ liked: comment.is_liking }"
        :icon="comment.is_liking ? 'good-job' : 'good-job-o'"
        @click="commentLike"
        :loading="likeLoading"
      >
        {{ comment.like_count > 0 ? comment.like_count : '赞' }}
      </van-button>
    </div>

    <div slot="label">
      <p class="comment-content">{{ comment.content }}</p>
      <div class="bottom-info">
        <span class="comment-pubdate">{{ comment.pubdate | dateFormat }}</span>
        <van-button
          v-if="type === 'a'"
          class="reply-btn"
          round
          @click="$emit('reply-click', comment)"
          >回复 {{ comment.reply_count }}</van-button
        >
      </div>
    </div>
  </van-cell>
</template>

<script>
import request from '@/utils/request'
export default {
  name: 'CommentItem',
  components: {},
  props: {
    comment: {
      type: [Number, Object],
      required: true
    },
    type: {
      type: String,
      default: 'a',
      validator(val) {
        return ['a', 'c', 'x'].includes(val)
      }
    }
  },
  data() {
    return {
      likeLoading: false //控制按钮的加载事件
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 点赞事件
    async commentLike() {
      // 登录状态点赞 没有登陆弹框
      if (this.$store.state.user) {
        //   按钮加载
        this.likeLoading = true
        try {
          if (this.comment.is_liking) {
            // 取消点赞
            const { data: res } = await request.delete(
              `/app/v1_0/comment/likings/${this.comment.com_id}`
            )
            this.comment.like_count--
          } else {
            //    点赞
            const { data: res } = await request.post(
              `/app/v1_0/comment/likings`,
              {
                target: this.comment.com_id
              }
            )
            this.comment.like_count++
          }
          //   是否喜欢取反
          this.comment.is_liking = !this.comment.is_liking
        } catch (err) {
          this.$toast('出错了,请稍后重试')
        }
        // 按钮加载结束
        this.likeLoading = false
      } else {
        this.isLogin()
      }
    }
  }
}
</script>

<style scoped lang="less">
.comment-item {
  .avatar {
    width: 72px;
    height: 72px;
    margin-right: 25px;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .user-name {
      color: #406599;
      font-size: 26px;
    }
  }
  .comment-content {
    font-size: 32px;
    color: #222222;
    word-break: break-all;
    text-align: justify;
  }
  .comment-pubdate {
    font-size: 19px;
    color: #222;
    margin-right: 25px;
  }
  .bottom-info {
    display: flex;
    align-items: center;
  }
  .reply-btn {
    // width: 135px;
    height: 48px;
    line-height: 48px;
    font-size: 21px;
    color: #222;
  }
  .like-btn {
    height: 30px;
    padding: 0;
    border: none;
    font-size: 19px;
    line-height: 30px;
    margin-right: 7px;
    .van-icon {
      font-size: 30px;
    }
  }
  .liked {
    color: #e5645f;
  }
}
</style>
