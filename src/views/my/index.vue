<template>
  <div class="my-container">
    <!-- 已登陆的头部 -->
    <div v-if="user" class="header user-info">
      <div class="base-info">
        <div class="left">
          <!-- vant中的img图片组件 -->
          <van-image class="avatar" :src="userInfo.photo" round fit="cover" />
          <span class="name">{{ userInfo.name }}</span>
        </div>
        <div class="right">
          <van-button size="mini" round to="/user/profile">编辑资料</van-button>
        </div>
      </div>
      <!-- 数据显示区域 -->
      <div class="data-stats">
        <div class="data-item" @click="$router.push('/myArticle')">
          <span class="count">{{ userInfo.art_count }}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item" @click="$router.push('/follow')">
          <span class="count">{{ userInfo.follow_count }}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item" @click="$router.push('/follow')">
          <span class="count">{{ userInfo.fans_count }}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.like_count }}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <!-- 未登录的头部 -->
    <div v-else class="header login">
      <div class="login-btn" @click="$router.push('/login')">
        <img class="avatar" src="~@/assets/mobile.png" alt="" />
        <span>登录/注册</span>
      </div>
    </div>
    <!-- 宫格区域 -->
    <van-grid column-num="2" clickable>
      <van-grid-item
        class="grid-nav"
        icon="photo-o"
        text="文字"
        @click="$router.push('/collect')"
      >
        <i slot="icon" class="iconfont icon-shoucang"></i>
        <span slot="text" class="text">收藏</span>
      </van-grid-item>
      <van-grid-item
        class="grid-nav"
        icon="photo-o"
        text="文字"
        @click="$router.push('/history')"
      >
        <i slot="icon" class="iconfont icon-lishi"></i>
        <span slot="text" class="text">历史</span>
      </van-grid-item>
    </van-grid>

    <!-- 单元格区域 -->
    <div class="option">
      <van-cell value="消息通知" is-link />
      <van-cell value="小志同学" is-link />
    </div>
    <div class="quie">
      <van-button v-if="user" class="quie" block round @click="quie">
        退出登录
      </van-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// 导入创建的axios实例
import request from '@/utils/request'
export default {
  // 组件名称
  name: 'myIndex',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data() {
    return {
      // 用户数据对象
      userInfo: {}
    }
  },
  // 组件方法
  methods: {
    // 点击退出登录按钮事件
    async quie() {
      try {
        // 弹出窗口 选择是否退出  返回的是一个promise对象
        await this.$dialog.confirm({
          title: '确认退出吗?'
        })
        // 用户点击确定后执行这里的代码
        // 调用vuex中的方法就可以重新给user和本地储存重新赋值
        this.$store.commit('setUser', null)
      } catch (err) {
        // 捕获错误执行这里的代码
        return
      }
    },
    // 获取用户数据
    async getUserInfo() {
      try {
        const { data: res } = await request.get('app/v1_0/user')
        this.userInfo = res.data
        console.log(this.userInfo)
      } catch (err) {
        // 捕获错误
        console.dir(err)
      }
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
    // 如果用户登录了 就加载用户的信息
    if (this.user) {
      this.getUserInfo()
    }
  },
  /**
   * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
   */
  mounted() {}
}
</script>

<style scoped lang="less">
.my-container {
  .header {
    height: 361px;
    background-color: pink;
    background: url('~@/assets/banner.png');
    background-size: cover;
  }
  .login {
    display: flex; //使用弹性布局使盒子居中显示
    justify-content: center;
    align-items: center;
    .login-btn {
      display: flex; //使用弹性布局使盒子居中显示
      justify-content: center;
      align-content: center;
      flex-direction: column; //使盒子中的内容纵向排列
      img {
        display: block;
        width: 132px;
        margin-bottom: 15px;
      }
      span {
        font-size: 28px;
        color: #fff;
      }
    }
  }
  .base-info {
    height: 231px;
    padding: 76px 32px 23px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      display: flex;
      align-items: center;
      .avatar {
        width: 132px;
        height: 132px;
        border: 4px solid #fff;
        margin-right: 23px;
      }
      .name {
        font-size: 30px;
        color: #fff;
      }
    }
    .right {
      .van-button--round {
        padding: 15px;
      }
    }
  }
  .data-stats {
    display: flex;
    .data-item {
      height: 130px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #fff;
      .count {
        font-size: 36px;
      }
      .text {
        font-size: 23px;
      }
    }
  }
  .grid-nav {
    height: 141px;
    i.iconfont {
      font-size: 45px;
    }
    .icon-shoucang {
      color: #eb5253;
    }
    .icon-lishi {
      color: #ff9d1d;
    }
    span.text {
      font-size: 28px;
    }
  }
  .option {
    margin-top: 20px;
  }
  .quie {
    padding: 0 40px;
    margin-top: 20px;
    color: #eb5253;
  }
}
</style>
