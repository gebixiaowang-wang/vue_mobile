<template>
  <div class="follow-list">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      :title="`粉丝${this.total ? this.total : ''}`"
      left-arrow
      @click-left="$router.back()"
    />
    <van-empty
      v-if="followList.length === 0"
      description="啥?一个fans都没有?"
    />
    <van-list
      v-else
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      offset="1"
    >
      <van-cell
        class="user-info"
        v-for="(item, index) in followList"
        :key="index"
      >
        <van-image
          slot="icon"
          class="avatar"
          round
          :src="item.photo"
          fit="cover"
        />
        <div slot="title" class="user-name">{{ item.name }}</div>
        <div slot="label" class="publish-date">
          粉丝数: {{ item.fans_count === 0 ? '0' : item.fans_count }}
        </div>
        <follow-user
          :isFollowed="item.mutual_follow"
          :userId="item.id"
          @updata-is_followed="item.mutual_follow = $event"
        ></follow-user>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
import request from '@/utils/request'
import followUser from '@/components/follow-user'
export default {
  // 组件名称
  name: 'followList',
  // 局部注册的组件
  components: {
    followUser
  },
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data() {
    return {
      followList: [], //粉丝数据
      total: null,
      finished: false,
      nextPage: 1,
      loading: false
    }
  },
  // 组件方法
  methods: {
    // 获取用户粉丝列表
    async onLoad() {
      try {
        const { data: res } = await request.get(`/app/v1_0/user/followers`, {
          params: {
            page: this.nextPage,
            per_page: 10
          }
        })
        // 如果获取的数据为0就完成加载
        if (res.data.results.length === 0) {
          this.finished = true
        }
        // 下一页的数据++
        this.nextPage++
        this.followList.push(...res.data.results)
        this.total = res.data.total_count

        // console.log(this.followList)
      } catch (err) {
        this.$toast('获取粉丝列表失败')
      }
      this.loading = false
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
    this.onLoad()
  },
  /**
   * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
   */
  mounted() {}
}
</script>

<style scoped lang="less">
.follow-list {
  .avatar {
    width: 100px;
    height: 100px;
  }

  .user-info {
    padding: 20px 32px;
    .avatar {
      width: 100px;
      height: 100px;
      margin-right: 17px;
    }
    .van-cell__label {
      margin-top: 0;
    }
    .user-name {
      margin-top: 10px;
      font-size: 32px;
      color: #3a3a3a;
    }
    .publish-date {
      margin-top: 5px;
      font-size: 23px;
      color: #b7b7b7;
    }
    .follow-btn {
      width: 170px;
      height: 58px;
    }
    .van-cell__value {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
}
</style>
