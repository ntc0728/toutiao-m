<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <!--
         v-if  如果这个结构有可能不显示在dom里面，用这个比较合适
         v-show：用于经常显示和隐藏的 dom 解构，比较合适 (display:none/block;)
      -->

      <div v-if="isDeleteShow">
        <span @click="$emit('clear-search-histories')">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon v-else @click="isDeleteShow = true" name="delete" />
    </van-cell>
    <van-cell
      :title="item"
      v-for="(item, index) in searchHistories"
      :key="index"
      @click="onSearchItemClick(item, index)"
      ><van-icon v-show="isDeleteShow" name="close" />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory.vue',
  components: {},
  // 数字 字符串 布尔值 不能修改，就算改了也不会传给父组件
  // 引用类型数据(数组、对象)
  // 可以修改，例如[].push
  // 不能重新赋值
  // 短横线转驼峰
  props: {
    searchHistories: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isDeleteShow: false // 控制删除显示状态
    }
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    //存储搜索历史记录
    //要求:不要有重复历史记录、最新的排在最前面
    // indexOf startsWith includes (字符串和数组都适用，并且返回是一个 布尔值)
    onSearchItemClick(item, index) {
      if (this.isDeleteShow) {
        // 删除状态,删除历史记录数据
        this.searchHistories.splice(index, 1)
      } else {
        // 编辑状态,搜索状态
        this.$emit('search', item)
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
