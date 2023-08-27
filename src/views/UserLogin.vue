<template>
  <div class="login-container">
    <div class="inner-login-container">
      <el-row><el-col :span="24"> <el-divider content-position="center">欢迎使用燃烧吧英语</el-divider></el-col></el-row>
      <el-row>
        <el-col :span="20">
          <el-form label-width="100px">
            <el-form-item label="Phone">
              <el-input v-model="userInfo.username"></el-input>
            </el-form-item>
            <el-form-item label="Password">
              <el-input v-model="userInfo.password" type="password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="register">Register</el-button>
              <el-button type="primary" @click="login">Login</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <!-- <div class="bottom"><span>上海薰紫信息科技有限公司-<a href="https://beian.miit.gov.cn">沪ICP备18005507号-10</a></span></div> -->
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { request } from '@/utils/service'
import { ElMessage, ElNotification } from 'element-plus';

let userInfo = ref({
  username: '', password: ''
})
const router = useRouter()

onMounted(() => {
  localStorage.setItem('token', '')
})

// #region function
function register() {
  router.push('/register')
}
async function login() {
  const user = await request({ url: '/logic/login', method: 'post', data: userInfo.value }) as any
  localStorage.setItem('token', user.data.token)
  localStorage.setItem('username', user.data.username)
  if (user.data.token) {
    ElNotification({
      message: 'Login Successfully', type: 'success', duration: 1200
    })
    setTimeout(() => {
      router.push('/home')
    }, 1500);
  }
}
// #endregion
</script>
<style lang="less" scoped>
.login-container {
  width: 100%;
  position: relative;
  top: 150px;

  .inner-login-container {
    height: 80%;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    width: 100%;
  }

  .bottom {
    position: fixed;
    text-align: center;
    bottom: 0;
    width: 100%;
    font-size: 12px;
  }
}
</style>
