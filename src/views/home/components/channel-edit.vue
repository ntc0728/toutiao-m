<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        type="danger"
        size="mini"
        plain
        round
        class="edit-btn"
        @click="isEdit = !isEdit"
        >{{ isEdit ? '完成' : '编辑' }}</van-button
      >
    </van-cell>
    <van-grid class="my-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in myChannels"
        :key="index"
        @click="onMyChannelClick(channel, index)"
      >
        <!-- v-bild:class 语法
     一个对象，对象中的 key 表示要作用的CSS类名  
              对象中的value要计算出布尔值 
                true,则作用该类名
                false,不作用该类名
      -->
        <van-icon
          slot="icon"
          name="clear"
          v-show="isEdit && !fiexChannels.includes(channel.id)"
        ></van-icon>
        <span class="text" :class="{ active: index === active }" slot="text">
          {{ channel.name }}</span
        >
      </van-grid-item>
    </van-grid>

    <!-- 频道编辑 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in recommendChannels"
        :key="index"
        @click="onAddChannel(channel)"
      >
        <van-icon name="plus"></van-icon>
        <span class="text">{{ channel.name }}</span>
      </van-grid-item>
    </van-grid>
  </div>
</template>

<script>
import {
  getAllChannels,
  addUserChannel,
  deleteUserChannel
} from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  props: {
    myChannels: {
      type: Array,
      required: true
    },

    active: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      allChannels: [], // 所有频道
      isEdit: false, // 控制编辑状态的显示
      fiexChannels: [0] //固定频道，不允许删除
    }
  },
  computed: {
    ...mapState(['user']),
    // 计算属性会观测内部数据的变化
    // 如果依赖的数据发生变化，则计算属性会重新执行
    recommendChannels() {
      return this.allChannels.filter(channel => {
        return !this.myChannels.find(myChannel => {
          return myChannel.id === channel.id
        })
        // return !this.myChannels.map(item => item.id).includes(channel.id)
      })

      //   const channels = []
      //   console.log(this.allChannels)
      //   this.allChannels.forEach(channel => {
      //     // 找到满足条件的元素
      //     const ret = this.myChannels.find(myChannel => {
      //       return myChannel.id === channel.id
      //     })
      //     // 我的频道不包含该频道项，则手机到推荐频道
      //     if (!ret) {
      //       channels.push(channel)
      //     }
      //   })
      //   // 把计算结果返回
      //   return channels
    }
  },
  created() {
    this.loadAllChannels()
  },
  methods: {
    // 单项数据流：只要父组件身上的属性发生变化
    async loadAllChannels() {
      try {
        const { data } = await getAllChannels()
        // console.log(data)
        this.allChannels = data.data.channels
        // console.log(this.allChannels)
      } catch (err) {
        this.$toast('数据获取失败')
      }
    },

    async onAddChannel(channel) {
      // 持久化：本地缓存
      try {
        this.myChannels.push(channel)
        if (this.user) {
          // 已登录，数据存储到线上
          await addUserChannel([
            {
              id: channel.id, // 频道 id
              seq: this.myChannels.length // 频道的 序号
            }
          ])
        } else {
          // 未登录，数据存储到本地
          setItem('channels', this.myChannels)
        }
      } catch (err) {
        // console.log(err)
        this.$toast('添加频道失败')
      }
    },

    onMyChannelClick(channel, index) {
      if (this.isEdit) {
        // 如果时固定频道，则不删除
        if (this.fiexChannels.includes(channel.id)) {
          return
        }
        // 2.删除频道项
        this.myChannels.splice(index, 1)
        // 如果删除的激活频道之前的频道，则更新激活的频道项
        // 参数1：要删除的元素的开始索引
        // 参数2：删除的个数、
        if (index <= this.active) {
          // 让激活频道的索引 -1
          this.$emit('update-active', this.active - 1, true)
        }
        // 处理持久化
        this.deleteChannel(channel)
      } else {
        // 非编辑状态，执行切换频道
        this.$emit('update-active', index, false)
      }
    },

    async deleteChannel(channel) {
      try {
        if (this.user) {
          // 已登录，数据存储到线上
          await deleteUserChannel(channel.id)
        } else {
          // 未登录，数据存储到本地
          setItem('channels', this.myChannels)
        }
      } catch (err) {
        this.$toast('操作失败，请稍后重试')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }

  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
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
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }

  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }

  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
