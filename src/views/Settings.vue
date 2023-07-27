<template>
    <Header title="Settings" @go-back="handleGoBack" />
    <div class="settings-container">
        <el-descriptions title="User Settings">
            <el-descriptions-item label="Default Group">
                <el-select v-model="defaultGroup">
                    <el-option value=""></el-option>
                </el-select>
            </el-descriptions-item>
        </el-descriptions>
    </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// #region variable
let defaultGroup = ref('')
const router = useRouter()
// #endregion

// #region function
function handleGoBack() {
    router.push('/')
}
// #endregion

</script>

<style scoped>
.settings-container {
    width: 90%;
    margin: 0 auto 30px auto;
}
</style>