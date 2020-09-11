<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <span class="delete" style="color:red" @click="clearHistory"
        >清空历史记录</span
      >
    </van-cell>
    <van-empty description="没有历史记录" v-if="searchHistorys.length === 0">
    </van-empty>
    <van-cell
      v-else
      :title="item"
      v-for="(item, index) in searchHistorys"
      :key="index"
      @click="clickCell(item)"
    >
      <van-icon name="close" @click.stop="deleteHistory(index)" />
    </van-cell>
  </div>
</template>

<script>
export default {
  // 组件名称
  name: 'searchHistory',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    searchHistorys: {
      type: Array,
      required: true
    }
  },
  // 组件状态值
  data() {
    return {}
  },
  // 组件方法
  methods: {
    // 点击删除事件
    deleteHistory(index) {
      this.$emit('delete-history', index)
    },
    // 点击单元格事件
    clickCell(item) {
      // 点击进入搜索
      this.$emit('on-search', item)
    },
    // 点击清空按钮事件
    async clearHistory() {
      if (this.searchHistorys.length === 0) {
        return this.$toast('没有历史记录')
      }
      // 询问用户是否删除
      try {
        // 使用await等待用户响应 如果是错误就直接return 确定执行清空事件
        await this.$dialog.confirm({
          title: '确定删除吗?'
        })
        this.$emit('clear-history')
      } catch (err) {
        return
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
/deep/.van-cell__value {
  font-size: 22px;
}
.delete {
  position: absolute;
  right: 0px;
}
</style>
