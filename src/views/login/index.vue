<template>
  <div class="container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="登录"
      @click-left="$router.go(-1)"
    />
    <!-- 表单 -->
    <van-form @submit="onSubmit" ref="loginForm">
      <van-field
        v-model="user.mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="userFormRulse.mobile"
        type="number"
        maxlength="11"
      >
        <!-- 使用vant中的插槽处理自定义图标 -->
        <i slot="left-icon" class="iconfont icon-shouji"></i>
      </van-field>
      <van-field
        v-model="user.code"
        name="code"
        placeholder="请输入验证码"
        :rules="userFormRulse.code"
        type="number"
        maxlength="6"
      >
        <!-- 使用vant中的插槽处理自定义图标 -->
        <i slot="left-icon" class="iconfont icon-yanzhengma"></i>
        <!-- 新版插槽的写法 -->
        <template #button>
          <van-button
            v-if="isCountDownShow"
            class="send-sms-btn"
            native-type="button"
            size="small"
            round
            disabled
          >
            <van-count-down
              :time="1000 * 60"
              format="ss s"
              @finish="isCountDownShow = false"
            />
            后
          </van-button>
          <van-button
            v-else
            class="send-sms-btn"
            native-type="button"
            size="small"
            round
            @click="onSendSms"
          >
            发送验证码
          </van-button>
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" block type="info" native-type="submit">
          登录
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  // 组件名称
  name: '',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data() {
    return {
      // 用户登录表单对象
      user: {
        mobile: '17606720821',
        code: '246810'
      },
      // 登录表单验证规则
      userFormRulse: {
        mobile: [
          { required: true, message: '手机号不能为空' },
          { pattern: /^1[3|5|7|8]\d{9}$/, message: '手机号格式错误' }
        ],
        code: [
          { required: true, message: '验证码不能为空' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }
        ]
      },
      isCountDownShow: false
    }
  },
  // 组件方法
  methods: {
    async onSubmit() {
      // 获取表单数据
      const user = this.user
      // 表单验证
      // 提交表单请求登录
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true,
        duration: 0
      })
      try {
        const { data: res } = await request.post(
          '/app/v1_0/authorizations',
          user
        )
        this.$store.commit('setUser', res.data)
        this.$toast.success('登陆成功')
        this.$router.go(-1)
      } catch (err) {
        console.dir(err)
        if (err.response.status === 400) {
          this.$toast.fail('手机号或验证码错误')
        } else {
          this.$toast.fail('登陆失败,请稍后重试')
        }
      }
      // 根据请求响应结果处理后续操作
    },
    // 发送验证码事件
    async onSendSms() {
      // 校验手机号
      try {
        await this.$refs.loginForm.validate('mobile')
        console.log('验证通过')
      } catch (err) {
        return console.log('验证失败', err)
      }

      try {
        await request.get(`app/v1_0/sms/codes/${this.user.mobile}`)
        this.$toast('发送成功')
        // 显示倒计时
        this.isCountDownShow = true
      } catch (err) {
        // 发送失败关闭倒计时
        // this.isCountDownShow = false
        console.dir(err)
        if (err.response.status === 429) {
          this.$toast('发送太频繁,请稍后重试')
        } else {
          this.$toast('发送失败')
        }
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
.container {
  .iconfont {
    font-size: 37px;
  }
  .send-sms-btn {
    padding: 0;
    width: 152px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: 0;
    }
  }
}
.van-count-down {
  display: inline-block;
}
</style>
