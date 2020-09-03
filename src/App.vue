<template>
  <div id="app">
    <i class="iconfont icon-yanzhengma"></i>
    <i class="iconfont icon-yuedu"></i>
    <i class="iconfont icon-shipin"></i>
    <i class="iconfont icon-dianzan"></i>
    <van-button round type="info">圆形按钮</van-button>
    <van-cell-group>
      <van-cell title="单元格" value="内容" />
      <van-cell title="单元格" value="内容" label="描述信息" />
    </van-cell-group>
    <!-- 路由占位符 -->
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'App',
  methods: {
    get() {
      console.log(1)
    }
  }
}
</script>
<style lang="less">
.iconfont {
  font-size: 80px !important;
  margin: 20px;
  font-weight: 500;
  color: #fff;
}
</style>
