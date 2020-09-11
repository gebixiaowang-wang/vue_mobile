<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      @click-left="$router.go(-1)"
      left-arrow
      title="黑马头条"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="loading">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div class="article-detail" v-else-if="articleData.title">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ articleData.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="articleData.aut_photo"
          />
          <div slot="title" class="user-name">{{ articleData.aut_name }}</div>
          <div slot="label" class="publish-date">
            {{ articleData.pubdate | dateFormat }}
          </div>

          <!-- 关注按钮 -->
          <!-- 当我们传递给子组件的数据既要使用还要修改 -->
          <!-- 传递:props   修改:自定义事件 -->
          <!-- :is-followed="articleData.is_followed" -->
          <!-- @updata-is_followed="updataFollowed" -->
          <!-- 简写方式 在组件上使用v-model -->
          <follow-user
            :is-followed="articleData.is_followed"
            :user-id="articleData.aut_id"
            @updata-is_followed="updataFollowed"
          ></follow-user>
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          class="article-content markdown-body"
          v-html="articleData.content"
          ref="articleContent"
        ></div>
        <van-divider>正文结束</van-divider>
        <!-- 文章评论列表 -->
        <comment-list
          :source="articleData.art_id"
          @comment-data="commentTotal = $event.total_count"
          :list="commentList"
          @reply-click="replyClick"
        ></comment-list>
        <!-- 底部区域 文章渲染完成后才能显示出来 所以放到文章正文最后 -->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="commentShow = true"
            >写评论</van-button
          >
          <van-icon name="comment-o" :info="commentTotal" color="#777" />
          <!-- <van-icon color="#777" name="star-o" /> -->
          <!-- 文章收藏组件 -->
          <collect-article
            v-model="articleData.is_collected"
            :article-id="articleData.art_id"
          ></collect-article>
          <!-- 文章点赞组件 -->
          <like-article
            v-model="articleData.attitude"
            :article-id="articleData.art_id"
          ></like-article>
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
        <!-- 评论弹出框 -->
        <van-popup v-model="commentShow" position="bottom">
          <comment-post
            :target="articleData.art_id"
            @post-success="postSuccess"
          ></comment-post>
        </van-popup>
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="errStatus === 404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="getArticleData"
          >点击重试</van-button
        >
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>

    <!-- 评论回复 -->
    <!-- 弹出层使用的是懒渲染 渲染一次数据后之后再次打开还是原来的数据 -->
    <!-- v-if绑定弹出层的变量到组件上 关闭弹出层就会销毁组件  打开弹出层重新渲染  -->
    <van-popup v-model="replyShow" position="bottom" style="height:100%">
      <comment-reply
        v-if="replyShow"
        :comment="currentComment"
        @reply-close="replyShow = false"
      ></comment-reply>
    </van-popup>
  </div>
</template>

<script>
import request from '@/utils/request'
import { ImagePreview } from 'vant'
import followUser from '@/components/follow-user'
import collectArticle from '@/components/collect-article'
import likeArticle from '@/components/like-article'
import commentList from './components/comment-list'
import commentPost from './components/comment-post'
import commentReply from './components/comment-reply'
export default {
  // 组件名称
  name: 'articleIndex',
  // 局部注册的组件
  components: {
    followUser,
    collectArticle,
    likeArticle,
    commentList,
    commentPost,
    commentReply
  },
  //   给后代组件传递数据方法 在任何后代组件中 都可以使用inject接收
  provide: function() {
    return {
      articleId: this.articleId
    }
  },
  // 组件参数 接收来自父组件的数据
  props: {
    articleId: {
      type: [String, Number, Object],
      required: true
    }
  },
  // 组件状态值
  data() {
    return {
      articleData: {},
      loading: true, //加载中的loading状态
      errStatus: 0, //失败的状态码
      followLoading: false, //关注按钮loading状态
      commentTotal: 0,
      commentShow: false, //控制评论框显示隐藏
      commentList: [], //当作评论传递给子组件 方便父组件添加评论
      replyShow: false, //回复弹出框显示隐藏
      currentComment: {} //当前点击回复的评论项
    }
  },
  // 组件方法
  methods: {
    async getArticleData() {
      this.loading = true
      try {
        //   我们现在的articleid是对象 但是跟字符串拼接之后就自动转换为了字符串
        const { data: res } = await request.get(
          `/app/v1_0/articles/${this.articleId}`
        )
        // 模拟刷新失败
        // if (Math.random() > 0.5) {
        //   JSON.parse('asdasd')
        // }
        this.articleData = res.data

        // 请求获取成功后 获取文章内容的图片数据
        // 数据驱动视图这件事不是立即的 所以延时一下获取
        // 箭头函数指向的是父级的this
        setTimeout(() => {
          this.previewImage()
        }, 1)

        // 请求成功关闭loading
        this.loading = false
        console.log(this.articleData)
      } catch (err) {
        // 加载失败页关闭loading
        if (err.response && err.response.status === 404) {
          this.errStatus = 404
        }
        this.loading = false
        this.$toast('获取数据失败')
      }
    },
    // 图片预览事件
    previewImage() {
      // 获取所有的img节点
      const imgs = this.$refs.articleContent.querySelectorAll('img')
      const images = []
      //   遍历图片数组 把地址push到images数组中
      imgs.forEach((img, index) => {
        images.push(img.src)
        // 给每个img标签添加点击事件
        img.onclick = () => {
          // 点击图片后 使用vant的预览图片组件 创建弹出层
          ImagePreview({
            images,
            startPosition: index //点击图片后显示第几张图片
          })
        }
      })
    },
    // 更新关注状态  val是子组件传递过来的数据
    updataFollowed(val) {
      this.articleData.is_followed = val
    },
    // 评论发布成功事件 接收子组件传递过来的参数
    postSuccess(data) {
      // 隐藏弹出框
      this.commentShow = false
      //   在父组件修改对象 子组件会有响应式
      this.commentList.unshift(data.new_obj)
    },
    // 点击评论中的回复 事件 孙子组件传递过来的数据
    replyClick(comment) {
      // 显示弹出框
      this.replyShow = true
      //   把孙子组件传递过来的评论对象赋值
      this.currentComment = comment
      console.log(this.currentComment)
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
    // 可以获取路由中的参数
    // console.log(this.$route.params)
    // 获取文章数据
    this.getArticleData()
  },
  /**
   * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
   */
  mounted() {}
}
</script>

<style scoped lang="less">
@import './github-markdown.css';
.article-container {
  .page-nav-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  }
  .main-wrap {
    // position: fixed;
    // left: 0;
    // right: 0;
    // top: 92px;
    // bottom: 88px;
    margin-top: 92px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    // z-index: 1000;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    /deep/.van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
