<template>
    <Header title="Flash Card" @goBack="handleGoBack"></Header>
    <template v-if="wordList.length > 0">
        <div
            v-if="!isTranslationVisible"
            card-container
            class="border-[1px] border-gray-300 w-11/12 my-0 mx-auto rounded-xs mt-9 h-3/5 flex items-center justify-center overflow-y-scroll"
        >
            <div word class="text-6xl text-pink-600 text-wrap break-all">{{ currentWord.en }}</div>
        </div>
        <div
            v-else
            card-container
            class="border-[1px] border-gray-300 w-11/12 my-0 mx-auto rounded-xs mt-9 h-3/5 overflow-y-scroll"
        >
            <div class="text-3xl text-center text-pink-600">{{ currentWord.en }}</div>
            <div class="text-center text-normal">{{ currentTranslation.phonetic }}</div>
            <div translation-container class="px-2">
                <div
                    item
                    class="shadow-sm shadow-gray-300 my-3 px-2"
                    v-for="translation in currentTranslation.dicList"
                    :key="translation"
                >
                    {{ translation.pos }}
                    {{ translation.zh }}
                </div>
            </div>
        </div>
        <div button-group class="fixed w-full bottom-10 h-10 flex items-center px-2 justify-around">
            <button
                @click="navigateWord(text)"
                v-for="text in buttonTexts"
                :key="text"
                class="text-white border-[1px] border-pink-600 px-4 py-1 bg-pink-500 active:shadow-xs active:shadow-gray-500"
                :class="[]"
            >
                {{ text }}
            </button>
        </div>
        <div class="roll-back fixed right-3 bottom-28">
            <el-button :icon="Refresh" size="large" circle @click="isTranslationVisible = !isTranslationVisible" />
        </div>
    </template>
    <template v-else>
        <el-empty description="默认词组中没有收藏单词" />
    </template>
    <audio autoplay ref="audioPlayer" :src="audioUrl">123</audio>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue';
import type { ResponseData, Word } from '@/types';
import { request } from '@/utils/service';
import { Refresh } from '@element-plus/icons-vue';
import axios from 'axios';
import { ElNotification } from 'element-plus';
import { computed, onMounted, ref, type Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const buttonTexts = ['文章链接', '发音', '上一个', '下一个'];

const route = useRoute();
const router = useRouter();
const groupId = ref('');
const isTranslationVisible = ref(false);
const wordList: Ref<Word[]> = ref([]);
const currentIndex = ref(0);
const currentTranslation = ref();
const originalPageUrl = ref('');
const audioUrl = ref('');
const audioPlayer: Ref<HTMLAudioElement | null> = ref(null);

const currentWord = computed(() => wordList.value[currentIndex.value] ?? { en: '' });

onMounted(async () => {
    groupId.value = route.params.groupId as string;
    await getWordList();
    if (currentWord.value.en) {
        await getTranslation(currentWord.value.en);
    }
    await getGroupDetail();
});

async function handleClick() {
    console.log(currentWord.value.en);
    const response: any = await axios({
        url: `${import.meta.env.VITE_BACKEND_URL}/youdao/`, // 后端 API
        method: 'POST',
        data: { word: currentWord.value.en },
        responseType: 'blob', // 获取音频为 Blob
    });
    console.log(response.data);
    const audioBlob = response.data;
    const u = URL.createObjectURL(audioBlob);
    audioUrl.value = u;
    audioPlayer.value?.play();
}

async function getWordList() {
    const t: ResponseData = await request({ url: '/word/bygroup', method: 'post', data: { groupId: groupId.value } });

    wordList.value = t.data;
}

async function getTranslation(wordText: string) {
    const t: ResponseData = await request({ url: '/translation/content/', method: 'post', data: { word: wordText } });
    currentTranslation.value = t.data;
}

function handleGoBack() {
    router.go(-1);
}

async function getGroupDetail() {
    const info = await request({ url: '/wordgroup/detail', method: 'post', data: { groupID: groupId.value } });
    originalPageUrl.value = info.data.originalPageUrl;
}

function navigateWord(text: string) {
    if (text === '上一个') {
        if (currentIndex.value != 0) {
            currentIndex.value -= 1;
            getTranslation(currentWord.value.en);
        } else {
            ElNotification({ type: 'info', title: '前面没有单词喽', message: '继续下一个单词吧' });
        }
    }
    if (text === '下一个') {
        if (currentIndex.value < wordList.value.length - 1) {
            currentIndex.value += 1;
            getTranslation(currentWord.value.en);
        } else {
            ElNotification({ type: 'info', title: '单词已学完', message: '选择其他词组继续学习吧' });
        }
    }
    if (text === '文章链接') {
        if (originalPageUrl.value) {
            window.open(`http://${originalPageUrl.value}`, '_blank');
        }
    }
    if (text === '发音') {
        handleClick();
    }
    isTranslationVisible.value = false;
}
</script>
1
