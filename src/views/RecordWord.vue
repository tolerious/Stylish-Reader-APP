<template>
    <Header :title="'Record Word'" @go-back="handleGoBack" />
    <div class="record-word-container">
        <div class="search-container">
            <div class="search-label-container">
                <span>Word:</span>
            </div>
            <div> <el-input autofocus="true" ref="grabWordInput" @keyup.enter="grabWord" style="width: 180px;"
                    v-model="form.englishName"></el-input>
            </div>
            <div> <el-button type="primary" @click="grabWord">Search</el-button>
            </div>
        </div>
        <div class="search-container">
            <div class="search-label-container">
                <span>Group:</span>
            </div>
            <div>
                <el-select style="width: 180px;" v-model="defaultGroup">
                    <el-option value="" label=""></el-option>
                    <el-option v-for="group in groupList" :value="group._id" :label="group.name"></el-option>
                </el-select>
            </div>
            <div><el-button type="warning" @click="playAudio(form.englishName)">&nbsp;Audio&nbsp;</el-button></div>
        </div>
        <audio id="wordAudio" type="audio/mpeg" :src="audioUrl"></audio>
        <el-collapse v-if="cardList.length > 0" v-model="activeNames">
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
        <el-empty description="No Data." v-else />
        <div class="bottom-btn-group">
            <el-button type="warning" @click="playAudio(form.englishName)">Pronounce</el-button>
            <el-button type="primary" @click="addNewItem">Add Word</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
import { onMounted, ref } from 'vue';
import type { Ref } from 'vue';
import { useRouter } from 'vue-router';
import { request } from '@/utils/service'
import { ElMessage, ElNotification } from 'element-plus';

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
let timer = ref(null)
const grabWordInput = ref(null)
let groupID = ref('')
const router = useRouter()
let activeNames = ref([])
let wordDescription: Ref<WD>
let audioUrl = ref('https://dict.youdao.com/dictvoice?type=1&audio=')
let originUrl = ref('https://dict.youdao.com/dictvoice?type=1&audio=')
const form: Ref<WDL> = ref({
    englishName: '',
    wordDescriptionList: []
})
let defaultGroup = ref('')
let groupList = ref([])
let cardList = ref([])
// #endregion

// #region lifecycle
onMounted(() => {
    document.addEventListener('keydown', (e) => {
        if (timer.value) {
            clearTimeout(timer.value)
        }
        timer.value = setTimeout(() => {
            // 76 for focusing,l
            if (e.ctrlKey && e.shiftKey && e.keyCode == 76) {
                if (grabWordInput.value)
                    grabWordInput.value.focus()
            }
            // 59 for adding, ;
            if (e.ctrlKey && e.shiftKey && e.keyCode == 59) {
                addNewItem()
            }
            // 188 for audio, ,
            if (e.ctrlKey && e.shiftKey && e.keyCode == 188) {
                if (form.value.englishName)
                    playAudio(form.value.englishName)
            }
        }, 1200);


    })
    wordDescription = ref({
        englishDescription: '',
        partOfSpeech: '',
        level: '',
        chineseDescription: '',
        sentence: '',
        group: '',
    })
    getDefaultGroup()
    getGroupList()
})
// #endregion

// #region function

function playAudio(word) {
    if (!word) {
        ElMessage({ message: 'Please input word first', type: 'warning', duration: 1200 });
        return
    }
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

async function addNewItem() {
    if (cardList.value.length == 0) {
        ElNotification({ message: 'Please search a word first.', type: 'warning', duration: 1200, })
        return
    }
    if (!defaultGroup.value) {
        ElNotification({ message: 'Select a group first', type: 'warning', duration: 1200 })
        return
    }
    let d = {
        wordDetail: cardList.value,
        groupID: defaultGroup.value
    }
    const info = await request({
        url: '/word', method: 'post', data: d
    })
    if (info.code === 200) {
        ElNotification({
            message: "Add Successfully.", type: 'success', duration: 500
        })
        form.value.englishName = ''
        cardList.value = []
    }
}
function handleGoBack() {
    router.push('/home')
}
async function getGroupList() {
    const info = await request({
        url: '/wordgroup/child'
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
    margin-top: 15px;

    .search-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 10px;

        &>div:nth-child(3) {
            width: 100px;
        }

        .search-label-container {
            width: 50px;
            text-align: right;
        }
    }

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