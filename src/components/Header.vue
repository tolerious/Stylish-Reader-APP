<template>
    <div class="header-container">
        <div class="left-header-container"><el-icon @click="goBack" v-if="showBack">
                <Back />
            </el-icon></div>
        <div class="middle-header-container">{{ title }}</div>
        <div class="right-header-container"></div>
    </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

defineProps({
    title: {
        default() { return '' }, type: String
    },
    showBack: {
        default() {
            return true
        },
        type: Boolean
    },
})
const router = useRouter()
function goBack() {
    router.go(-1)
}

</script>

<style scoped lang="less">
.header-container {
    height: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .left-header-container,
    .right-header-container {
        width: 10%;
        height: 100%;
        line-height: 40px;
        text-align: center;
    }

    .middle-header-container {
        width: 80%;
        height: 100%;
        line-height: 40px;
        text-align: center;
    }
}
</style>