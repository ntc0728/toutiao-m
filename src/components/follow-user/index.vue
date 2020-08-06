<template>
  <van-button
    v-if="isFollowed"
    class="follow-btn"
    round
    size="small"
    :loading="loading"
    @click="onFollow"
    >已关注</van-button
  >
  <van-button
    v-else
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    :loading="loading"
    @click="onFollow"
    >关注</van-button
  >
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'
export default {
  name: 'FollowUser',
  // 自定义 v-model 数据名称
  model: {
    prop: 'isFollowed', // 默认 value
    event: 'update-is_followed' // 默认 change
  },
  data() {
    return {
      loading: false
    }
  },
  props: {
    isFollowed: {
      type: Boolean,
      required: true
    },
    userId: {
      type: [Number, String, Object],
      required: true
    }
  },
  methods: {
    async onFollow() {
      // 展示关注按钮的 loading 状态
      this.loading = true
      try {
        if (this.isFollowed) {
          // 已关注，取消关注
          await deleteFollow(this.userId)
          // this.article.is_followed = false
        } else {
          // 没有关注，添加关注
          await deleteFollow(this.userId)
          // this.article.is_followed = true
        }
        // this.article.is_followed = !this.article.is_followed
        // this.$emit('update-is_followed', !this.value)
        this.$emit('update-is_followed', !this.isFollowed)
      } catch (err) {
        if (err.response && err.responseq.status === 400) {
          message = '你不能关注你自己'
        }
        this.$toast('操作失败，请重试')
      }
      this.loading = false // 关闭关注按钮的 loading 状态
    }
  }
}
</script>
