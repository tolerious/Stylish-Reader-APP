<template>
    <Header :title="'Record Word'" @go-back="handleGoBack" />
    <div class="record-word-container">
        <el-form :inline="true" :model="form" label-width="80px">
            <el-form-item label="Word:">
                <el-input v-model="form.englishName"></el-input>
                <el-button style="margin-left: 15px;" type="primary" @click="grabWord">查询</el-button>
            </el-form-item>
            <audio id="wordAudio" type="audio/mpeg" :src="audioUrl"></audio>

        </el-form>
        <el-card v-for="card, index in cardList" :key="index" style="margin-bottom: 20px;">
            <template #header>
                <div class="card-header">
                    <span>{{ card.name }} </span>
                    <span>{{ card.property }} </span>
                    <span> {{ card.phonetic }}</span>
                </div>
            </template>
            <div>
                <template v-for="dsenseObj in card.dsenseObjList">
                    <el-card v-for="dsense in dsenseObj.defBlockObjList">
                        <template #header>
                            <div class="card-header">
                                <span>{{ dsense.en }}</span>
                            </div>
                        </template>
                        <div>{{ dsense.zh }}</div>
                        <template v-for="sentence in dsense.sentence">
                            <div>{{ sentence }}</div>
                        </template>
                    </el-card>

                </template>
            </div>
        </el-card>
        <div class="bottom-btn-group">
            <el-button type="primary">Confirm</el-button>
            <el-button type="danger" @click="playAudio(form.englishName)">Pronounce</el-button>
            <el-button type="warning" @click="addNewItem">New Item</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
import { onMounted, ref } from 'vue';
import type { Ref } from 'vue';
import { useRouter } from 'vue-router';
import { request } from '@/utils/service'

// #region interface

interface WD {
    englishDescription: string,
    partOfSpeech: string,
    level: string,
    chineseDescription: string,
    sentence: string,
    group: string,
}

interface WDL {
    englishName: string,
    wordDescriptionList: WD[]
}
// #endregion

// #region variable
const router = useRouter()
let wordDescription: Ref<WD>
let audioUrl = ref('https://dict.youdao.com/dictvoice?type=1&audio=')
let originUrl = ref('https://dict.youdao.com/dictvoice?type=1&audio=')
const form: Ref<WDL> = ref({
    englishName: 'enjoy',
    wordDescriptionList: []
})
let defaultGroup = ref('')
let groupList = ref([])
let cardList = ref([])
// #endregion

// #region lifecycle
onMounted(() => {
    wordDescription = ref({
        englishDescription: '',
        partOfSpeech: '',
        level: '',
        chineseDescription: '',
        sentence: '',
        group: '',
    })
    form.value.wordDescriptionList.push(wordDescription.value)
    getDefaultGroup()
    getGroupList()
})
// #endregion

// #region function
function playAudio(word) {
    let audio = document.getElementById('wordAudio')
    audioUrl.value = originUrl.value + word
    setTimeout(() => {
        audio.play()
    }, 300);
}
async function grabWord() {
    const info = await request({
        url: '/word/grab',
        method: 'post',
        data: {
            word: form.value.englishName
        }
    })
    cardList.value = info.data
    playAudio(form.value.englishName)
}

function addNewItem() {
    wordDescription = ref({
        englishDescription: '',
        partOfSpeech: '',
        level: '',
        chineseDescription: '',
        sentence: '',
        group: '',
    })
    form.value.wordDescriptionList.push(wordDescription.value)
}
function handleGoBack() {
    router.push('/')
}
async function getGroupList() {
    const info = await request({
        url: '/wordgroup'
    })
    groupList.value = info.data
}
async function getDefaultGroup() {
    const info = await request({
        url: '/usersetting', method: 'post'
    })
    defaultGroup.value = info.data.defaultGroupID
}
// #endregion
</script>

<style scoped lang="less">
.record-word-container {
    width: 95%;
    margin: 0 auto 50px auto;

    .card-header {
        height: 30px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        gap: 20px;
        font-weight: bold;
        font-size: 16px;
    }

    .sentence {
        color: rgb(255, 124, 10);
    }

    .bottom-btn-group {
        height: 30px;
        position: fixed;
        bottom: 15px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 90%;
        color: #ff7c0ab3;
    }


}
</style>