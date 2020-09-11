<template>
  <div class="my-article">
    <van-nav-bar
      class="page-nav-bar"
      title="我的发布"
      left-arrow
      @click-left="$router.back()"
    />
    <article-list history="yes" requestURL="user/articles"></article-list>
  </div>
</template>

<script>
import articleList from '@/views/home/components/article-list.vue'
export default {
  // 组件名称
  name: 'myArticle',
  // 局部注册的组件
  components: {
    articleList
  },
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data() {
    return {}
  },
  // 组件方法
  methods: {},
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
.page-nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
}
</style>
