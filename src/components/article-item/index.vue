<template>
  <!-- 点击这个单元格 就携带当前文章的id打开article页面 -->
  <!-- to也可以写对象{name:'article',params:{articleId:art_id}} -->
  <!-- to属性和vuerouter中的router-link 中的to属性用法是一样的 -->
  <van-cell class="article-item" :to="`/article/${article.art_id}`">
    <!-- 插槽 -->
    <div slot="title" class="title van-multi-ellipsis--l2">
      {{ article.title }}
    </div>
    <div slot="label">
      <!-- 如果封面是三张的话就渲染这三张图片 -->
      <div class="cover-wrap" v-if="article.cover.type === 3">
        <div
          class="cover-item"
          :key="index"
          v-for="(item, index) in article.cover.images"
        >
          <van-image
            class="cover-item-img"
            fit="cover"
            src="https://img.yzcdn.cn/vant/cat.jpeg"
          />
        </div>
      </div>
      <div class="label-info-wrap">
        <span>{{ article.aut_name }}</span>
        <span>{{ article.comm_count }}</span>
        <span>{{ article.pubdate | dateFormat }}</span>
      </div>
    </div>
    <van-image
      v-if="article.cover.type === 1"
      slot="default"
      class="right-cover"
      fit="cover"
      src="https://img.yzcdn.cn/vant/cat.jpeg"
    />
  </van-cell>
</template>

<script>
export default {
  // 组件名称
  name: 'articleItem',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    article: {
      type: Object,
      required: true
    }
  },
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
.article-item {
  .title {
    color: #3a3a3a;
    font-size: 32px;
  }
  .cover-wrap {
    display: flex;
    padding: 30px 0;
    .cover-item {
      height: 146px;
      flex: 1;
      &:not(:last-child) {
        padding-right: 4px;
      }
      .cover-item-img {
        width: 100%;
        height: 146px;
      }
    }
  }
  .van-cell__value {
    flex: unset;
    width: 232px;
    height: 146px;
    padding-left: 30px;
  }
  .right-cover {
    width: 232px;
    height: 146px;
  }
  .label-info-wrap span {
    font-size: 22px;
    color: #b4b4b4;
    margin-right: 25px;
  }
}
</style>
