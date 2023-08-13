<template>
    <Header title="Feedback & Help" @go-back="handleGoBack" />
    <div class="feedback-container">
        <!-- <el-form :model="form" label-width="120px">
            <el-form-item required label="Contact Info:">
                <el-input placeholder="Leave Wechat,QQ or Email here." v-model="form.name" />
            </el-form-item>
            <el-form-item label="Message:">
                <el-input :rows="5" v-model="form.desc" placeholder="Type something here." type="textarea" />
            </el-form-item><el-form-item>
                <el-button type="primary">Submit</el-button>
            </el-form-item>
        </el-form> -->
        <div class="img-container">
            <img style="width: 100%;"
                src="@/assets/images/wechat.jpg"
                alt="">
            <div><span>扫描上方二维码添加作者微信</span></div>
            <a href="https://englishburning.com/how-to-use.html">或点击查看使用教程</a>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Header from '@/components/Header.vue'
import { useRoute, useRouter } from 'vue-router';
const router = useRouter()
const form = ref({ name: '', region: '', desc: '' })
function handleGoBack() {
    router.push('/home')
}
</script>

<style scoped lang="less">
.feedback-container {
    width: 100%;
    padding: 30px 8px 8px 0;
    box-sizing: border-box;

    .img-container {
        width: 90%;
        text-align: center;
        margin: 0 auto;
    }
}
</style>