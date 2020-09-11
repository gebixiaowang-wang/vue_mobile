<template>
  <div class="comment-reply">
    <!-- 导航栏 -->
    <van-nav-bar
      :title="
        comment.reply_count > 0 ? `${comment.reply_count}条回复` : '没有回复'
      "
    >
      <!-- 关闭图标 -->
      <van-icon
        slot="left"
        name="cross"
        @click="$emit('reply-close')"
      ></van-icon>
    </van-nav-bar>
    <div class="scroll-wrap">
      <comment-item :comment="comment" type="x"></comment-item>
      <!-- 评论的回复列表 -->
      <van-cell title="全部回复"></van-cell>
      <!-- 使用封装的commentlist组件 生成评论回复列表 -->

      <comment-list
        :source="comment.com_id"
        type="c"
        :list="list"
        @reply-click="replyClick"
      ></comment-list>
    </div>
    <!-- 发布评论 -->
    <div class="post-wrap">
      <van-button class="post-btn" round @click="replyShow = true"
        >写评论</van-button
      >
    </div>
    <!-- 点击写评论回复弹出层 -->
    <van-popup v-model="replyShow" position="bottom">
      <!-- 封装的发布回复组件 -->
      <comment-post
        :target="comment.com_id"
        @post-success="success"
      ></comment-post>
    </van-popup>
    <!-- 点击回复显示回复弹出层 -->
    <van-popup v-model="replyShow" position="bottom">
      <!-- 封装的发布回复组件 -->
      <comment-post
        :target="comment.com_id"
        @post-success="success"
      ></comment-post>
    </van-popup>
  </div>
</template>

<script>
import commentItem from './comment-item'
import commentList from './comment-list'
import commentPost from './comment-post'

export default {
  // 组件名称
  name: 'commentReply',
  // 局部注册的组件
  components: {
    commentItem,
    commentList,
    commentPost
  },
  // 组件参数 接收来自父组件的数据
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  // 组件状态值
  data() {
    return {
      replyShow: false,
      list: [] //评论回复的数据 先传递给子组件是空数组 子组件获取数据后添加到数组中是有响应式的
    }
  },
  // 组件方法
  methods: {
    //   监听post评论组件传递的发布成功事件
    success(data) {
      // 回复数量++
      this.comment.reply_count++
      //   监听子组件的发布成功事件 子组件把响应的数据 传递给父组件 父组件把对象push到数组中
      this.list.unshift(data.new_obj)
      //   关闭弹出框
      this.replyShow = false
    },
    // 监听子组件的回复事件
    replyClick() {}
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 生命周期钩子   注：没用到的钩子请自行删除
  /**
   * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
   */
  created() {
    //   挂载阶段判断 当前评论的回复数量 如果没有回复的话 就直接显示回复框
    if (this.comment.reply_count === 0) {
      this.replyShow = true
    }
  },
  /**
   * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
   */
  mounted() {}
}
</script>

<style scoped lang="less">
.scroll-wrap {
  position: fixed;
  top: 92px;
  left: 0;
  right: 0;
  bottom: 88px;
  overflow-y: auto;
}
.post-wrap {
  position: fixed;
  bottom: 10px;
  left: 0;
  right: 0;
  height: 88px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  .post-btn {
    width: 60%;
    height: 80px;
  }
}
</style>
