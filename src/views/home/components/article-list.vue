<template>
  <div :class="channel ? 'article-list-container' : 'collect-list-container'">
    <van-empty v-if="list.length === 0" description="一个文章都没有" />
    <van-pull-refresh
      v-else
      :success-text="refreshingSuccessText"
      v-model="refreshing"
      @refresh="onRefresh"
      success-duration="1000"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :error.sync="error"
        loading-text="加载中..."
        error-text="请求失败，点击重新加载"
        offset="10"
      >
        <article-item
          v-for="(item, index) in list"
          :key="index"
          :article="item"
        ></article-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import request from '@/utils/request'
// 导入文章模板
import articleItem from '@/components/article-item'
export default {
  // 组件名称
  name: 'articleList',
  // 局部注册的组件
  components: {
    articleItem
  },
  // 组件参数 接收来自父组件的数据
  props: {
    //   接收父组件的数据
    channel: {
      type: Object
    },
    collect: {
      type: [Number, String]
    },
    history: {
      type: [Number, String]
    },
    requestURL: {
      type: String
    }
  },
  // 组件状态值
  data() {
    return {
      list: [], //存储列表数据的数组
      loading: false, //控制加载中loading状态 true就显示转圈圈
      finished: false, //数据加载结束的状态 为true就显示没有更多了
      timestamp: null, //请求下一页数据的时间戳
      error: false, //列表加载失败的提示状态
      refreshing: false, //控制下拉刷新组件的状态
      refreshingSuccessText: '刷新成功',
      collectTotal: null, //收藏总数
      page: 1
    }
  },
  // 组件方法
  methods: {
    //   初始化者滚动到底部的时候会触发事件 触发的时候会自动把loading设置为true
    async onLoad() {
      // 异步更新数据
      try {
        if (this.channel) {
          console.log('文章')
          var { data: res } = await request.get(`/app/v1_1/articles`, {
            params: {
              channel_id: this.channel.id,
              //简单理解就是请求数据的页码 下一页的时间戳会在这次请求后响应给你
              timestamp: this.timestamp || Date.now(), //使用逻辑或短路
              with_top: 1 //是否需要置顶
            }
          })
          this.timestamp = res.data.pre_timestamp
          console.log(res)
          const results = res.data.results
          this.list.push(...results)
          //   本次数据加载结束之后要把loading关闭 关闭后才能出发下一个加载更多
          this.loading = false
          // if (Math.random() > 0.5) {
          //   JSON.parse('asdasd')
          // }
          // 判断如果获取数据长度为0 就加载玩成
          if (results.length === 0) {
            this.finished = true
          }
        } else {
          var { data: res } = await request.get(
            `/app/v1_0/${this.requestURL}`,
            {
              params: {
                page: this.page,
                per_page: 10
              }
            }
          )
          console.log(res)
          this.page++
          // this.collectTotal=res.data.total_count
          const results = res.data.results
          this.list.push(...results)
          //   本次数据加载结束之后要把loading关闭 关闭后才能出发下一个加载更多
          this.loading = false
          // if (Math.random() > 0.5) {
          //   JSON.parse('asdasd')
          // }
          if (this.history && this.list.length >= 100) {
            this.$toast('最多显示100条历史记录')
          }
          // 判断如果获取数据长度为0 就加载玩成
          if (results.length === 0) {
            this.finished = true
          }
        }
      } catch (err) {
        //   打开错误显示
        this.error = true
        // 显示错误也要关闭加载状态
        this.loading = false
      }

      // 判断数据加载完成后 就把finished设置为true 就是已完成 之后不再触发加载更多
      //   this.finished = true
    },
    // 下拉刷新数据事件
    async onRefresh() {
      if (this.channel) {
        try {
          const { data: res } = await request.get(`/app/v1_1/articles`, {
            params: {
              channel_id: this.channel.id,
              timestamp: Date.now(),
              with_top: 1 //是否需要置顶
            }
          })
          // 模拟刷新失败
          // if (Math.random() > 0.5) {
          //   JSON.parse('asdasd')
          // }
          this.list.unshift(...res.data.results)

          // 关闭下拉刷新的状态
          this.refreshing = false
          // this.$toast('刷新成功')
          this.refreshingSuccessText = `刷新了${res.data.results.length}条数据`
        } catch (err) {
          this.refreshing = false
          this.refreshingSuccessText = `刷新失败`
        }
      } else {
        this.refreshing = false
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
.article-list-container {
  // 给文章列表跟节点一个自己的滚动容器 不会相互影响
  // height: 100%; 因为父节点没有高度 所以设置高度不管用
  height: 79vh;
  overflow-y: auto;
  margin-bottom: 100px;
}
.collect-list-container {
  height: 100vh;
  overflow-y: auto;
  padding-top: 92px;
}
</style>
