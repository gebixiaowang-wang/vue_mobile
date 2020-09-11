<template>
  <!-- 如果没有关注该用户就显示关注按钮 -->
  <van-button
    v-if="!isFollowed"
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    @click="followings"
    :loading="loading"
    >关注</van-button
  >
  <!-- 关注就显示已关注按钮 -->
  <van-button
    v-else
    class="follow-btn"
    round
    size="small"
    @click="cancelFollow"
    :loading="loading"
    >已关注</van-button
  >
</template>

<script>
import request from '@/utils/request'
export default {
  // 组件名称
  name: '',
  // 局部注册的组件
  components: {},
  model: {
    prop: 'followed', //默认是value 这是自己修改的接收参数名
    event: 'change' //默认是input 自己修改的自定义事件名称
  },
  // 组件参数 接收来自父组件的数据
  props: {
    isFollowed: {
      type: Boolean,
      required: true
    },
    userId: {
      type: [Number, String, Object],
      required: true
    }
  },
  // 组件状态值
  data() {
    return {
      loading: false
    }
  },
  // 组件方法
  methods: {
    // 关注用户事件
    async followings() {
      if (this.$store.state.user) {
        this.loading = true
        try {
          const { data: res } = await request.post(
            `/app/v1_0/user/followings`,
            {
              target: this.userId
            }
          )
          // 关注成功后 改变按钮
          this.$emit('updata-is_followed', true)
          // this.isFollowed = true
        } catch (err) {
          if (err.response && err.response.status === 400) {
            this.$toast('不能关注自己')
          } else {
            this.$toast('关注失败')
          }
        }
        this.loading = false
      } else {
        this.isLogin()
      }
    },
    // 取消关注事件
    async cancelFollow() {
      this.loading = true
      try {
        const { data: res } = await request.delete(
          `/app/v1_0/user/followings/${this.userId}`
        )
        // 取消关注成功后改变按钮状态
        this.$emit('updata-is_followed', false)
        // this.isFollowed = false
      } catch (err) {
        this.$toast('取消关注失败')
      }
      this.loading = false
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

<style scoped lang="less"></style>
