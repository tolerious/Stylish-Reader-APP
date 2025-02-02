<template>
    <Header title="Words of Today" @goBack="handleGoBack"></Header>
    <div v-if="todayWord.length > 0" class="p-2 grid lg:grid-cols-5 grid-cols-3 lg:gap-3 gap-2">
        <word-of-today-item :wordText="i.en" v-for="i in todayWord.wordList" :key="i"></word-of-today-item>
    </div>
    <el-empty description="No Data." v-else />
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue';
import WordOfTodayItem from '@/components/WordOfTodayItem.vue';
import { request } from '@/utils/service';
import { onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';

const todayWord = reactive({
    count: 0,
    wordList: [],
});

onMounted(async () => {
    Object.assign(todayWord, await getTodayWordCount());
});

const router = useRouter();
function handleGoBack() {
    router.go(-1);
}

async function getTodayWordCount() {
    const info = await request({ url: '/word/today' });
    return info.data;
}
</script>
