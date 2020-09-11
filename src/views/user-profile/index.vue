<template>
  <div class="user-profile">
    <!-- 导航栏组件 -->
    <van-nav-bar
      title="个人信息"
      class="page-nav-bar"
      left-arrow
      @click-left="$router.back()"
      v
    />
    <!-- 个人信息区域 -->
    <!-- 点击头像cell触发文件选择框的点击事件 -->
    <van-cell
      title="头像"
      is-link
      class="img-box"
      @click="$refs.fileRef.click()"
    >
      <van-image class="avatar" fit="cover" :src="user.photo" round />
    </van-cell>
    <van-cell title="昵称" is-link @click="nameInput = true">
      <span class="userName" v-if="!nameInput">{{ user.name }}</span>
      <div class="name-box" v-else>
        <van-field
          class="name-input"
          v-model.trim="nameValue"
          placeholder="请输入新昵称"
          :rules="nameRules"
          maxlength="6"
        >
        </van-field>
        <van-button size="mini" type="primary" @click.stop="editName"
          >确定</van-button
        >
        <van-button size="mini" type="danger" @click.stop="nameInput = false"
          >取消</van-button
        >
      </div>
    </van-cell>
    <van-cell
      title="性别"
      :value="user.gender === 0 ? '男' : '女'"
      is-link
      @click="genderShow = true"
    ></van-cell>
    <van-cell
      title="生日"
      :value="user.birthday"
      is-link
      @click="birthdayShow = true"
    ></van-cell>
    <!-- 性别选择弹框 -->
    <van-popup v-model="genderShow" position="bottom">
      <van-picker
        :default-index="user.gender"
        title="选择性别"
        show-toolbar
        :columns="selectList"
        @confirm="onConfirm"
        @cancel="genderShow = false"
        visible-item-count="3"
      />
    </van-popup>
    <!-- 生日弹层 -->
    <van-popup v-model="birthdayShow" position="bottom">
      <van-datetime-picker
        v-if="birthdayShow"
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="birthdayShow = false"
        @confirm="editBirthday"
      />
    </van-popup>
    <!-- 选择头像 文件选择框 默认隐藏 -->
    <input
      type="file"
      hidden
      ref="fileRef"
      @change="fileChange"
      accept="image/png,image/gif,image/jpeg"
    />
    <!-- 编辑图片弹出层 -->
    <van-popup
      v-model="avatarShow"
      position="bottom"
      style="height:100%"
      close-icon-position="top-left"
      closeable
    >
      <div class="updata-avatar" v-if="avatarShow">
        <img :src="editAvatarPath" alt="" ref="imgRef" />
        <div class="footer">
          <div class="cancel" @click="avatarShow = false">取消</div>
          <div class="confirm" @click="editAvatar">完成</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import request from '@/utils/request'
import dayjs from 'dayjs'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
export default {
  // 组件名称
  name: 'userProfile',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data() {
    return {
      // 用户资料对象
      user: {},
      nameValue: '', //绑定昵称
      nameInput: false, //昵称输入框
      nameRules: [],
      genderShow: false, //控制性别弹层
      selectList: ['男', '女'],
      gender: null, //用户的性别
      birthdayShow: false, //控制生日弹层
      minDate: new Date(1970, 1, 1), //可选的最小日期
      maxDate: new Date(), //可选的最大日期
      currentDate: new Date(), //用户选择时间绑定
      avatarShow: false, //控制编辑图片弹出层的显示隐藏
      editAvatarPath: '', //要修改图片的地址
      cropper: null //插件实例对象
    }
  },
  // 组件方法
  methods: {
    async getUserProfile() {
      if (this.$store.state.user) {
        try {
          // 获取别人的需要传递target用户的id自己的不需要
          const { data: res } = await request.get(`/app/v1_0/user/profile`)
          //   赋值给对象
          this.user = res.data
          if (res.data.birthday !== '') {
            this.currentDate = new Date(res.data.birthday)
          }
          console.log(this.user)
        } catch (err) {
          this.$toast('资料获取失败')
        }
      } else {
        this.isLogin()
      }
    },
    // 修改昵称事件
    async editName() {
      if (this.nameValue.trim() === '') {
        return this.$toast('不能为空')
      }
      try {
        const { data: res } = await request.patch(`/app/v1_0/user/profile`, {
          name: this.nameValue
        })
        console.log(res)
        this.user.name = this.nameValue
      } catch (err) {
        this.$toast('修改失败')
      }
      this.nameInput = false
    },
    // 性别确定按钮事件
    async onConfirm(val, index) {
      //   对应 索引0为男 1 为女
      console.log(index)
      this.gender = index
      //   开启loading加载
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, //北京不能点击
        duration: 0 //一直转圈
      })
      try {
        const { data: res } = await request.patch(`/app/v1_0/user/profile`, {
          gender: index
        })
        // JSON.parse('afs')
        console.log(res)
        this.user.gender = index
        this.$toast.success('修改成功')
      } catch (err) {
        this.$toast.fail('修改失败')
      }
      this.genderShow = false
    },
    // 修改生日事件
    async editBirthday() {
      //   开启loading加载
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, //北京不能点击
        duration: 0 //一直转圈
      })
      try {
        const currentDate = dayjs(this.currentDate).format('YYYY-MM-DD')
        console.log(currentDate)
        const { data: res } = await request.patch(`/app/v1_0/user/profile`, {
          birthday: currentDate
        })
        // JSON.parse('afs')
        this.user.birthday = currentDate
        this.$toast.success('修改成功')
      } catch (err) {
        this.$toast.fail('修改失败')
      }
      this.birthdayShow = false
    },
    // 选择文件变化事件
    fileChange() {
      // 获取到上传的文件对象
      const file = this.$refs.fileRef.files[0]
      console.log(file)
      //   基于文章对象获取blob数据
      this.editAvatarPath = window.URL.createObjectURL(file)
      this.avatarShow = true
      //   如果选择了同一个文件不会触发change事件 就不会打开弹出框
      // 解决办法 每次使用完毕后清空value
      this.$refs.fileRef.value = ''
      setTimeout(() => {
        const image = this.$refs.imgRef
        this.cropper = new Cropper(image, {
          viewMode: 1, // 只能在裁剪的图片范围内移动
          dragMode: 'move', // 画布和图片都可以移动
          aspectRatio: 1, // 裁剪区默认正方形
          autoCropArea: 1, // 自动调整裁剪图片
          cropBoxMovable: false, // 禁止裁剪区移动
          cropBoxResizable: false, // 禁止裁剪区缩放
          background: false // 关闭默认背景
        })
      }, 0)
    },
    // 编辑头像完成事件
    editAvatar() {
      //   开启loading加载
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, //北京不能点击
        duration: 0 //一直转圈
      })
      // 如果是服务端裁切 就把裁切参数对象传递给后端
      //   console.log(this.cropper.getData())
      //   如果是客户端图片剪裁 使用这个方法 获取裁切的文件对象
      this.cropper.getCroppedCanvas().toBlob(async blob => {
        try {
          //   创建formdata对象
          const formData = new FormData()
          formData.append('photo', blob)
          const { data: res } = await request.patch(
            `/app/v1_0/user/photo`,
            formData
          )

          this.avatarShow = false
          this.user.photo = res.data.photo
          this.$toast.success('修改成功')
        } catch (err) {
          this.$toast.fail('修改失败')
        }
      })
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
  created() {
    this.getUserProfile()
  },
  /**
   * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
   */
  mounted() {}
}
</script>

<style scoped lang="less">
.user-profile {
  .img-box {
    padding: 10px 32px;
  }
  .van-cell {
    align-items: center;
  }
  .avatar {
    box-sizing: border-box;
    // padding-top: 5px;
    margin-top: 15px;
    width: 60px;
    height: 60px;
  }
  /deep/ .name-input {
    border: 1px solid #ccc;
    border-radius: 15px;
    padding: 0 10px;
    // .van-button{

    // }
  }
  .name-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .van-button {
      margin-left: 5px;
      min-width: 60px;
    }
  }

  .updata-avatar {
    height: 100%;
    background-color: #000;
    img {
      display: block;
      max-width: 100%;
    }
    .footer {
      position: fixed;
      left: 0;
      bottom: 0;
      right: 0;
      display: flex;
      justify-content: space-between;
      .cancel,
      .confirm {
        width: 90px;
        height: 90px;
        font-size: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
      }
    }
  }
}
</style>
