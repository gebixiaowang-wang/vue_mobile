<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar fixed class="page-nav-bar">
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        icon="search"
        round
        to="/search"
      >
        搜索
      </van-button>
    </van-nav-bar>
    <!-- 标签页 -->
    <!-- 通过animated可以开启转场动画效果 -->
    <van-tabs class="tabs" v-model="active" animated swipeable>
      <van-tab :title="item.name" v-for="item in channelList" :key="item.id">
        <!-- 文章列表组件 -->
        <article-list :channel="item"></article-list>
      </van-tab>
      <div slot="nav-right" class="placeholder"></div>
      <div slot="nav-right" class="hanb-btn" @click="editShow = true">
        <i class="iconfont icon-gengduo"></i>
      </div>
    </van-tabs>
    <!-- 频道编辑弹出层 -->
    <van-popup
      v-model="editShow"
      closeable
      position="bottom"
      close-icon-position="top-left"
      :style="{ height: '100%' }"
    >
      <channel-edit
        :channelList="channelList"
        :active="active"
        @updata-active="updataActive"
      ></channel-edit>
    </van-popup>
  </div>
</template>

<script>
import request from '@/utils/request'
// 把子组件加载进来 文章列表
import articleList from './components/article-list'
import channelEdit from './components/channel-edit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'

export default {
  // 组件名称
  name: 'homeIndex',
  // 局部注册的组件
  components: {
    // 注册子组件
    articleList,
    channelEdit
  },
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data() {
    return {
      active: 0,
      // 用户频道列表数据
      channelList: [],
      editShow: false //控制编辑频道弹出层显示状态
    }
  },
  // 组件方法
  methods: {
    // 获取用户频道列表
    async getUserChannelList() {
      // 判断用户是否登录,
      if (this.user) {
        // 登录获取用户的频道列表
        try {
          const { data: res } = await request.get(`/app/v1_0/user/channels`)
          this.channelList = res.data.channels
        } catch (err) {
          this.$toast('获取频道列表失败')
        }
      } else {
        // 没有登录获取本地频道列表
        const channelData = getItem('channels')
        // 判断本地是否有数据 有的话就复制没有的话就获取默认的频道数据
        if (channelData) {
          this.channelList = channelData
        } else {
          // 登录状态获取的是用户的频道数据 未登录状态获取默认的频道数据
          try {
            const { data: res } = await request.get(`/app/v1_0/user/channels`)
            this.channelList = res.data.channels
          } catch (err) {
            this.$toast('获取频道列表失败')
          }
        }
      }
    },
    // 监听子组件的事件 触发这个事件 更改当前显示频道 接收子组件的实参 频道的下标
    updataActive(index, isEditShow = true) {
      // 关闭频道弹出层
      this.editShow = isEditShow
      this.active = index
    }
  },
  // 计算属性
  computed: {
    ...mapState(['user'])
  },
  // 侦听器
  watch: {},
  // 生命周期钩子   注：没用到的钩子请自行删除
  /**
   * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
   */
  created() {
    // 创建页面的时候获取用户的频道
    this.getUserChannelList()
  },
  /**
   * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
   */
  mounted() {}
}
</script>

<style scoped lang="less">
.home-container {
  padding-top: 174px;
  /deep/.van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: node;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }
  /deep/ .tabs {
    .van-tabs__wrap {
      height: 82px;
      position: fixed;
      top: 92px;
      left: 0;
      right: 0;
      z-index: 1;
    }
    .van-tabs__nav {
      padding-bottom: 0; //清除掉底padding
    }
    .van-tab {
      min-width: 200px;
      border-right: 1px solid #edeff3;
      font-size: 30px;
      color: #777;
    }
    //当前激活的标签页颜色
    .van-tab--active {
      color: #333;
    }
    // 激活标签页的下标
    .van-tabs__line {
      width: 50px;
      height: 6px;
      background-color: #3296fa;
      bottom: 8px;
    }
    .placeholder {
      width: 66px;
      height: 82px;
      flex-shrink: 0; //不参与flex计算
    }
    .hanb-btn {
      position: fixed;
      right: 0;
      width: 66px;
      height: 82px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      opacity: 0.8;
      i.iconfont {
        font-size: 33px;
        font-weight: 700;
      }
      &:before {
        position: absolute;
        left: 0;
        content: '';
        width: 1px; //手机上能显示出来
        height: 100%;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
    .hanb-btn:hover {
      background-color: #ccc;
    }
  }
}
</style>
