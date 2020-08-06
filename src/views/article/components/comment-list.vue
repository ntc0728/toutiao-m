<template>
  <!-- 只有list在可视范围内才会检查滚动位置触发 onLoad -->
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    :immediate-check="false"
    @load="onLoad"
  >
    <comment-item
      v-for="(item, index) in list"
      :key="index"
      :comment="item"
      @reply-click="$emit('reply-click', $event)"
    />
  </van-list>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from './comment-item'
export default {
  name: 'CommentList',
  components: {
    CommentItem
  },
  props: {
    source: {
      type: [Object, Number, Boolean],
      required: true
    },
    list: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      // 自定义 prop 数据验证
      validator(value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a'
    }
  },
  data() {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null, // 获取下一页的时间戳
      limit: 10
    }
  },
  created() {
    // 当你手动初始 onLoad 它不会自动开始初始的loading
    this.loading = true
    this.onLoad()
  },
  methods: {
    async onLoad() {
      // 获取文章的评论和获取评论的回复是同一个接口
      // 唯一的区别是接口参数
      // let source = Number(this.source)
      try {
        // 获取文章的评论和获取评论的回复是同一个接口1
        // 唯一的区别是接口参数不一样
        // type
        //   a文章的评论
        //    C评论的回复
        // source
        //    文章的评论，则传递文章的ID
        //    评论的回复，则传递评论的ID

        // 1.获取请求数据
        const { data } = await getComments({
          type: this.type,
          source: this.source.toString(),
          offset: this.offset,
          limit: this.limit
        })
        // 2.将数据添加到列表中
        // console.log(data)
        const { results } = data.data
        // debugger
        // console.log(results)
        this.list.push(...results)
        // 把文章评论的总数量传递到外部
        this.$emit('onload-success', data.data)
        //3.将loading设置为false
        this.loading = false
        //4.判断是否还有数据
        if (results.length) {
          // 有就更新获取下一页的数据页码
          this.offset = data.data.last_id
        } else {
          // 没有数据 finished 设置结束
          this.finished = true
        }
      } catch (err) {
        this.$toast('获取评论失败')
        // console.log(err)
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
