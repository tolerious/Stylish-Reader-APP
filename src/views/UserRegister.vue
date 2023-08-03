<template>
    <div class="login-container">
        <div class="inner-login-container">
            <el-row><el-col :span="24"> <el-divider content-position="center">欢迎使用燃烧英语</el-divider></el-col></el-row>
            <el-row>
                <el-col :span="20">
                    <el-form :model="userInfo" ref="formRef" :rules="rules" label-width="100px" status-icon>
                        <el-form-item label="输入用户名" prop="username">
                            <el-input v-model="userInfo.username" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="输入密码" prop="password">
                            <el-input v-model="userInfo.password" type="password" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="再次输入密码" prop="repeatPassword">
                            <el-input v-model="userInfo.repeatPassword" type="password" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="goBack">Back</el-button>
                            <el-button type="primary" @click="register">Register</el-button>
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


// #region function
const validateUserName = (rule: any, vc: any, callback: any) => {
    if (!vc) {
        callback(new Error('Please input username'))
    } else {
        callback()
    }
}
function validatePassword(rule: any, value: any, callback: any) {
    if (!value) {
        callback(new Error('Please input password'))
    } else {
        callback()
    }
}
function validateCheckPassword(rule: any, value: any, callback: any) {
    if (!value) { callback(new Error('Please input password')) } else {
        if (userInfo.value.password != value) {
            callback(new Error("Two inputs won't match"))
        } else {
            callback()
        }
    }
}
const register = async () => {
    const info = await request({
        url: '/user/create', method: 'post', data: {
            username: userInfo.value.username,
            password: userInfo.value.password
        }
    })
    if (info.code === 200) {
        ElMessage({ message: 'Successfully!', type: 'success', duration: 1200 })
        router.push('/')
    } else {
        ElMessage({ message: info.msg, duration: 1200, type: 'error' })
    }
}
const goBack = () => {
    router.go(-1)
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

// #region variable
const formRef = ref()
const rules = ref({
    username: [{ validator: validateUserName, trigger: 'blur' }],
    password: [{ validator: validatePassword, trigger: 'blur' }],
    repeatPassword: [{ validator: validateCheckPassword, trigger: 'blur' }]
})
let userInfo = ref({
    username: '',
    password: '',
    repeatPassword: ''
})
const router = useRouter()
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
