<template>
    <Header :title="'Reading Article'" @go-back="handleGoBack" />
    <div class="px-3 py-2" v-if="articleList.length > 0">
        <span
            @click="handleGenerateAllQuestionsAnswers"
            class="px-2 py-1 bg-cyan-400 select-none cursor-pointer active:shadow-sm active:shadow-cyan-600 rounded"
            >一键生成</span
        >
        <div v-for="article in articleList" :key="article._id">
            <div class="my-3 font-bold text-lg">{{ article._id }}</div>
            <div
                @click="handleGoToArticleDetail(i._id)"
                class="px-1 py-2 bg-slate-50 mb-2 cursor-pointer"
                v-for="i in article.documents"
                :key="i"
            >
                <div @click.stop class="cursor-auto">{{ i.title }}</div>
                <div class="flex items-center" v-if="i.questions">
                    <div class="h-2 w-5 bg-green-300"></div>
                    <div class="ml-1"><span>问题已生成</span></div>
                </div>
                <div class="flex items-center" v-else>
                    <div class="h-2 w-5 bg-red-500"></div>
                    <div class="ml-1"><span>问题未生成</span></div>
                </div>
            </div>
        </div>
    </div>
    <el-empty description="暂无数据，请访问The Guardian网站，阅读新闻，系统会自动添加。" v-else />
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue';
import { request } from '@/utils/service';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const articleList = ref([]);

async function handleGenerateAllQuestionsAnswers() {
    let availableList = [];

    articleList.value.forEach(article => {
        article.documents.forEach(doc => {
            if (!doc.questions) {
                availableList.push(doc._id);
            }
        });
    });

    console.log(availableList);
    for (let i = 0; i < availableList.length; i++) {
        const r = await request({ url: '/deepseek', method: 'post', data: { articleId: availableList[i] } });
        console.log(r);
    }
}

function handleGoToArticleDetail(id) {
    router.push(`/reading/${id}`);
}

async function getGuardianArticles() {
    const r = await request({ url: '/article/guardian' });
    console.log(r);
    articleList.value = r.data;
}

function handleGoBack() {
    router.go(-1);
}

onMounted(() => {
    getGuardianArticles();
});
</script>
