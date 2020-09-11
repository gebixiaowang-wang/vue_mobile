<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="商品" />
    <div class="content">
      <van-swipe :autoplay="3000">
        <van-swipe-item v-for="(image, index) in images" :key="index">
          <van-image
            width="100%"
            height="100%"
            lazy-load
            :src="image"
            fit="cover"
          />
        </van-swipe-item>
      </van-swipe>
      <van-grid>
        <van-grid-item icon="photo-o" text="文字" />
        <van-grid-item icon="photo-o" text="文字" />
        <van-grid-item icon="photo-o" text="文字" />
        <van-grid-item icon="photo-o" text="文字" />
      </van-grid>
      <!-- 商品 -->
      <van-card
        num="2"
        price="2.00"
        desc="描述信息"
        title="商品标题"
        thumb="https://img.yzcdn.cn/vant/ipad.jpeg"
      />
    </div>
    <div class="card ">
      <van-icon name="shopping-cart-o" :badge="9" />
    </div>
  </div>
</template>

<script>
export default {
  // 组件名称
  name: 'qaIndex',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data() {
    return {
      images: [
        'https://img.yzcdn.cn/vant/apple-1.jpg',
        'https://img.yzcdn.cn/vant/apple-2.jpg',
        'https://img.yzcdn.cn/vant/apple-4.jpg',
        'https://img.yzcdn.cn/vant/apple-1.jpg'
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
.home-container {
  height: 86vh;
  overflow-y: auto;
  .content {
    margin-top: 92px;
    .van-swipe {
      height: 550px;
      .van-swipe-item {
        img {
          width: 100%;
        }
      }
    }
  }

  .page-nav-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  }
}
.card {
  // border-radius: 50%;
  // border: 2px solid #000;
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 180px;
  right: 50px;
  .van-icon {
    margin-top: 10px;
    font-size: 50px;
  }
}
</style>
