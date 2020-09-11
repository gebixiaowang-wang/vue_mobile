<template>
  <div class="search-container">
    <!-- 搜索栏区域 -->
    <!-- 在vant-search外层添加from标签,其active不为空就可以在ios输入法中显示搜索按钮 -->
    <form action="/">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
        background="#3296fa"
        @focus="isResultShow = false"
      />
    </form>
    <!-- 搜索结果 -->
    <search-result
      v-if="isResultShow"
      :search-text="searchText"
    ></search-result>
    <!-- 联想建议 -->
    <!-- 如果搜索框内有数据的话显示联想建议 -->
    <search-suggestion
      v-else-if="searchText"
      :search-text="searchText"
      @search="onSearch"
    ></search-suggestion>
    <!-- 搜索历史记录 -->
    <!-- 没有的话就显示搜索历史 -->
    <search-history
      v-else
      :search-historys="searchHistoryList"
      @delete-history="deleteHistory"
      @on-search="onSearch"
      @clear-history="clearHistory"
    ></search-history>
  </div>
</template>

<script>
// 导入三个子组件
import searchHistory from './components/search-history'
import searchSuggestion from './components/search-suggestion'
import searchResult from './components/search-result'
import { setItem, getItem } from '@/utils/storage'
export default {
  // 组件名称
  name: 'searchIndex',
  // 局部注册的组件
  components: {
    searchHistory,
    searchSuggestion,
    searchResult
  },
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data() {
    return {
      searchText: '', //搜索框数据绑定
      isResultShow: false, //控制搜索结果的显示隐藏 默认不显示
      // 获取本地中的历史记录 有的话 就用 没有就赋值为空数组
      searchHistoryList: getItem('search-historys') || [] //搜索历史记录
    }
  },
  // 组件方法
  methods: {
    //   点击搜索事件
    onSearch(val) {
      // 显示搜索结果 另外两个会根据v-if自动消失
      // 要求不要有重复历史记录 最新的排在最前面
      // 找到有历史记录的索引
      const index = this.searchHistoryList.indexOf(val)
      // 如果有这个数据的话 就删除数据 没有就不做处理
      if (index !== -1) {
        this.searchHistoryList.splice(index, 1)
      }
      // 将本次搜索的内容添加到历史记录的最前边
      this.searchHistoryList.unshift(val)
      // 让现在的搜索框值等于点击搜索建议的值
      this.searchText = val
      this.isResultShow = true
    },
    // 点击取消按钮
    onCancel() {
      this.$router.go(-1)
    },
    deleteHistory(index) {
      this.searchHistoryList.splice(index, 1)
    },
    // 清空历史记录
    clearHistory() {
      this.searchHistoryList = []
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {
    // 监听历史记录数组发生变化之后 执行代码
    searchHistoryList(val) {
      // 形参val就是最新的数据
      setItem('search-historys', val)
    }
  },
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
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .van-search {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 1;
  }
}
</style>
