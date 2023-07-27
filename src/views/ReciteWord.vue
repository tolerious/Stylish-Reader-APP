<template>
    <Header title="Flash Card" @goBack="handleGoBack"></Header>
    <div class="recite-word-container">
        <div class="recite-word-inner-container">
            <div class="title-word-container" @click="showMeanings" v-if="showWord">
                <span>Fucking Vue</span>
            </div>
            <div class="meaning-collapse-container" v-else>
                <el-collapse v-model="activeNames">
                    <el-collapse-item title="First Meaning" name="1">
                        <div class="english-meaning-content">
                            <div><span>a strong feeling such as love or anger, or strong feelings in general</span></div>
                        </div>
                        <div class="chinese-meaning-content">感情，情感；情绪；激情</div>
                        <div class="sentence-container">
                            <p> Like a lot of men, he finds it hard to express his emotions. </p>
                            <p>像很多男人一样，他不大会表达自己的感情。</p>
                            <p>My mother was overcome with emotion and burst into tears. </p>
                            <p>我母亲控制不住自己的感情，泪如雨下。 </p>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item title="First Meaning" name="2">
                        <div class="english-meaning-content">
                            <div><span>a strong feeling such as love or anger, or strong feelings in general</span></div>
                        </div>
                        <div class="chinese-meaning-content">感情，情感；情绪；激情</div>
                        <div class="sentence-container">
                            <p> Like a lot of men, he finds it hard to express his emotions. </p>
                            <p>像很多男人一样，他不大会表达自己的感情。</p>
                            <p>My mother was overcome with emotion and burst into tears. </p>
                            <p>我母亲控制不住自己的感情，泪如雨下。 </p>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item title="First Meaning" name="3">
                        <div class="english-meaning-content">
                            <div><span>a strong feeling such as love or anger, or strong feelings in general</span></div>
                        </div>
                        <div class="chinese-meaning-content">感情，情感；情绪；激情</div>
                        <div class="sentence-container">
                            <p> Like a lot of men, he finds it hard to express his emotions. </p>
                            <p>像很多男人一样，他不大会表达自己的感情。</p>
                            <p>My mother was overcome with emotion and burst into tears. </p>
                            <p>我母亲控制不住自己的感情，泪如雨下。 </p>
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </div>
            <div class="bottom-btn-group">
                <el-row>
                    <el-col :span="8"> <el-button type="danger" @click="showMeanings">Overturn</el-button></el-col>
                    <el-col :span="8"> <el-button type="info">Prev</el-button></el-col>
                    <el-col :span="8"> <el-button type="primary">Next</el-button></el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Header from '@/components/Header.vue'
import { useRouter } from 'vue-router';
import { request } from '@/utils/service'
let showWord = ref(true)
onMounted(async () => {
    const info = await request({
        url: "/word/list", method: 'post', data: {
            "pageNo": 1,
            "pageSize": 10
        }
    })
    console.log(info);


})
let activeNames = ref(['1'])
const router = useRouter()
function handleGoBack() {
    router.push('/')
}
function showMeanings() {
    showWord.value = !showWord.value
}
</script>

<style lang="less" scoped>
.recite-word-container {

    .recite-word-inner-container {
        margin: 0 auto;
        width: 80%;
        height: 50%;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;

        .title-word-container {
            text-align: center;
            font-size: 29px;
            width: 90%;
            height: 50vh;
            border: 1px solid #eeeeee;
            border-radius: 5px;
            box-shadow: 2px 2px 2p #eeeeee;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            color: #ff7c0a;
            font-weight: bold;
            margin-top: 40px;

        }

        .meaning-collapse-container {
            width: 100%;

            .english-meaning-content {
                width: 90%;
                font-weight: bold;
            }

            .chinese-meaning-content {
                font-weight: bold;
                text-align: left;
                width: 90%;
            }

            .sentence-container {
                font-size: 13px;
            }
        }

        .bottom-btn-group {
            position: fixed;
            bottom: 30px;
            width: 100%;
            height: 40px;
            border-bottom: 1px solid #eeeeee;
            text-align: center;
        }
    }
}
</style>