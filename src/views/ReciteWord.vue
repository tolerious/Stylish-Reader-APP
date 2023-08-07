<template>
    <Header title="Flash Card" @goBack="handleGoBack"></Header>
    <div class="recite-word-container">
        <div class="recite-word-inner-container">
            <template v-if="wordList.length > 0 || shouldShowCard">
                <div class="title-word-container" @click="showMeanings" v-if="showWord">
                    <div class="word">{{ currentWordName }}</div>
                    <span class="phonetic">{{ currentWordObj?.wordDetail[0].phonetic }}</span>
                </div>
                <div class="meaning-collapse-container" v-else>
                    <el-collapse v-if="currentWordObj.wordDetail.length > 0" v-model="activeNames">
                        <el-collapse-item :title="`${card.name}`" :name="index"
                            v-for="card, index in currentWordObj.wordDetail">
                            <div class="collapse-header">{{ card.property }} {{ card.phonetic }}</div>
                            <template v-for="dsenseObj in card.dsenseObjList">
                                <el-card style="margin-bottom: 15px;" v-for="dsense in dsenseObj.defBlockObjList">
                                    <template #header>
                                        <div class="dsense-title-container">{{ dsense.en }}</div>
                                        <div class="dsense-title-container">{{ dsense.zh }}</div>
                                    </template>
                                    <div>
                                        <div v-for="sentence in dsense.sentence">
                                            {{ sentence }}
                                        </div>
                                    </div>
                                </el-card>
                                <el-card style="margin-bottom: 15px;" v-for="dsense in dsenseObj.phraseBlockObjList">
                                    <template #header>
                                        <div class="dsense-title-container">{{ dsense.en }}</div>
                                        <div class="dsense-title-container">{{ dsense.zh }}</div>
                                    </template>
                                    <div>
                                        <div v-for="sentence in dsense.sentence">
                                            {{ sentence }}
                                        </div>
                                    </div>
                                </el-card>
                            </template>
                        </el-collapse-item>
                    </el-collapse>
                </div>
                <div class="bottom-btn-group">
                    <audio id="reciteWordAudio" autoplay type="audio/mpeg" :src="audioUrl"></audio>
                    <el-row justify="space-around">
                        <el-col :span="6"> <el-button type="danger" @click="showMeanings">Rollback</el-button></el-col>
                        <el-col :span="6"> <el-button type="success" @click="pronounce">Audio</el-button></el-col>
                        <el-col :span="6" v-if="source === 'normal'"> <el-button type="info"
                                @click="wordMotion('prev')">Prev</el-button></el-col>
                        <el-col :span="6" v-if="source === 'normal'"> <el-button type="primary"
                                @click="wordMotion('next')">Next</el-button></el-col>
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
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
import { request } from '@/utils/service'
import { ElMessage } from 'element-plus';
let showWord = ref(true)
// #region lifecycle
onMounted(async () => {
    source.value = route.params.source
    cycleWord()
})
// #endregion

// #region variable
onBeforeRouteLeave((from, to) => {

})
let defaultGroup = ref('')
let currentIndex = 0
let activeNames = ref([0])
let audioUrl = ref('')
let originUrl = ref('https://dict.youdao.com/dictvoice?type=1&audio=')
let source = ref('')
let groupID = ref('')
let currentWordName = ref('')
let currentWordObj = ref(null)
let wordList = ref([])
let shouldShowCard = ref(true)
const router = useRouter()
const route = useRoute()
// #endregion

// #region function

async function pronounce() {
    let b = await audioSourceReady(currentWordName.value)
}

async function getNextWord() {
    let info = await request({ url: '/word/only/one' })
    if (info.data.length > 0) {
        currentWordObj = info.data[0]
        currentWordName.value = info.data[0].wordDetail[0].name
    }
}

async function cycleWord() {
    switch (route.params.source) {
        case 'normal':
            // 普通模式，每次只获取一个单词
            await getDefaultGroup()
            await getWordsByGroupID(defaultGroup.value)
            await getNextWord()
            await audioSourceReady(currentWordName.value)
            break;
        case 'group':
            groupID.value = route.query.groupID
            await getWordsByGroupID(groupID.value)
            for (let f of generateItem()) {
                currentWordName.value = f.wordDetail[0].name
                currentWordObj.value = f
                let r = await audioSourceReady(f.wordDetail[0].name)
                let rs = await audioSourceReady(f.wordDetail[0].name)
                await sleep(5000)

            }
    }

}
async function getDefaultGroup() {
    const info = await request({
        url: '/usersetting', method: 'post'
    })
    defaultGroup.value = info.data.defaultGroupID
}
function* generateItem() {
    for (let i = 0; i < wordList.value.length; i++) {
        yield wordList.value[i]
    }
}
function audioSourceReady(name) {
    return new Promise(resolve => {
        let audio = document.getElementById('reciteWordAudio')! as HTMLMediaElement
        let url = `https://dict.youdao.com/dictvoice?audio=${name}&type=1`
        if (audio && url === audio.src) {
            audio.play()
            resolve(true)

        } else {
            audioUrl.value = url
            audio?.addEventListener('loadeddata', async () => {
                audio.play();
                await sleep(3000)
                resolve(true)
            })
        }

    })

}
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    })
}
async function getWordsByGroupID(id) {
    let info = await request({ url: '/word/bygroup', method: 'post', data: { groupID: id } })
    wordList.value = info.data
    if (wordList.value.length > 0)
        currentWordName.value = wordList.value[0].wordDetail[0].name
}
function handleGoBack() {
    router.go(-1)
}
function showMeanings() {
    showWord.value = !showWord.value
}
async function wordMotion(motion: string) {
    showWord.value = true
    if (motion === 'prev') {
        currentIndex--;
        if (currentIndex < 0) currentIndex = wordList.value.length - 1
        currentWordObj.value = wordList.value[currentIndex]
        currentWordName.value = currentWordObj.value.wordDetail[0].name
        await audioSourceReady(currentWordName.value)
    }
    if (motion === 'next') {
        currentIndex++;
        if (currentIndex > wordList.value.length - 1) currentIndex = 0
        currentWordObj.value = wordList.value[currentIndex]
        currentWordName.value = currentWordObj.value.wordDetail[0].name
        await audioSourceReady(currentWordName.value)
    }
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
            // display: flex;
            // flex-direction: column;
            // justify-content: space-around;
            // align-items: center;
            color: #ff7c0a;
            font-weight: bold;
            margin-top: 40px;
            position: relative;

            .word {
                position: absolute;
                left: 0;
                right: 0;
                top: 40%;
                margin: auto;
                display: block;
                width: 90%;
                height: 40px;
                line-height: 40px;
            }

            .phonetic {
                position: absolute;
                top: calc(40% + 40px);
                font-size: 13px;
                left: 0;
                right: 0;
                margin: auto;
                height: 20px;
                color: black;
                font-weight: normal;

            }

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