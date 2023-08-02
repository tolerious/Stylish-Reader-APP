<template>
  <div class="login-container">
    <div class="inner-login-container">
      <el-row><el-col :span="24"> <el-divider content-position="center">欢迎使用燃烧英语</el-divider></el-col></el-row>
      <el-row>
        <el-col :span="20">
          <el-form label-width="100px">
            <el-form-item label="用户名">
              <el-input v-model="userInfo.username"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="userInfo.password" type="password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="register">注册</el-button>
              <el-button type="primary" @click="login">登陆</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { request } from '@/utils/service'
import { ElMessage, ElNotification } from 'element-plus';

let userInfo = ref({
  username: '', password: ''
})
const router = useRouter()
// #region function
function register() {
  router.push('/register')
}
async function login() {
  const user = await request({ url: '/logic/login', method: 'post', data: userInfo.value }) as any
  console.log(user.data.token);
  localStorage.setItem('token', user.data.token)
  if (user.data.token) {
    ElNotification({
      message: 'Login Successfully', type: 'success', duration: 1200
    })
    setTimeout(() => {
      router.push('/')
    }, 1500);
  } else {
    ElNotification({
      message: 'Login failed', type: 'fail', duration: 1200
    })
  }
}
// #endregion
</script>
<style lang="less" scoped>
.login-container {
  background-color: blue;
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
}
</style>
