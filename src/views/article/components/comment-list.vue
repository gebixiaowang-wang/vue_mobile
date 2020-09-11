<template>
  <van-empty description="不要让楼主等太久" v-if="list.length === 0">
  </van-empty>
  <van-list
    v-else
    v-model="loading"
    :finished="finished"
    @load="onLoad"
    :error="error"
    error-text="加载失败,请点击重试"
    :immediate-check="false"
  >
    <!-- 关闭首次初始检查 -->
    <comment-item
      v-for="(item, index) in list"
      :key="index"
      :comment="item"
      @reply-click="$emit('reply-click', $event)"
    ></comment-item>
  </van-list>
</template>

<script>
import request from '@/utils/request'
import commentItem from './comment-item'
export default {
  // 组件名称
  name: 'commentList',
  // 局部注册的组件
  components: {
    commentItem
  },
  // 组件参数 接收来自父组件的数据
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    list: {
      type: Array,
      // 给默认值 如果没有传递的话 就是空数组
      default: () => []
    },
    type: {
      type: String,
      //   指定默认值
      default: 'a',
      //   自定义prop数据验证
      validator(value) {
        return ['a', 'c'].includes(value)
      }
    }
  },
  // 组件状态值
  data() {
    return {
      loading: false,
      finished: false,
      offset: null, //获取下一页数据的标记
      error: false
      //   total: 0
    }
  },
  // 组件方法
  methods: {
    async onLoad() {
      //   console.log(this.source)
      // 获取数据
      try {
        const { data: res } = await request.get(`/app/v1_0/comments`, {
          params: {
            type: this.type, //评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
            source: this.source.toString(), //文章id
            offset: this.offset, //获取评论数据的偏移量，值为评论id，表示从此id的数据向后取
            limit: 15 //获取几条评论
          }
        })
        // 把数据push到数组中
        const results = res.data.results
        // 这里list是父组件传递过来的 具有响应式
        this.list.push(...results)
        // 把评论总数 传递给父组件
        this.$emit('comment-data', res.data)
        const total = res.data.total_count
        if (this.type === 'a') {
          console.log('文章评论', res.data)
        } else {
          console.log('评论回复', res.data)
        }

        // 关闭加载状态
        this.loading = false
        // 判断是否还有数据
        if (results.length && res.data.last_id) {
          this.offset = res.data.last_id
        } else {
          // 没有数据就显示加载完成
          this.finished = true
        }
      } catch (err) {
        this.$toast('获取评论失败')
        this.error = true
        this.loading = false
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
  created() {
    //   因为要滚动到一定位置才会加载数据 但是我们要立即获取到回复总数
    //  所以创建页面的时候直接获取数据
    //  初始加载的时候加载框不会出现 手动开启初始loading
    this.loading = true
    this.onLoad()
  },
  /**
   * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
   */
  mounted() {}
}
</script>

<style scoped lang="less">
.van-empty {
  padding: 0;
}
</style>
