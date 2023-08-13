<template>
    <el-affix>
        <div class="header-container">
            <div class="left-header-container"><el-icon @click="goBack" v-if="showBack">
                    <Back />
                </el-icon></div>
            <div class="middle-header-container">{{ title }}</div>
            <div class="right-header-container"></div>
        </div>
    </el-affix>
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
const emit = defineEmits(['goBack'])
function goBack() {
    emit('goBack')
}

</script>

<style scoped lang="less">
.header-container {
    height: 45px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: white;
    border-bottom: 1px solid #eeeeee;

    .left-header-container,
    .right-header-container {
        width: 10%;
        height: 100%;
        line-height: 45px;
        text-align: center;
    }

    .middle-header-container {
        width: 80%;
        height: 100%;
        line-height: 45px;
        text-align: center;
    }
}
</style>