<template>
    <Header title="反馈建议" @go-back="handleGoBack" />
    <div class="w-3/4 mx-auto mt-10 flex flex-col items-center gap-4">
        <div class="text-center text-xl">您的反馈对我来说很宝贵</div>
        <textarea
            v-model="content"
            name=""
            rows="10"
            class="w-full mt-3 border-[1px] border-gray-300 px-2"
            placeholder="请输入您宝贵的建议"
        ></textarea>
        <button
            @click="submitFeedback"
            class="bg-pink-500 text-white px-3 py-1 font-bold rounded-xs w-30 active:shadow-sm active:shadow-gray-300"
        >
            提 交 反 馈
        </button>
    </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue';
import { request } from '@/utils/service';
import { ElNotification } from 'element-plus';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const content = ref('');

async function submitFeedback() {
    if (!content.value) {
        ElNotification.warning({ title: '请输入文字' });
        return;
    }
    const t = await request({ url: '/feedback', method: 'post', data: { content: content.value } });
    if (t.code === 200) {
        ElNotification.success({ title: '提交成功' });
    }
}

function handleGoBack() {
    router.push('/home');
}
</script>
