<template>
    <Header :title="'Feedback'" @go-back="handleGoBack" />
    <div class="feedback-container">
        <el-form :model="form" label-width="120px">
            <el-form-item required label="Contact Info:">
                <el-input placeholder="Leave Wechat,QQ or Email here." v-model="form.name" />
            </el-form-item>
            <el-form-item label="Message:">
                <el-input :rows="5" v-model="form.desc" placeholder="Type something here." type="textarea" />
            </el-form-item><el-form-item>
                <el-button type="primary">Submit</el-button>
            </el-form-item>
        </el-form>

    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Header from '@/components/Header.vue'
import { useRoute, useRouter } from 'vue-router';
const router = useRouter()
const form = ref({ name: '', region: '', desc: '' })
function handleGoBack() {
    router.push('/')
}
</script>

<style scoped lang="less">
.feedback-container {
    width: 100%;
    padding: 0 3px;
    box-sizing: border-box;
    padding-top: 30px;
}
</style>