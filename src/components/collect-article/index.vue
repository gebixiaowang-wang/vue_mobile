<template>
  <van-icon
    :color="value ? '#ffa500' : '#777'"
    :name="value ? 'star' : 'star-o'"
    @click="collect"
  />
</template>

<script>
import request from '@/utils/request'
export default {
  // 组件名称
  name: 'collectArticle',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    value: {
      type: Boolean,
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  // 组件状态值
  data() {
    return {}
  },
  // 组件方法
  methods: {
    async collect() {
      if (this.$store.state.user) {
        try {
          if (this.value) {
            // 取消收藏
            const { data: res } = await request.delete(
              `/app/v1_0/article/collections/${this.articleId}`
            )
          } else {
            // 收藏
            const { data: res } = await request.post(
              `/app/v1_0/article/collections`,
              {
                target: this.articleId
              }
            )
          }
          // 让父组件修改
          // 提示用户  因为父组件修改数据不是立即的 当前的value还没有改变 所以取反提示
          this.$toast(!this.value ? '收藏成功' : '取消收藏')
          this.$emit('input', !this.value)
        } catch (err) {
          this.$toast('操作失败,请重试')
        }
      } else {
        this.isLogin()
      }
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 生命周期钩子   注：没用到的钩子请自行删除
  /**
   * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
   */
  created() {},
  /**
   * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
   */
  mounted() {}
}
</script>

<style scoped lang="less">
// .van-icon {
//   font-size: 40px;
// }
</style>
