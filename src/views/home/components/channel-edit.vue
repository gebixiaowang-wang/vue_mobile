<template>
  <div class="channel-edit">
    <!-- 第一行放置一个单元行 -->
    <van-cell>
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        type="danger"
        round
        plain
        size="mini"
        class="edit-btn"
        @click="isEdit = !isEdit"
      >
        {{ isEdit ? '完成' : '编辑' }}
      </van-button>
    </van-cell>
    <!-- 单元格区域 -->
    <van-grid class="my-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(item, index) in channelList"
        :key="index"
        @click="channelClick(item, index)"
      >
        <!-- 查看固定频道数组中有没有该频道的id有的话就取反false不显示 -->
        <van-icon
          name="clear"
          slot="icon"
          v-show="isEdit && !fixChannel.includes(item.id)"
        ></van-icon>
        <span slot="text" :class="{ active: index === active }" class="text">{{
          item.name
        }}</span>
      </van-grid-item>
    </van-grid>
    <van-cell>
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-empty
      v-if="recommendChannel.length === 0"
      description="您已添加所有频道"
    />
    <!-- 单元格区域 -->
    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(item, index) in recommendChannel"
        :key="index"
        :text="item.name"
        icon="add"
        @click="addChannel(item)"
      />
    </van-grid>
  </div>
</template>

<script>
import request from '@/utils/request'
// 导入全局数据 vuex
import { mapState } from 'vuex'
// 导入自定义本地储存方法
import { setItem } from '@/utils/storage'
export default {
  // 组件名称
  name: 'channelEdit',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    channelList: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  // 组件状态值
  data() {
    return {
      // 所有频道数据
      allChannel: [],
      isEdit: false, //控制删除按钮显示隐藏
      fixChannel: [0] //固定频道 不允许删除
    }
  },
  // 组件方法
  methods: {
    async getAllChannel() {
      try {
        const { data: res } = await request.get(`/app/v1_0/channels`)
        this.allChannel = res.data.channels
        console.log(this.allChannel)
      } catch (err) {
        this.$toast('数据获取失败')
      }
    },
    // 添加频道事件
    async addChannel(channel) {
      // 判断用户是否登录 未登录把用户频道储存到本地
      if (this.user) {
        //  登录状态
        try {
          const res = await request.patch('/app/v1_0/user/channels', {
            channels: [
              {
                id: channel.id,
                seq: this.channelList.length
              }
            ]
          })
          this.channelList.push(channel)
        } catch (err) {
          this.$toast('添加失败')
        }
      } else {
        //  未登录状态
        this.channelList.push(channel)
        setItem('channels', this.channelList)
      }
    },
    // 点击频道按钮事件
    channelClick(channel, index) {
      // console.log(channel, index)

      if (this.isEdit) {
        // 如果点击的是固定的频道不能删除
        if (this.fixChannel.includes(channel.id)) {
          return this.$toast(channel.name + '不允许被删除')
        }
        // 如果当前删除的频道在激活的频道前边就会影响激活的频道下标
        if (index <= this.active) {
          // 子组件不能修改父组件的参数 所以还触发事件
          this.$emit('updata-active', this.active - 1, true)
        }
        // 执行删除频道事件
        this.deleteChannel(channel)
        // 编辑状态 删除频道
        this.channelList.splice(index, 1)
      } else {
        // 判断如果是非编辑状态 切换频道
        // 子组件不能操作父组件的数据 数以发布一个自定义事件 让父组件监听
        this.$emit('updata-active', index, false)
      }
    },
    // 删除频道事件
    async deleteChannel(channel) {
      if (this.user) {
        // 登录状态 数据更新到线上
        try {
          const res = await request.delete(
            `/app/v1_0/user/channels/${channel.id}`
          )
        } catch (err) {
          this.$toast('删除失败')
        }
      } else {
        // 未登录 本地数据重新存储 更新覆盖数据
        setItem('channels', this.channelList)
      }
    }
  },
  // 计算属性
  computed: {
    //   推荐频道
    recommendChannel() {
      const channels = []
      //   遍历全部频道
      this.allChannel.forEach(channel => {
        //   当前遍历的这个频道如果已经有了就不做操作
        const ret = this.channelList.find(myChannel => {
          return myChannel.id === channel.id
        })
        // 如果当前遍历的这个频道在我的频道中没有的话 就收集到推荐频道中
        if (!ret) {
          channels.push(channel)
        }
      })
      // 把计算结果返回
      return channels
      // return [
      //   { id: 50, name: '茶杯' },
      //   { id: 51, name: '绿茶' },
      //   { id: 52, name: '充电器' },
      //   { id: 53, name: '纸巾' }
      // ]
    },
    ...mapState(['user'])
  },
  // 侦听器
  watch: {},
  // 生命周期钩子   注：没用到的钩子请自行删除
  /**
   * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
   */
  created() {
    this.getAllChannel()
  },
  /**
   * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
   */
  mounted() {}
}
</script>

<style scoped lang="less">
.channel-edit {
  padding-top: 85px;
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
  }
  .title-text {
    font-size: 32px;
    color: #333;
  }
  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      font-weight: 500;
      white-space: nowrap; //内容不能折行
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
    }
  }
  /deep/ .my-grid {
    .van-grid-item__icon-wrapper {
      position: static;
    }
    .van-icon {
      position: absolute;
      top: -15px;
      right: -15px;
      font-size: 30px;
      color: #ccc;
      z-index: 2;
    }
  }
  /deep/ .recommend-grid {
    .van-grid-item__icon {
      position: absolute;
      top: -15px;
      right: -15px;
      font-size: 30px;
      color: green;
      z-index: 2;
    }
  }
  /deep/ .van-empty {
    padding: 32px 0;
    .van-empty__image {
      width: 160px;
      height: 160px;
    }
  }
}
</style>
