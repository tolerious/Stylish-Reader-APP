<template>
    <Header title="Words of Today" @goBack="handleGoBack"></Header>
    <div class="p-2 grid grid-cols-5 gap-3">
        <word-of-today-item v-for="i in 30" :key="i"></word-of-today-item>
    </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue';
import WordOfTodayItem from '@/components/WordOfTodayItem.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
function handleGoBack() {
    router.go(-1);
}
</script>
