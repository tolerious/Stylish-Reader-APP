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
                                <el-button :disabled="sendCodeBtnDisable" style="width: 25%;" type="primary"
                                    @click="sendCode">Send</el-button>
                            </div>
                        </el-form-item>
                        <el-form-item label="Password" prop="password">
                            <el-input placeholder="Input password" clearable v-model="userInfo.password" type="password"
                                autocomplete="off"></el-input>
                        </el-form-item>

                        <el-form-item>
                            <el-button @click="goBack">Back</el-button>
                            <el-button type="primary" @click="register(formRef)">Register</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </div>
        <div class="bottom"><span> <a href="https://beian.miit.gov.cn">沪ICP备18005507号-10</a></span></div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { request } from '@/utils/service'
import { ElMessage, ElNotification, type FormInstance } from 'element-plus';


// #region function
const validateUserName = async (rule: any, vc: any, callback: any) => {
    if (/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(vc)) {
        let p = await request({ url: '/user/exist', data: { username: vc }, method: 'post' })
        if (p.data === 'can') {
            sendCodeBtnDisable.value = false
            callback()
        } else {
            sendCodeBtnDisable.value = true
            callback(new Error(p.msg))
        }
    } else {
        callback(new Error('Username invalid'))
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
async function sendCode() {
    let p = await request({ url: '/user/exist', data: { username: userInfo.value.username }, method: 'post' })
    if (p.data === 'can') {
        let info = await request({ url: '/sms', method: 'post', data: { username: userInfo.value.username } })
        console.log(info);

        if (info.code === 200) {
            ElMessage({ type: 'success', message: 'Send successfully' })
        } else {
            ElMessage({ type: 'error', message: info.data })
        }
    } else {
        ElMessage({ type: 'error', message: p.msg })

    }

}
const register = (formEl: FormInstance | undefined) => {
    formEl?.validate(async valid => {
        console.log(valid);
        if (valid) {
            const info = await request({
                url: '/user/create', method: 'post', data: {
                    username: userInfo.value.username,
                    password: userInfo.value.password,
                    code: userInfo.value.code
                }
            })
            if (info.code === 200) {
                ElMessage({ message: 'Successfully!', type: 'success', duration: 1200 })
                router.push('/login')
            } else {
                ElMessage({ message: info.msg, duration: 1200, type: 'error' })
            }
        } else {
            ElMessage({ message: 'Info not correct', type: 'error', duration: 1200 })
        }
    })

}
const goBack = () => {
    router.go(-1)
}

// #endregion

// #region variable
const formRef = ref()
const sendCodeBtnDisable = ref(false)
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

    .bottom {
        position: fixed;
        text-align: center;
        bottom: 0;
        width: 100%;
        font-size: 12px;
    }
}
</style>
