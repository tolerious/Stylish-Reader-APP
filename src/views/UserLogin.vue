<template>
    <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <img class="mx-auto h-10 w-auto" src="/stylish-reader.svg" alt="Your Company" />
            <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Sign in to your account
            </h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form class="space-y-6">
                <div>
                    <label for="username" class="block text-sm font-medium leading-6 text-gray-900">User Name</label>
                    <div class="mt-2">
                        <input
                            id="username"
                            v-model="userInfo.username"
                            name="username"
                            type="text"
                            required
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>

                <div>
                    <div class="flex items-center justify-between">
                        <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
                    </div>
                    <div class="mt-2">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            v-model="userInfo.password"
                            autocomplete="current-password"
                            required
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>

                <div>
                    <div
                        v-if="isLogin"
                        id="login-btn"
                        @click="login"
                        class="cursor-pointer flex w-full justify-center rounded-md bg-pink-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
                    >
                        Sign in
                    </div>
                    <div
                        v-else
                        id="register-btn"
                        @click="register"
                        class="cursor-pointer flex w-full justify-center rounded-md bg-pink-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
                    >
                        Register
                    </div>
                </div>
            </form>

            <p class="mt-4 text-center text-pink-700" id="error-message">
                <span></span>
            </p>

            <p class="mt-7 text-center text-sm text-gray-500 cursor-pointer">
                <span v-if="isLogin" id="not-a-member">Not a member?&nbsp;&nbsp;</span>
                <span v-else id="want-to-login">I want to&nbsp;</span>
                <a class="cursor-pointer font-semibold leading-6 text-pink-600 hover:text-pink-500">
                    <span style="cursor: pointer" id="register-span" @click="isLogin = !isLogin" v-if="isLogin"
                        >Register Here</span
                    >
                    <span style="cursor: pointer" v-else id="login-span" @click="isLogin = !isLogin">Login</span>
                </a>
            </p>
        </div>
    </div>
</template>
<script setup lang="ts">
import { request } from '@/utils/service';
import { ElNotification } from 'element-plus';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

let userInfo = ref({
    username: '',
    password: '',
});

const isLogin = ref(true);

onMounted(() => {
    localStorage.setItem('token', '');
});

function register() {
    router.push('/register');
}

async function login() {
    const user = (await request({ url: '/logic/login', method: 'post', data: userInfo.value })) as any;
    localStorage.setItem('token', user.data.token);
    localStorage.setItem('username', user.data.username);
    if (user.data.token) {
        ElNotification({
            message: '登陆成功,即将跳转',
            type: 'success',
            duration: 1200,
        });
        setTimeout(() => {
            router.push('/home');
        }, 1500);
    }
}
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
