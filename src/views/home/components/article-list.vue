<template>
  <div class="article-list">
    <!-- 
    List 组件通过 loading 和 finished 两个变量控制加载状态，
    当组件初始化或滚动到到底部时，会触发 load 事件并将 loading 设置成 true，此时可以发起异步操作并更新数据，数据更新完毕后，将 loading 设置成 false 即可。
    若数据已全部加载完毕，则直接将 finished 设置成 true 即可。
    load 事件：
  - List 初始化后会触发一次 load 事件，用于加载第一屏的数据。
  - 如果一次请求加载的数据条数较少，导致列表内容无法铺满当前屏幕，List 会继续触发 load 事件，直到内容铺满屏幕或数据全部加载完成。
    loading 属性：控制加载中的 loading 状态
  - 非加载中，loading 为 false，此时会根据列表滚动位置判断是否触发 load 事件（列表内容不足一屏幕时，会直接触发）
  - 加载中，loading 为 true，表示正在发送异步请求，此时不会触发 load 事件
    finished 属性：控制加载结束的状态
  - 在每次请求完毕后，需要手动将 loading 设置为 false，表示本次加载结束
  - 所有数据加载结束，finished 为 true，此时不会触发 load 事件
       -->
    <van-pull-refresh
      v-model="isreFreshLoading"
      :success-text="refreshSuccessText"
      :success-duration="1500"
      @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <article-item
          v-for="(article, index) in list"
          :key="index"
          :article="article"
        />
        <!-- <van-cell
          v-for="(article, index) in list"
          :key="index"
          :title="article.title"
        /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'
export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      list: [], // 文章列表数据
      loading: false, // 上拉加载更多的 loading 状态
      finished: false, // 是否加载结束
      error: false, // 是否加载失败
      timestamp: null, // 请求下一页数据的时间戳
      isreFreshLoading: false, // 控制下拉刷新loading状态
      refreshSuccessText: '刷新成功'
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  // 初始化或滚动到底部的时候会触发调用 onLoad
  methods: {
    async onLoad() {
      // console.log('onLoad')
      try {
        // 1.请求获取数据

        const { data } = await getArticles({
          channel_id: this.channel.id, //频道ID
          // timestamp 简单理解就是请求数据的页码
          // 请求第一页数据：当前最新时间戳
          // 用于请求之后数据的时间戳会在当前请求结果中返回给你
          timestamp: this.timestamp || Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        })
        // debugger
        // console.log(data)
        // 2.把请求数据结果放到 list 数组中
        const { results } = data.data
        // 数组的展开操作符，它会把数组元素一 个一 个拿出来
        // 取出运算符:对象，数组
        // ...这三个点如果是在函数参数上的(... largs),这个是收集参数，args是一个数组
        // 单纯的 function 里面，是由 arguments -> 类数组,
        // 如果是箭头函数的话，函数里面没有 arguments, (...args) => {sonsole.log(args) }
        // 没有 this 的，会向最近的父级作用域查找 this 指向
        // 函数的长度，就是参数的个数
        this.list.push(...results)
        // 3.本次数据加载结束之后要把加载状态设置为结束
        this.loading = false
        // loading 关闭以后才能触发下一次的加载更多
        // 4. 判断数据是否全部加载完成，特定的一个标识符
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 没有数据了，设置加载状态结束，不再触发上拉加载更多了
          this.finished = true
        }
        // 如果没有数据了，把 finished 设置为 true ,之后不再触发加载更多
      } catch (err) {
        // console.log('请求失败', err)
        this.loading = false // 关闭 loading 效果
        this.error = true // 开启错误提示
      }
    },
    // 下拉刷新的时候会触发调用该函数
    async onRefresh() {
      try {
        // 1.请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: Date.now(), // 下拉刷新，每次请求获取最新数据
          with_top: 1
        })

        // 模拟随机失败的情况
        // if (Math.random() > 0.2) {
        //   JSON.parse('dsnajndjsa')
        // }

        // 2.将数据放到列表顶部
        const { results } = data.data
        this.list.unshift(...results)

        // 3.关闭下拉属性的loading状态
        this.isreFreshLoading = false

        // 更新下拉刷新成功提示的文本
        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
      } catch (err) {
        // console.log('请求失败', err)
        this.refreshSuccessText = '刷新失败,请稍后再试'
        this.isreFreshLoading = false
      }
    }
  }
}
</script>

<style scoped lang="less">
.article-list {
  //百分比单位是相对于父元素的   em也是相对于父元素 /rem 相对于整个html的fontsize
  // height: 100号;
  // viewport 就是:视口
  // vh: viewport -heigth 1vh就是整个视C高的百分之一
  // ww: viewport-width 1vw就是整个视口高的百分之一
  //视口(在移动端是布局视口)单位: ww和vh,不受父元素影响 (相对于整个视口)
  // 1vw =视口宽度的百分之一
  // 1vh =视口高度的百分之一
  height: 79vh;
  overflow-y: auto;
}
</style>
