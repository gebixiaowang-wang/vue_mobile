<template>
  <div class="search-suggestion">
    <van-cell
      :title="item"
      icon="search"
      v-for="(item, index) in searchResultsData"
      :key="index"
      clickable
      @click="$emit('search', item)"
    >
      <div slot="title" v-html="replaceText(item)"></div>
    </van-cell>
  </div>
</template>

<script>
import request from '@/utils/request'
// 按需导入 lodash中的防抖函数
import { debounce } from 'lodash'
export default {
  // 组件名称
  name: 'searchSuggestion',
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
      // 搜索结果数据
      searchResultsData: []
    }
  },
  // 组件方法
  methods: {
    // 获取搜索结果数据
    async getResultsData(val) {
      val = val.trim()
      if (val) {
        try {
          const { data: res } = await request.get(`/app/v1_0/suggestion`, {
            params: {
              q: val
            }
          })
          console.log(res)
          this.searchResultsData = res.data.options
        } catch (err) {
          console.log('数据获取失败')
        }
      }
    },
    // 替换显示的搜索内容 高亮关键字
    replaceText(text) {
      // 正则表达式/\/中间的内容会被当作匹配字符来使用 而不是变量
      // 动态创建正则构造函数  参数 1 :匹配模式字符串 会根据这个字符串创建正则对象
      const reg = new RegExp(this.searchText, 'gi')
      const htmlStr = `<span style="color:#3296fa">${this.searchText}</span>`
      // replace不会修改原始字符串 会返回替换后的新字符串
      return text.replace(reg, htmlStr)
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {
    // 监听搜索框内容
    searchText: {
      // 当searchtext发生变化就会调用handler函数
      // handler函数名称是固定的
      // debounce是防抖方法  参数一是一个函数 参数二延迟时间
      // 返回值是防抖之后的函数
      handler: debounce(function(val) {
        this.getResultsData(val)
      }, 500),
      immediate: true //该回调会在侦听开始之后被立即调用
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

<style scoped lang="less"></style>
