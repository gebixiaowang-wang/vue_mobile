<template>
  <div class="search-result">
    <van-pull-refresh
      v-model="refreshing"
      @refresh="onRefresh"
      success-text="刷新成功"
      success-duration="500"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        offset="1"
      >
        <van-cell
          v-for="item in searchResultlist"
          :key="item.title"
          :title="item.art_id"
        />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  // 组件名称
  name: 'searchResult',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  // 组件状态值
  data() {
    return {
      searchResultlist: [],
      loading: false,
      finished: false,
      error: false, //加载错误的显示隐藏
      page: 1,
      refreshing: false //控制刷新
    }
  },
  // 组件方法
  methods: {
    async onLoad() {
      //  根据数据获取搜索结果
      try {
        const { data: res } = await request.get(`/app/v1_0/search`, {
          params: {
            page: this.page,
            per_page: 20,
            q: this.searchText
          }
        })
        //  模拟刷新失败
        // if (Math.random() > 0.5) {
        //   JSON.parse('asdasd')
        // }
        // 获取到的数据是空就完成
        if (res.data.results.length === 0) {
          this.loading = false
          this.finished = true
          return this.$toast('没有数据了')
        }
        console.log(this.page)
        const results = res.data.results
        this.searchResultlist.push(...results)
        // 获取后让页码加1
        this.page++
        // 获取成功后关闭加载状态
        this.loading = false
      } catch (err) {
        this.loading = false
        this.error = true
        this.$toast('获取搜索结果失败')
      }
    },
    // 下拉刷新事件
    onRefresh() {
      // this.loading = true
      this.onLoad()
      this.refreshing = false
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
