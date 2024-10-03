<template>
    <Header title="反馈建议" @go-back="handleGoBack" />
    <div class="w-3/4 bg-slate-300 mx-auto mt-10">
        <div class="text-center text-xl">您的反馈对我来说很宝贵</div>
        <textarea name=" /BBBBBBBBBBBBBBBBBBbb" id=""></textarea>
    </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue';
import { useRouter } from 'vue-router';
const router = useRouter();

function handleGoBack() {
    router.push('/home');
}
</script>
