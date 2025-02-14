<template>
    <Header :title="'Reading Article'" @go-back="handleGoBack" />
    <div class="px-1 py-2">
        <div
            @click="handleGoToArticleDetail(i._id)"
            class="px-1 py-2 bg-pink-50 mb-2"
            v-for="i in articleList"
            :key="i"
        >
            <div>{{ i.title }}</div>
            <div class="flex items-center">
                <div class="h-2 w-5 bg-green-300"></div>
                <div class="ml-1"><span>问题已生成</span></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue';
import { request } from '@/utils/service';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const articleList = ref([]);

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
