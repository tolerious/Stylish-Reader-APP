<template>
    <Header :title="'Reading Article Detail'" @go-back="handleGoBack" />
    <div class="px-3 py-3 bg-slate-50">
        <h1 class="text-center text-xl font-bold">{{ articleDetail.title }}</h1>
        <div class="mx-2 flex gap-2 my-5 text-slate-500">
            <div class="bg-cyan-500 h-full w-1">&nbsp;</div>
            <div>{{ articleDetail.summary }}</div>
        </div>
        <div>
            <p class="text-lg mx-2 my-4" v-for="pp in articleDetail.content" :key="pp">{{ pp }}</p>
        </div>
        <div class="flex gap-2 items-center">
            <a class="px-2 py-1 bg-cyan-500 cursor-pointer round rounded text-white" @click="handleOriginalUrl"
                >原文链接</a
            >
            <div
                @click="generateQuestions"
                class="cursor-pointer active:shadow active:shadow-slate-400 px-2 py-1 bg-pink-500 rounded text-white"
            >
                生成问题
            </div>
            <div
                @click="displayAnswers"
                class="cursor-pointer active:shadow active:shadow-slate-400 px-2 py-1 bg-pink-500 rounded text-white"
            >
                查看答案
            </div>
            <div
                @click="refreshPage"
                class="cursor-pointer active:shadow active:shadow-slate-400 px-2 py-1 bg-pink-500 rounded text-white"
            >
                刷新页面
            </div>
        </div>
        <div class="mt-16">
            <div class="font-bold">Questions:</div>
            <p class="whitespace-pre-wrap">{{ articleDetail.questions }}</p>
        </div>
        <div class="mt-16" v-if="isAnswersVisible">
            <div class="font-bold">Answers:</div>
            <p class="whitespace-pre-wrap">{{ articleDetail.answers }}</p>
        </div>
    </div>
</template>
<script setup lang="ts">
import Header from '@/components/Header.vue';
import { request } from '@/utils/service';
import { ElNotification } from 'element-plus';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const articleDetail = ref({});
const isAnswersVisible = ref(false);

function refreshPage(){
    window.location.reload();
}

function displayAnswers() {
    isAnswersVisible.value = !isAnswersVisible.value;
}

function handleOriginalUrl() {
    window.open(articleDetail.value.originalUrl);
}

function handleGoBack() {
    router.go(-1);
}

async function getArticleDetail(id) {
    const r = await request({ url: '/article/guardian/' + id });
    console.log(r);
    return r;
}

async function generateQuestions() {
    const r = await request({ url: '/deepseek', method: 'post', data: { articleId: articleDetail.value._id } });
    console.log(r);
    if (r.code === 200) {
        ElNotification({ type: 'success', title: '问题已生成' });
    } else {
        ElNotification({ type: 'error', title: '问题生成失败，请重试' });
    }
}

onMounted(async () => {
    const id = route.params.articleID;
    console.log(id);
    const t = await getArticleDetail(id);
    articleDetail.value = t.data;
});
</script>
