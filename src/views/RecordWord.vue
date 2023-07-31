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
        <el-collapse v-model="activeNames">
            <el-collapse-item :title="`${card.name} - ${card.property} - ${card.phonetic}`" :name="index"
                v-for="card, index in cardList">
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
                </template>
            </el-collapse-item>
        </el-collapse>
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
let activeNames = ref([])
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
    activeNames.value = []
    for (var i = 0; i < info.data.length; i++) {
        activeNames.value.push(i)
    }
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
    margin: 0 auto 55px auto;

    .collapse-header {
        margin-bottom: 5px;
        font-size: 15px;
        color: #409eff;
        font-weight: bold;
    }

    .dsense-title-container {
        color: #409eff;
        font-weight: 15px;
        font-weight: bold;
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