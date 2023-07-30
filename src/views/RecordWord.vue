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
                <el-divider content-position="left">No. {{ index + 1 }}</el-divider>
                <template v-for="mean in card.meanings">
                    <div class="meaning">{{ mean.en }}</div>
                    <div class="meaning">{{ mean.zh }}</div>
                    <template v-for="sentence in mean.sentences">
                        <div class="sentence"> {{ sentence }}</div>
                    </template>
                </template>
            </div>
        </el-card>
        <!-- <el-collapse v-model="activeNames">
            <el-collapse-item v-for="item, index in  form.wordDescriptionList " :key="index" :title="`Option ${index + 1}`"
                :name="index">
                <el-form :model="item" label-width="80">
                    <el-form-item label="EN">
                        <el-input v-model="item.englishDescription"></el-input>
                    </el-form-item>
                    <el-form-item label="ZH">
                        <el-input v-model="item.chineseDescription"></el-input>
                    </el-form-item>
                    <el-form-item label="Sentence">
                        <el-input v-model="item.sentence" type="textarea" :rows="5" label="Sentence"></el-input>
                    </el-form-item>
                    <el-form-item label="Level">
                        <el-select v-model="item.level">
                            <el-option label="" value=""></el-option>
                            <el-option label="A1" value="A1"></el-option>
                            <el-option label="A2" value="A2"></el-option>
                            <el-option label="B1" value="B1"></el-option>
                            <el-option label="B2" value="B2"></el-option>
                            <el-option label="C1" value="C1"></el-option>
                            <el-option label="C2" value="C2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Group">
                        <el-select v-model="defaultGroup">
                            <el-option label="" value=""></el-option>
                            <el-option v-for="group in groupList" :key="group._id" :label="group.name"
                                :value="group._id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Property">
                        <el-select v-model="item.partOfSpeech">
                            <el-option label="" value=""></el-option>
                            <el-option label="n." value="n."></el-option>
                            <el-option label="v." value="v."></el-option>
                            <el-option label="adj." value="adj."></el-option>
                            <el-option label="adv." value="adv."></el-option>
                            <el-option label="prep." value="prep."></el-option>
                        </el-select>
                    </el-form-item>

                </el-form>
            </el-collapse-item>
        </el-collapse> -->
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
const activeNames = ref(0)
let wordDescription: Ref<WD>
let audioUrl = ref('https://dict.youdao.com/dictvoice?type=1&audio=')
let originUrl = ref('https://dict.youdao.com/dictvoice?type=1&audio=')
const form: Ref<WDL> = ref({
    englishName: 'good',
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
    width: 90%;
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