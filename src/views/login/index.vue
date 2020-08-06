<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录">
      <van-icon slot="left" name="cross" @click="$router.back()" />
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 登录表单 -->
    <!-- 表单验证“
          1.给 van-field 组件配置 rules 验证规则
             参考文档：
          2. 当表单提交的时候会自动触发表单验证
             如果验证通过，会触发 submit 事件
             如果验证失败，不会触发 submit

      type='number' 手机键盘唤起的时候，展示的是一个从 1->0 数字键盘
      type='tel' 不能和  maxlength 混用 
      查看协议之后 返回登录页面手机号和验证码如果之前输入过了，应当显示
      倒计时：num ：60， 显示文本的 lobel timerId = setInterval(()=>{
        this.num --\label = this.num+'s'
        if(this.num === 0){
          clear
        }
      })
    -->
    <van-form ref="loginForm" @submit="onSubmit">
      <van-field
        v-model="user.mobile"
        type="number"
        name="mobile"
        placeholder="请输入手机号"
        :rules="userFormRules.mobile"
        maxlength="11"
      >
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <van-field
        v-model="user.code"
        type="number"
        name="code"
        placeholder="请输入验证码"
        :rules="userFormRules.code"
        maxlength="6"
      >
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
        <template #button>
          <!-- time :倒计时时间 -->
          <van-count-down
            v-if="ifCountDownShow"
            :time="1000 * 60"
            format="ss s"
            @finish="ifCountDownShow = false"
          />
          <van-button
            v-else
            class="send-sms-btn"
            native-type="button"
            round
            size="small"
            type="default"
            @click="onSendSms"
            >发送验证码</van-button
          >
          <!-- 三元表达式 -->
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" block type="info" native-type="submit">
          登录
        </van-button>
      </div>
    </van-form>
    <!-- /登录表单 -->
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data() {
    return {
      user: {
        mobile: '', // 手机号
        code: '' // 验证号
      },
      userFormRules: {
        mobile: [
          { required: true, message: '手机号不能为空' },
          {
            pattern: /1[3|5|7|8]\d{9}/,
            message: '手机号格式错误'
          }
        ],
        code: [
          { required: true, message: '验证码不能为空' },
          { pattern: /\d{6}/, message: '验证码格式错误' }
        ]
      },
      ifCountDownShow: false // 是否展示倒计时
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onSubmit() {
      // 1. 获取表单数据
      const user = this.user
      // 2. 表单验证

      // 3. 提交表单请求登录
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true, // 禁用背景点击
        duration: 0 // 持续时间，默认 2000，0 表示持续展示不关闭
      })

      // 请求登录  登录按钮连续点多次 -> 出现多次调用接口(需要额外处理)
      try {
        const { data } = await login(this.user)
        // console.log('登录成功', res)[]
        this.$store.commit('setUser', data.data)
        this.$toast.success('登录成功')
        // 跳转回原来页面
        this.$router.back()
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail('手机号或验证码错误')
        } else {
          this.$toast.fail('登录失败，请稍后重试')
        }
      }
      // 4. 根据请求响应结果处理后续操作
    },
    async onSendSms() {
      //1.校验手机号
      try {
        await this.$refs.loginForm.validate('mobile')
      } catch (err) {
        return console.log('验证失败', err)
      }
      //2.验证通过，显示倒计时
      this.ifCountDownShow = true
      //3.请求发送验证码
      try {
        const res = await sendSms(this.user.mobile)
        // console.log('发送成功', res)
        this.$toast('发送成功')
      } catch (err) {
        // console.log('发送失败', err)
        // 发送失败,关闭倒计时
        this.ifCountDownShow = false
        if (err.response.status === 429) {
          this.$toast('发送太频繁了，请稍后重试')
        } else {
          this.$toast('发送失败，请稍后重试')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  .toutiao {
    font-size: 37px;
  }
  .send-sms-btn {
    width: 162px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
