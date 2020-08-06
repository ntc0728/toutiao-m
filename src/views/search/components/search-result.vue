<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error="error"
      error-text="加载失败，请点击重试"
      @load="onLoad"
    >
      <van-cell
        v-for="(article, index) in list"
        :key="index"
        :title="article.title"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'
export default {
  name: 'SearchResult',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      list: [], // 文章列表数据
      loading: false, // 上拉加载更多的 loading 状态
      finished: false, // 是否加载结束
      page: 1,
      perPage: 20,
      error: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    async onLoad() {
      try {
        //1.请求获取数据
        const { data } = await getSearchResult({
          page: this.page, // 页码
          per_page: this.perPage, // 每页的大小
          q: this.searchText // 查询关键词
        })
        //2.将数据添加到数组列表中
        const { results } = data.data
        this.list.push(...results)
        //3.将本次加载中的 loading 关闭
        this.loading = false
        //4.判断是否还有数据
        if (results.length) {
          //  如果有，则更新获取下一个数据的页码
          this.page++
        } else {
          //  如果没有，则将加载状态 finished 设置为结束
          this.finished = true
        }
      } catch (err) {
        //展示加载失败的提示状态
        this.errot = true
        // 加载失败了 loading 也要关闭
        this.loading = false
        this.$toast('数据获取失败，请稍后重试')
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
