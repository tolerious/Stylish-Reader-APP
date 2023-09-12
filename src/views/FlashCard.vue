<template>
    <Header title="Flash Card" @goBack="handleGoBack"></Header>
    <div class="recite-word-container">
        <div class="recite-word-inner-container">
            <template v-if="wordList.length > 0 || shouldShowCard">
                <div class="title-word-container" @click="showMeanings" v-if="showWord">
                    <div class="word">{{ currentWordObj?.wordDetail[0].name }}</div>
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
                    <div class="bottom-btn-group-inner">
                        <el-button type="success" @click="pronounce">Audio</el-button>
                        <el-button type="danger" @click="goWordList">Word List</el-button>
                        <el-button v-if="source === 'normal'" type="info" @click="wordMotion('prev')">Prev</el-button>
                        <el-button v-if="source === 'normal'" type="primary" @click="wordMotion('next')">Next</el-button>
                    </div>
                    <el-row justify="space-around">
                        <el-col :span="6"> </el-col>
                        <el-col :span="6"> </el-col>
                        <el-col :span="6" v-if="source === 'normal'"> </el-col>
                        <el-col :span="6" v-if="source === 'normal'"> </el-col>
                    </el-row>
                </div>
            </template>
            <template v-else>
                <el-empty description="No Data." />
            </template>
            <div class="roll-back">
                <el-button @click="showMeanings" :icon="Refresh" size="large" circle />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Refresh } from "@element-plus/icons-vue";
import { onMounted, ref } from 'vue';
import Header from '@/components/Header.vue'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
import { request } from '@/utils/service'
let showWord = ref(true)
// #region lifecycle
onMounted(async () => {
    source.value = route.params.source
    queryString.value = route.query
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
let source = ref('')
let queryString = ref('')
let currentWordName = ref('')
let currentWordObj = ref(null)
let wordList = ref([])
let shouldShowCard = ref(true)
const router = useRouter()
const route = useRoute()
// #endregion

// #region function

function goWordList() {
    router.push('/wordlist/' + defaultGroup.value)
}

async function pronounce() {
    let b = await audioSourceReady(currentWordName.value)
}

async function cycleWord() {
    switch (route.params.source) {
        case 'normal':
            // 普通模式，每次只获取一个单词
            if (queryString.value.sharedGroupID) {
                defaultGroup.value = queryString.value.sharedGroupID
            } else {
                await getDefaultGroup()
            }
            await getWordsByGroupID(defaultGroup.value)
            await audioSourceReady(currentWordObj?.value.wordDetail[0].name)
            break;
        case 'group':
            defaultGroup.value = route.query.groupID
            await getWordsByGroupID(defaultGroup.value)
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
            audio.pause()
            audio.currentTime = 0
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
    if (wordList.value.length > 0) {
        currentWordName.value = wordList.value[0].wordDetail[0].name
        currentWordObj.value = wordList.value[0]

    }
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
        margin-bottom: 40px;

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

            &-inner {
                display: flex;
                flex-direction: row;
                justify-content: space-around;
                align-items: center;
            }
        }
    }

    .roll-back {
        position: fixed;
        // background-color: blue;
        height: 40px;
        width: 40px;
        bottom: 120px;
        right: 20px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;

    }
}
</style>