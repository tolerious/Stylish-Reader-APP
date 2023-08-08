<template>
    <div class="login-container">
        <div class="inner-login-container">
            <el-row><el-col :span="24"> <el-divider content-position="center">欢迎使用燃烧英语</el-divider></el-col></el-row>
            <el-row>
                <el-col :span="20">
                    <el-form :model="userInfo" ref="formRef" :rules="rules" label-width="100px" status-icon>
                        <el-form-item label="Phone" prop="username">
                            <el-input maxlength="11" clearable placeholder="Input phone number" v-model="userInfo.username"
                                autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="Code" prop="code">
                            <div class="code-container">
                                <el-input maxlength="4" clearable placeholder="Sms code" style="width:70%;"
                                    v-model="userInfo.code" autocomplete="off"></el-input>
                                <el-button style="width: 25%;" type="primary">Send</el-button>
                            </div>
                        </el-form-item>
                        <el-form-item label="Password" prop="password">
                            <el-input clearable v-model="userInfo.password" type="password" autocomplete="off"></el-input>
                        </el-form-item>

                        <el-form-item>
                            <el-button @click="goBack">Back</el-button>
                            <el-button type="primary" @click="register(formRef)">Register</el-button>
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
import { ElMessage, ElNotification, type FormInstance } from 'element-plus';


// #region function
const validateUserName = (rule: any, vc: any, callback: any) => {
    if (!vc || vc.trim().length != 11) {
        callback(new Error('Username invalid'))
    } else {
        callback()
    }
}

function validateCode(rule: any, value: any, callback: any) {
    let r = /^[0-9]*$/
    if (r && r.test(value) && value.length == 4) {
        callback()
    } else {
        callback(new Error('Please enter code'))
    }
}

function validatePassword(rule: any, value: any, callback: any) {
    if (!value) {
        callback(new Error('Please input password'))
    } else {
        callback()
    }
}
const register = async (formEl: FormInstance | undefined) => {
    formEl?.validate(valid => {
        console.log(valid);

    })
    // const info = await request({
    //     url: '/user/create', method: 'post', data: {
    //         username: userInfo.value.username,
    //         password: userInfo.value.password
    //     }
    // })
    // if (info.code === 200) {
    //     ElMessage({ message: 'Successfully!', type: 'success', duration: 1200 })
    //     router.push('/')
    // } else {
    //     ElMessage({ message: info.msg, duration: 1200, type: 'error' })
    // }
}
const goBack = () => {
    router.go(-1)
}

// #endregion

// #region variable
const formRef = ref()
const rules = ref({
    username: [{ validator: validateUserName, trigger: 'blur' }],
    password: [{ validator: validatePassword, trigger: 'blur' }],
    code: [{ validator: validateCode, trigger: 'blur' }]
})
let userInfo = ref({
    username: '',
    password: '',
    code: '',
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

        .code-container {
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
        }
    }
}
</style>
