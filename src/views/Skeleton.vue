<template>
    <div class="skeleton-container">
        <el-skeleton style="--el-skeleton-circle-size: 100px">
            <template #template>
                <el-skeleton-item variant="circle" />
            </template>
        </el-skeleton>
        <el-skeleton animated :rows="8" />
    </div>
</template>

<script setup lang="ts">
import { request } from '@/utils/service';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

// #region variable
const router = useRouter();
// #endregion

// #region lifecycle
onMounted(() => {
    pingPong();
});
// #endregion

// #region function
const pingPong = async () => {
    const info = await request({ url: '/logic/pingpong' });
    if (info.code === 200)
        setTimeout(() => {
            router.push('/home');
        }, 200);
};
// #endregion
</script>

<style scoped lang="less">
.skeleton-container {
    width: 90%;
    height: 90%;
    margin: 10px auto auto auto;
}
</style>
