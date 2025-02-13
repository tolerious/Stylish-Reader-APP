<template>
    <Header :title="'Reading Article'" @go-back="handleGoBack" />
    <div class="px-1 py-2">
        <div @click="handleGoToArticleDetail" class="px-1 py-2 bg-pink-50 mb-2" v-for="i in 30" :key="i">
            <div>This is the title This is the title This is the titleThis is the title This is the title</div>
            <div class="flex items-center">
                <div class="h-2 w-5 bg-green-300"></div>
                <div class="ml-1"><span>已完成</span></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

function handleGoToArticleDetail() {
    router.push(`/reading/123`);
}

function handleGoBack() {
    router.go(-1);
}
</script>
