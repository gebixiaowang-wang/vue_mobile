<template>
  <div class="video-container">
    <van-nav-bar class="page-nav-bar" title="视频" />
    <div class="content">
      <van-cell v-for="(item, index) in imageList" :key="index" border>
        <img v-lazy="item" cover />
      </van-cell>
    </div>
  </div>
</template>

<script>
export default {
  // 组件名称
  name: 'videoIndex',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data() {
    return {
      imageList: [
        'https://img.yzcdn.cn/vant/apple-1.jpg',
        'https://img.yzcdn.cn/vant/apple-2.jpg',
        'https://img.yzcdn.cn/vant/apple-1.jpg',
        'https://img.yzcdn.cn/vant/apple-2.jpg',
        'https://img.yzcdn.cn/vant/apple-1.jpg',
        'https://img.yzcdn.cn/vant/apple-2.jpg',
        'https://img.yzcdn.cn/vant/apple-1.jpg',
        'https://img.yzcdn.cn/vant/apple-2.jpg',
        'https://img.yzcdn.cn/vant/apple-1.jpg',
        'https://img.yzcdn.cn/vant/apple-2.jpg',
        'https://img.yzcdn.cn/vant/apple-1.jpg',
        'https://img.yzcdn.cn/vant/apple-2.jpg',
        'https://img.yzcdn.cn/vant/apple-1.jpg',
        'https://img.yzcdn.cn/vant/apple-2.jpg'
      ]
    }
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
.video-container {
  .page-nav-bar {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
  }
  .content {
    width: 100vw;
    box-sizing: border-box;
    margin-top: 92px;
    margin-bottom: 100px;
    padding: 20px;
    .van-cell {
      border: 30px solid #fff;
      border-radius: 100px;
      // box-sizing: border-box;
      margin: 20px 0;
    }
  }
  img {
    width: 100%;
  }
}
</style>
