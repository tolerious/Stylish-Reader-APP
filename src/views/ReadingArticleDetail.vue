<template>
    <Header :title="'Reading Article Detail'" @go-back="handleGoBack" />
    <div>123</div>
</template>
<script setup lang="ts">
import Header from '@/components/Header.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
function handleGoBack() {
    router.go(-1);
}
</script>
