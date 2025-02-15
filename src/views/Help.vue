<template>
    <Header title="Help" @go-back="handleGoBack" />
    <div class="help-container"></div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue';

import { useRouter } from 'vue-router';

// #region variable
const router = useRouter();
// #endregion

// #region function
function handleGoBack() {
    router.push('/home');
}
// #endregion
</script>

<style scoped lang="less"></style>
