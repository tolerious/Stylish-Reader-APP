<template>
    <Header :title="'Reading Article Detail'" @go-back="handleGoBack" />
    <div class="px-3 py-3">
        <div class="flex gap-2 items-center">
            <a class="underline" :href="articleDetail.originalUrl">原文链接</a>
            <div
                @click="generateQuestions"
                class="cursor-pointer active:shadow active:shadow-slate-400 px-2 py-1 bg-pink-500 rounded text-white"
            >
                生成问题
            </div>
        </div>
        <div>
            <p>{{ articleDetail.content }}</p>
        </div>
    </div>
</template>
<script setup lang="ts">
import Header from '@/components/Header.vue';
import { request } from '@/utils/service';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const articleDetail = ref({});

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
}

onMounted(async () => {
    const id = route.params.articleID;
    console.log(id);
    const t = await getArticleDetail(id);
    articleDetail.value = t.data;
});
</script>
