<template>
    <Header title="Flash Card" @goBack="handleGoBack"></Header>
    <div class="recite-word-container">
        <div class="recite-word-inner-container">
            <template v-if="wordList.length > 0">
                <div class="title-word-container" @click="showMeanings" v-if="showWord">
                    <span>{{ currentWordName }}</span>
                    <audio id="reciteWordAudio" type="audio/mpeg" :src="audioUrl"></audio>
                </div>
                <div class="meaning-collapse-container" v-else>
                    <el-collapse v-model="activeNames">
                        <el-collapse-item title="First Meaning" name="1">
                            <div class="english-meaning-content">
                                <div><span>a strong feeling such as love or anger, or strong feelings in general</span>
                                </div>
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
                                <div><span>a strong feeling such as love or anger, or strong feelings in general</span>
                                </div>
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
                                <div><span>a strong feeling such as love or anger, or strong feelings in general</span>
                                </div>
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
                        <el-col :span="8"> <el-button type="info" @click="preWord">Prev</el-button></el-col>
                        <el-col :span="8"> <el-button type="primary" @click="nextWord">Next</el-button></el-col>
                    </el-row>
                </div>
            </template>
            <template v-else>
                <el-empty description="No Data." />
            </template>

        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Header from '@/components/Header.vue'
import { useRoute, useRouter } from 'vue-router';
import { request } from '@/utils/service'
let showWord = ref(true)
// #region lifecycle
onMounted(async () => {
    console.log(route.params);
    console.log(route.query);
    source.value = route.params.source
    switch (route.params.source) {
        case 'normal':
            break;
        case 'group':
            groupID.value = route.query.groupID
            getWordsByGroupID(groupID.value)
            interval.value = setInterval(() => {
                let audio = document.getElementById('reciteWordAudio')
                audioUrl.value = `https://dict.youdao.com/dictvoice?audio=${currentWordName.value}&type=1`
                console.log(audioUrl.value);
                audio.play()
                console.log('...');

            }, 10000)
    }


})
// #endregion

// #region variable
let activeNames = ref(['1'])
let audioUrl = ref('')
let originUrl = ref('https://dict.youdao.com/dictvoice?type=1&audio=')
let source = ref('')
let groupID = ref('')
let currentWordName = ref('')
let wordList = ref([])
let interval = ref(null)
const router = useRouter()
const route = useRoute()
// #endregion

// #region function
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve
        }, ms);
    })
}
async function getWordsByGroupID(id) {
    let info = await request({ url: '/word/bygroup', method: 'post', data: { groupID: id } })
    console.log(info.data);
    wordList.value = info.data
    if (info.data.length > 0)
        currentWordName.value = info.data[0].wordDetail[0].name
}
function handleGoBack() {
    router.go(-1)
}
function showMeanings() {
    showWord.value = !showWord.value
}
function preWord() {
    showWord.value = true
}
function nextWord() {
    showWord.value = true
}
// #endregion
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