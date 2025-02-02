<template>
    <Header @go-back="handleGoBack" title="Page Not Found"></Header>
    <div style="margin-top: 30px">
        <el-empty description="404 Not Found" />
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function handleGoBack() {
    router.push('/home');
}
</script>

<style scoped lang="less"></style>
