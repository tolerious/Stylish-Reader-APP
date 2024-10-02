<template>
    <Header title="Flash Card" @goBack="handleGoBack"></Header>

    <div class="roll-back">
        <el-button :icon="Refresh" size="large" circle />
    </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue';
import { Refresh } from '@element-plus/icons-vue';
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

onMounted(async () => {
    const groupId = route.params.groupId;
    console.log(groupId);
});

function handleGoBack() {
    router.go(-1);
}
</script>

<style lang="less" scoped></style>
